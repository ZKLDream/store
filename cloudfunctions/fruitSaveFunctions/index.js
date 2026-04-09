const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

const getCurrentOpenId = () => {
  const wxContext = cloud.getWXContext();
  return wxContext.OPENID;
};

const getUserCollectionName = () => {
  const openid = getCurrentOpenId();
  return `fruitssave_${openid}`;
};

const createCollection = async () => {
  try {
    const collectionName = getUserCollectionName();
    await db.createCollection(collectionName);
    const collection = db.collection(collectionName);

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const yesterday = new Date(now.getTime() - 86400000).toISOString().split('T')[0];
    const dayBefore = new Date(now.getTime() - 172800000).toISOString().split('T')[0];

    // await collection.add({
    //   data: {
    //     id: 1,
    //     items: [
    //       {
    //         id: 1,
    //         productId: 1,
    //         name: '香蕉',
    //         image: 'https://picsum.photos/id/292/300/300',
    //         spec: '500g',
    //         price: 3.5,
    //         costPrice: 1,
    //         quantity: 10
    //       },
    //       {
    //         id: 2,
    //         productId: 2,
    //         name: '红富士苹果',
    //         image: 'https://picsum.photos/id/1080/300/300',
    //         spec: '500g',
    //         price: 5.8,
    //         costPrice: 2,
    //         quantity: 8
    //       }
    //     ],
    //     totalSales: 81.4,
    //     totalProfit: 55.4,
    //     date: dayBefore
    //   },
    // });

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
            id: event.data[i].id,
            items: event.data[i].items,
            totalSales: Number(event.data[i].totalSales),
            totalProfit: Number(event.data[i].totalProfit),
            date: event.data[i].date
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
        items: insertRecord.items,
        totalSales: Number(insertRecord.totalSales),
        totalProfit: Number(insertRecord.totalProfit),
        date: insertRecord.date
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
  }
};
