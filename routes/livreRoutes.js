// routes/livreRoutes.js
const express = require('express');
const router = express.Router();
const livreController = require('../controllers/livreController');

// Définir la route qui utilise le contrôleur
router.get('/livres', livreController.getAllBooks);
router.get('/livre',livreController.getOneBook);

router.post('/livre/register', livreController.createBook);
router.put('/livre',livreController.updateBook);

router.delete('/livre',livreController.deleteBook)

module.exports = router;
