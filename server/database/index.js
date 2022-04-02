const { MongoClient, Db } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);

module.exports = client;