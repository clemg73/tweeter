var database = {}
   
const bdd = require('./config/bddConfig')
const dbName = bdd.dbName
const url = bdd.url

var instance = 0;

async function DbConnect() {
    try {
        const MongoClient = require('mongodb').MongoClient;    
        const client = new MongoClient(url);
        await client.connect()  
        return client.db(dbName)   
    } catch (e) {
        return e;
    }
}

database.Get = async function Get() {
    try {
        instance++;
        //console.log(`DbConnection called ${instance} times`);

        if (database.db != null) {
            //console.log(`db connection is already alive`);
        } else {
            //console.log(`getting new db connection`);
            database.db = await DbConnect();
        }
        return true;
    } catch (e) {
        return e;
    }
}

module.exports = database

// Pas de singleton
/*database.connect = async function connect() { 
    try {
        const MongoClient = require('mongodb').MongoClient;    
        const client = new MongoClient(url);
        await client.connect()  
        database.db = client.db(dbName)   
        return true
    } catch (err) {
        console.log(err)
        return false
    }  
}*/
