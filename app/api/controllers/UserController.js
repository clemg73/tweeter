const User = require('../../Models/entity/User')
const jwt = require('jsonwebtoken');
const userController = {}
var ObjectId = require('mongodb').ObjectId;
const bcrypt = require("bcrypt")
const fs = require('fs');
require('dotenv')

userController.getUsers = async (req,res)=> {
    try {
        const docs = await User.getWithFilters()
        res.status(200).json(docs)
    } catch (err) {
        res.status(400).send({err})
    }
}
userController.getUserById = async (req,res)=> {
    try {
        const docs = await User.getWithFilters({"_id":new ObjectId(req.params.id)},{ password: 0 })
        if(docs == 0)
            res.status(404).send("")
        else
            res.status(200).json(docs)
    } catch (err) {
        res.status(404).send({err})
    }
}
userController.connexion = async (req,res)=> {
    console.log(process.env)
    try {
        const docs = await User.getWithFilters(
            {"tag":req.body.tag})
        bcrypt.compare(req.body.password, docs[0].password, (err, isValid) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Erreur interne du serveur.' });
            }

            if (!isValid) {
                return res.status(401).json({ message: 'Identifiant ou mot de passe incorrect.' });
            }
            delete docs[0].password
            docs[0].token = jwt.sign(
                { userId: docs[0]._id },
                "qsdfFGfKCKGCcgjcgcUCJucimfdLGJCGKgvcJVjgCLJgvgCVJg",
                { expiresIn: '24h' }
            )
            res.status(200).json(docs[0]);
            
        }) 
    
        
            
    } catch (err) {
        res.status(404).send({err})
    }
}
userController.getUserByTag = async (req,res)=> {
    try {
        const docs = await User.getWithFilters({"tag":req.params.tag.toLowerCase()},{ password: 0 })
        if(docs == 0)
            res.status(404).send("")
        else
            res.status(200).json(docs)
    } catch (err) {
        res.status(404).send({err})
    }
}
userController.postUser = async (req,res)=> {
   
    try {
        let data = req.body
        let user = new User(null,  data.tag.toLowerCase(), data.password, data.pseudo, "", [],  [], data.description, new Date(),[],[])
        if(!user.verify())
        {
            res.status(400).json("Un champ est manquant")
        } else{
            let tagAlreadyUse = await User.getWithFilters({"tag":user.tag},{ password: 0 })
            if(tagAlreadyUse.length > 0)
                res.status(400).send("Tag déjà utilsé")
            else
            {
                const saltRounds = 10;
                const salt = bcrypt.genSaltSync(saltRounds);
                const hashedPassword = bcrypt.hashSync(user.password, salt);
                user.password = hashedPassword

                const docs = await User.insertMany([user])
                res.status(200).json(docs[0])
            }
        }
    } catch (err) {
        res.status(400).send({err})
    }
}
userController.putPhotoUser = async (req,res)=> {
    try {
        if(req.auth.userId == req.params.id)
        {
            
            let set = {
                "photo":`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            }
            const docs = await User.updateMany({"_id":new ObjectId(req.params.id)}, {$set : set})
            if(docs == 0)
                res.status(404).send("Aucune propriété n'a changé")
            else
                res.status(200).json(docs)
        }else{
            res.status(401).send("")
        }
    } catch (err) {
        res.status(404).send({err})
    }
}
userController.putUserById = async (req,res)=> {
    try {
        if(req.auth.userId == req.params.id)
        {
            //Vérifie si les props du body sont bien des props de User
            let user = new User(null,  null, null, null, null, null, null, null, null,null,null)
            Object.keys(req.body).forEach(key => {
                if(!user.hasOwnProperty(key))
                    delete req.body[key]
            });
            const docs = await User.updateMany({"_id":new ObjectId(req.params.id)}, {$set : req.body})
            if(docs == 0)
                res.status(404).send("Aucune propriété n'a changé")
            else
                res.status(200).json(docs)
        }else{
            res.status(401).send("")
        }
    } catch (err) {
        res.status(404).send({err})
    }
}
userController.putUserFollow = async (req,res)=> {
    try { 
        if(req.auth.userId == req.body.follower)
        {
            let resFollow = {}
            let resFollowers = {}
            if(req.body.pushOrRemove == 1)
            {
                resFollow = await User.updateMany({"_id":new ObjectId(req.body.follower)}, { $push: { follow: req.body.follow } })
                resFollowers = await User.updateMany({"_id":new ObjectId(req.body.follow)}, { $push: { followers: req.body.follower } })
            }else{
                resFollow = await User.updateMany({"_id":new ObjectId(req.body.follower)}, { $pull: { follow: req.body.follow } })
                resFollowers = await User.updateMany({"_id":new ObjectId(req.body.follow)}, { $pull: { followers: req.body.follower } })
            }

            if(!resFollow || !resFollowers)
                res.status(404).send("")
            else
                res.status(200).json()
        }else{
            res.status(401).send("")
        }
    } catch (err) {
        res.status(404).send({err})
    }
}
userController.getFollowersByUserId = async (req,res)=> {
    try {
        const docs = await User.getWithFilters({"_id":new ObjectId(req.params.id)},{_id:0,tag:0,pseudo:0,photo:0,follow:0,description:0,dateInscription:0,password: 0,likesTweet:0,reTweet:0 })
        if(docs == 0)
            res.status(404).send("")
        else
            res.status(200).json(docs[0].followers)
    } catch (err) {
        res.status(404).send({err})
    }
}
userController.getFollowsByUserId = async (req,res)=> {
    try {
        const docs = await User.getWithFilters({"_id":new ObjectId(req.params.id)},{_id:0,tag:0,pseudo:0,photo:0,followers:0,description:0,dateInscription:0,password: 0,likesTweet:0,reTweet:0 })
        if(docs == 0)
            res.status(404).send("")
        else
            res.status(200).json(docs[0].follow)
    } catch (err) {
        res.status(404).send({err})
    }
}
userController.getLikesTweetsByUserId = async (req,res)=> {
    try {
        const docs = await User.getWithFilters({"_id":new ObjectId(req.params.id)},{_id:0,tag:0,pseudo:0,photo:0,followers:0,description:0,dateInscription:0,password: 0,follow:0,reTweet:0 })
        if(docs == 0)
            res.status(404).send("")
        else
            res.status(200).json(docs[0].likesTweet)
    } catch (err) {
        res.status(404).send({err})
    }
}
userController.getRandom = async (req,res)=> {
    try {
        const docs = await User.getRandoms(req.params.num)
        if(docs == 0)
            res.status(404).send("")
        else
            res.status(200).json(docs)
    } catch (err) {
        res.status(404).send({err})
    }
}
userController.deleteUsersByUserId = async (req,res)=> {
    try {
        const docs = await User.deleteMany({"_id":new ObjectId(req.params.id)})
        if(docs == 0)
            res.status(404).send("")
        else
            res.status(200).json(docs)
    } catch (err) {
        res.status(404).send({err})
    }
}

module.exports = userController
