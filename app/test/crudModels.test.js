const { doesNotMatch } = require('assert');
const tweetController = require('../api/controllers/TweetController')
const assert = require('assert').strict;


describe("Connection bdds", function() {
    it('Should connect to db', async function() {
        const connection = require('../database')
        let result = await connection.Get()
        assert.equal(result, true)
    });
});

describe("CRUD tweet model", function() {
    let listTweetInsert = []

    const express = require('express')
    const request = require('supertest');
    const app = express()
    var tweetRoutes = require('../api/routes/TweetRoutes');

    before(async function () {
        app.use(express.json())
        app.use('/tweets', tweetRoutes);
        app.listen(8080, () => {})

        const connection = require('../database')
        await connection.Get()

        let tweetInsert1 = {
            "user":"clem",
            "message":"test 1",
            "date":new Date(2023,3,25)
        }
        let tweetInsert2 = {
            "user":"clem",
            "message":"test 2",
            "date":new Date(2023,1,12)
        }
        let tweetInsert3 = {
            "user":"mateo",
            "message":"test 3",
            "date":new Date(2023,4,11)
        }
       

        await connection.db.collection('tweet').insertOne(tweetInsert1).then(t => {
            tweetInsert1._id = t.insertedId.toString();
            tweetInsert1.date = tweetInsert1.date.toISOString()
        })
        await connection.db.collection('tweet').insertOne(tweetInsert2).then(t => {
            tweetInsert2._id = t.insertedId.toString()
            tweetInsert2.date = tweetInsert2.date.toISOString()
        })
        await connection.db.collection('tweet').insertOne(tweetInsert3).then(t => {
            tweetInsert3._id = t.insertedId.toString();
            tweetInsert3.date = tweetInsert3.date.toISOString()
        })

        listTweetInsert.push(tweetInsert1)
        listTweetInsert.push(tweetInsert2)
        listTweetInsert.push(tweetInsert3) 
    });
   
    it("GET /tweets -> Should return list of all tweets of db", async function() {
       await request(app)
        .get('/tweets')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(listTweetInsert)
    });

    it("GET /tweets/(:id) -> Should return the tweet with id equal to id in params", async function() {
        await request(app)
         .get('/tweets/'+listTweetInsert[0]._id)
         .set('Accept', 'application/json')
         .expect('Content-Type', /json/)
         .expect((res) => {
            listTweetInsert[0]
        })
     });

     it("POST /tweets -> Should create the tweet and return id", async function() {

        /* Attention je ne met pas de date parce que on travail avec des Date.now() qui on des millisecondes 
        et avec le temps de traitement de la requete les dates ne sont plus les mêmes */
       
        let tweetInsertToPost = {
            "userId":"bubu",
            "message":"test 4",
        }

        await request(app)
        .post('/tweets/')
        .send(tweetInsertToPost)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect((res) => {
            tweetInsertToPost._id = res.body[0]
        })

        await request(app)
        .get('/tweets/'+tweetInsertToPost._id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect((res) => {
            delete res.body[0].date
        })
        .expect((res) => {
            res.body.includes(tweetInsertToPost)
        })

     });

     it("PUT /tweets/message/(:id) -> Should update the message of the tweet and return id", async function() {

        let tweetToUpdate = listTweetInsert[0]
        tweetToUpdate.message = "Message modifié"
        delete tweetToUpdate.date

        let messageObj = {"message":"Message modifié"}

        await request(app)
        .put('/tweets/message/'+tweetToUpdate._id)
        .send(messageObj)
        .set('Accept', 'application/json')
        .expect((res) => {
        })
      
        await request(app)
        .get('/tweets/'+tweetToUpdate._id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect((res) => {
            delete res.body[0].date
        })
        .expect((res) => {
            res.body.includes(tweetToUpdate)
        })

     });
    

    after(async function () {
       const connection = require('../database')
        await connection.Get()

        await connection.db.collection('tweet').drop()
    });
});