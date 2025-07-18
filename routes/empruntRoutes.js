const express = require('express');
const router = express.Router();
const empruntController = require('../controllers/empruntController');

router.get('/emprunts',empruntController.getAllEmprunts);
router.get('/emprunt',empruntController.getOneEmprunt);

router.post('/emprunt',empruntController.createEmprunt);

router.put('/emprunt',empruntController.updateEmprunt);

router.delete('/emprunt',empruntController.deleteEmprunt);

module.exports = router;
