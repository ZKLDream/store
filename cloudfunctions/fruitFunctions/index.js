const cloud = require("wx-server-sdk");
const https = require("https");
const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { URL } = require("url");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

const MAX_REDIRECTS = 5;
const MAX_DOWNLOAD_BYTES = 300 * 1024 * 1024;

// B 站 CDN 防盗链要求 Referer 必须是 https://www.bilibili.com/，
// 用 CDN 域名自身的 origin 会被 403/reset；其它站点沿用请求目标自身 origin。
const isBilibiliCdn = (host) => {
  const normalized = (host || "").toLowerCase();
  return (
    normalized.endsWith("bilivideo.com") ||
    normalized.endsWith("bilibili.com") ||
    normalized.endsWith("akamaized.net") ||
    normalized.endsWith("hdslb.com")
  );
};

const resolveReferer = (target) =>
  isBilibiliCdn(target.hostname) ? "https://www.bilibili.com/" : target.origin;

// 流式下载到本地临时文件，避免整段视频进内存导致云函数 OOM。
// 边收边写磁盘，内存常驻仅 chunk 级；文件落在 /tmp（云函数可写目录）。
const fetchToFile = (url, destPath, redirectCount = 0) =>
  new Promise((resolve, reject) => {
    if (redirectCount > MAX_REDIRECTS) {
      reject(new Error("重定向次数过多"));
      return;
    }

    let target;
    try {
      target = new URL(url);
    } catch (e) {
      reject(new Error("非法的 URL: " + url));
      return;
    }

    const client = target.protocol === "http:" ? http : https;
    const req = client.get(
      target,
      {
        headers: {
          // 带 Referer / UA 绕过常见 CDN 防盗链；B 站 CDN 需要固定 bilibili.com 域名的 Referer
          Referer: resolveReferer(target),
          "User-Agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15",
        },
      },
      (res) => {
        const status = res.statusCode || 0;

        // 跟随重定向
        if (status >= 300 && status < 400 && res.headers.location) {
          res.resume();
          const next = new URL(res.headers.location, target).toString();
          resolve(fetchToFile(next, destPath, redirectCount + 1));
          return;
        }

        if (status !== 200) {
          res.resume();
          reject(new Error("下载失败，HTTP 状态码: " + status));
          return;
        }

        const writeStream = fs.createWriteStream(destPath);
        let received = 0;
        let aborted = false;

        res.on("data", (chunk) => {
          received += chunk.length;
          if (received > MAX_DOWNLOAD_BYTES) {
            aborted = true;
            req.destroy();
            writeStream.destroy();
            reject(new Error("文件超过大小限制(300MB)"));
          }
        });

        res.pipe(writeStream);

        writeStream.on("finish", () => {
          if (!aborted) {
            resolve(received);
          }
        });
        writeStream.on("error", reject);
        res.on("error", reject);
      }
    );

    req.on("error", reject);
    req.setTimeout(300000, () => {
      req.destroy(new Error("下载超时"));
    });
  });

const getExtFromUrl = (url) => {
  try {
    const pathname = new URL(url).pathname;
    const ext = pathname.split(".").pop();
    if (ext && /^[a-zA-Z0-9]{1,5}$/.test(ext)) {
      return ext.toLowerCase();
    }
  } catch (e) {}
  return "mp4";
};

const downloadVideoToCloud = async (event) => {
  const url = event.url || (event.data && event.data.url);
  if (!url || typeof url !== "string") {
    return { success: false, errMsg: "缺少 url 参数" };
  }

  const ext = getExtFromUrl(url);
  const tmpPath = path.join(
    os.tmpdir(),
    `${Date.now()}-${Math.random().toString(36).slice(2, 11)}.${ext}`
  );

  try {
    const size = await fetchToFile(url, tmpPath);
    const cloudPath = `fruit-videos/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 11)}.${ext}`;

    const uploadRes = await cloud.uploadFile({
      cloudPath,
      fileContent: fs.createReadStream(tmpPath),
    });

    return {
      success: true,
      fileID: uploadRes.fileID,
      size,
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e && e.message ? e.message : String(e),
    };
  } finally {
    // 无论成功失败都清理临时文件，避免 /tmp 撑爆
    fs.promises.unlink(tmpPath).catch(() => {});
  }
};

const getCurrentOpenId = () => {
  const wxContext = cloud.getWXContext();
  return wxContext.OPENID;
};

const getUserCollectionName = () => {
  const openid = getCurrentOpenId();
  return "fruits";
};

const createCollection = async () => {
  try {
    const collectionName = getUserCollectionName();
    await db.createCollection(collectionName);
    const collection = db.collection(collectionName);
    
    await collection.add({
      data: { id: 1, category: '常见水果', name: '香蕉', desc: '香甜软糯，营养丰富', price: 3.5, costPrice: 1, image: 'https://picsum.photos/id/292/300/300', video: '' },
    });
    
    return {
      success: true,
      collectionName: collectionName
    };
  } catch (e) {
    return {
      success: true,
      data: "create collection success",
    };
  }
};

const selectRecord = async () => {
  const collectionName = getUserCollectionName();
  return await db.collection(collectionName).get();
};

const updateRecord = async (event) => {
  try {
    const collectionName = getUserCollectionName();
    const collection = db.collection(collectionName);
    for (let i = 0; i < event.data.length; i++) {
      await collection
        .where({
          _id: event.data[i]._id,
        })
        .update({
          data: {
            name: event.data[i].name,
            category: event.data[i].category,
            desc: event.data[i].desc,
            price: Number(event.data[i].price),
            costPrice: Number(event.data[i].costPrice),
            image: event.data[i].image,
            video: event.data[i].video || ''
          },
        });
    }
    return {
      success: true,
      data: event.data,
      collectionName: collectionName
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e,
    };
  }
};

const insertRecord = async (event) => {
  try {
    const collectionName = getUserCollectionName();
    const collection = db.collection(collectionName);
    const insertRecord = event.data;
    
    const result = await collection.orderBy('id', 'desc').limit(1).get();
    let nextId = 1;
    if (result.data.length > 0) {
      nextId = result.data[0].id + 1;
    }
    
    await collection.add({
      data: {
        id: nextId,
        category: insertRecord.category,
        name: insertRecord.name,
        desc: insertRecord.desc,
        price: Number(insertRecord.price),
        costPrice: Number(insertRecord.costPrice),
        image: insertRecord.image,
        video: insertRecord.video || ''
      },
    });
    return {
      success: true,
      data: {
        ...event.data,
        id: nextId
      },
      collectionName: collectionName
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e,
    };
  }
};

const deleteRecord = async (event) => {
  try {
    const collectionName = getUserCollectionName();
    await db
      .collection(collectionName)
      .where({
        _id: event.data._id,
      })
      .remove();
    return {
      success: true,
      collectionName: collectionName
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e,
    };
  }
};

exports.main = async (event, context) => {
  switch (event.type) {
    case "createCollection":
      return await createCollection();
    case "selectRecord":
      return await selectRecord();
    case "updateRecord":
      return await updateRecord(event);
    case "insertRecord":
      return await insertRecord(event);
    case "deleteRecord":
      return await deleteRecord(event);
    case "downloadVideoToCloud":
      return await downloadVideoToCloud(event);
  }
};
