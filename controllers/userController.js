//(2)
const db = require('../config/db');

// controllers/userController.js
const userModel = require('../models/userModel');

const getAllUsers = (req, res) => {
    userModel.getAllUsers((err, users) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.status(200).json(users);
    });
};

module.exports = {
    getAllUsers
};


const getOneUser = (req, res) => {
   // Logique pour afficher un utilisateur

}  

const createUser = (req, res) => {
    // Logique pour créer un utilisateur
    const nom = req.body.nom;
    const Prenoms = req.body.Prenoms;
    const email = req.body.email;
    const Mot_de_passe = req.body.Mot_de_passe;

     if (!nom || !Prenoms ||!email ||!Mot_de_passe ) {
    return res.status(400).json({ message: 'Nom,Prenoms,Email et Mot de passe requis' });
    }
    
    const sql = 'INSERT INTO Utilisateur (Nom, Prenoms, Email, Mot_de_passe ) VALUES (?, ?, ?, ?)';

    db.query(sql, [nom,Prenoms,email,Mot_de_passe], (err, result)=> {

        if (err) {
        console.error('Erreur lors de la création de l’utilisateur :', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      
       res.status(201).json({
       message: 'Utilisateur créé avec succès',
       id: result.insertId,
     });

    })
    //res.send('Utilisateur créé');
};

const updateUser = (req, res) => {
    // Logique pour modifier un utilisateur
    res.send('Modifier un utilisateur');
}

const deleteUser = () => {
    // Logique pour suprimer un utilisateur un utilisateur
}

module.exports = {
getAllUsers,
createUser,
updateUser,
deleteUser,
getOneUser
};
