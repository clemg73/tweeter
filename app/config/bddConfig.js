const bdd = {}

const test = false;

if(test)
    bdd.dbName = 'tweeterTest';    
else
    bdd.dbName = 'tweeter';   

bdd.url = 'mongodb://localhost:27017';
bdd.collections = {
    "Tweet":"tweet",
    "User":"user",
    "Conversation":"conversation"
} 

module.exports = bdd
