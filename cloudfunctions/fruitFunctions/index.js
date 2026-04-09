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
  return "fruits";
};

const createCollection = async () => {
  try {
    const collectionName = getUserCollectionName();
    await db.createCollection(collectionName);
    const collection = db.collection(collectionName);
    
    await collection.add({
      data: { id: 1, category: '常见水果', name: '香蕉', desc: '香甜软糯，营养丰富', price: 3.5, costPrice: 1, image: 'https://picsum.photos/id/292/300/300' },
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
            image: event.data[i].image
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
        image: insertRecord.image
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
