// controllers/livreController.js
const db = require('../config/db');

const getAllBooks = (req, res) => {
    // Logique pour récupérer tous les Livres
    
    res.send('Liste des livres');
};

const getOneBook = (req, res) => {
     // Logique pour récupérer un Livre
     res.send('Affiche Un livre')
}

const createBook = () => {
    // Logique pour enregistrer un Livre
    res.send('Un livre crée')
}

const updateBook = () => {
    res.send('Un livre modifier')
}

const deleteBook = () => {
    res.send('Suprimer un livre')
}

module.exports = { getAllBooks, getOneBook, createBook, updateBook, deleteBook };


