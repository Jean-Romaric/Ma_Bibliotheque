const express = require('express');
const router = express.Router();
const empruntController = require('../controllers/empruntController');
const verifierToken = require('../middlewares/verifierToken');


router.post('/emprunt/:Livre_ID', verifierToken, empruntController.createEmprunt);//pour enregistrer qu’un utilisateur commence à lire un livre.
router.put('/emprunt/terminer/:Livre_ID', verifierToken, empruntController.empruntTerminer)

router.get('/emprunt/user/:id',empruntController.getOneEmprunt);//lire/utilisateur/:id pour récupérer l’historique de lecture d’un utilisateur.

router.get('/emprunts/Livre/:id',empruntController.getAllEmprunts);//lire/livre/:id → pour voir qui a lu un livre (utile pour admin ou stats).

//router.put('/emprunt/:id',empruntController.updateEmprunt);

//router.delete('/emprunt/:id',empruntController.deleteEmprunt); // Pour suprimer l'historique des empreunts

module.exports = router;
