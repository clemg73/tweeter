const userController = require('../controllers/UserController')
var express = require('express');
var router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//Routes pour le controller user
router.get('/', auth, userController.getUsers)
router.get('/(:id)', auth, userController.getUserById)
router.get('/tag/(:tag)', auth, userController.getUserByTag)
router.post('/connexion', userController.connexion)
router.post('/', userController.postUser)
router.put('/follow', auth, userController.putUserFollow)
router.put('/(:id)', auth, userController.putUserById)
router.get('/followers/(:id)', auth, userController.getFollowersByUserId)
router.get('/follows/(:id)', auth, userController.getFollowsByUserId)
router.get('/likes/(:id)', auth, userController.getLikesTweetsByUserId)
router.get('/random/(:num)', userController.getRandom)
router.put('/photo/(:id)', multer, auth, userController.putPhotoUser)
//router.delete('/(:id)', userController.deleteUser)


module.exports = router;