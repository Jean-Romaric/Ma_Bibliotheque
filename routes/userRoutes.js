//(1)C'est les routes on fait d'abord
const express = require('express');
const router = express.Router();//Router() est une fonction du module Express.
                                  //Mais se fichier c'est objet router
const userController = require('../controllers/userController');

router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);
router.put('/users',userController.updateUser);
router.delete('/users',userController.deleteUser)

//Pour accéder au methode du module  userController ?

module.exports = router; // exporter l'objet pour etre utiliser dans server.js
