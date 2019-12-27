
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://emlia:emlia103@mydb-djx3y.azure.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, });
client.connect(err => {
  if (err) {
    console.log(err)
    return
  }
  const collection = client.db("haha").collection("hehe");
  collection.find({}).toArray(function (err, result) { // 返回集合中所有数据
    if (err) throw err;
    console.log(result);
    client.close();
  });
  // perform actions on the collection object
});
