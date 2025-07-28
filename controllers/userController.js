//(2)
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');



const JWT_SECRET = 'ma_cle_secrete'; // tu peux changer cette valeur

// controllers/userController.js
const userModel = require('../models/userModel');

const getAllUsers = (req, res) => {
    const sql = 'SELECT * FROM Utilisateur';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des utilisateurs :', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        res.status(200).json(results);
    });
};


const getOneUser = (req, res) => {
    //Logique pour afficher un utilisateur

    const userId = req.params.id;
    const sql = 'SELECT * FROM Utilisateur WHERE Utilisateur_ID = ?';

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération de l\'utilisateur :', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.status(200).json(results[0]); // On retourne le premier utilisateur trouvé
    });
};

const createUser = async (req, res) => {
   const { Nom, Prenoms, Email, Mot_de_passe, Role, Date_inscription, Photo } = req.body;

   if (!Nom || !Prenoms || !Email || !Mot_de_passe || !Role  || !Photo) {
     return res.status(400).json({ message: 'Tous les champs sont requis' });
   }

   const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!regexEmail.test(Email)) {
    return res.status(400).json({ message: 'Email invalide' });
   }

   // Vérifier si l'email existe déjà
   const checkSql = 'SELECT * FROM Utilisateur WHERE Email = ?';
   db.query(checkSql, [Email], async (err, results) => {
    if (err) {
      console.error('Erreur lors de la vérification de l’email :', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: 'Cet utilisateur exist déjà ' });
    }

    try {
      //Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(Mot_de_passe, 10); // 10 = nombre de "rounds"

      const insertSql = 'INSERT INTO Utilisateur (Nom, Prenoms, Email, Mot_de_passe, Role, Date_inscription, Photo  ) VALUES (?, ?, ?, ?, ?, ?, ?)';
      db.query(insertSql, [Nom, Prenoms, Email, hashedPassword, Role, Date_inscription, Photo ], (err, result) => {
        if (err) {
          console.error('Erreur lors de la création de l’utilisateur :', err);
          return res.status(500).json({ message: 'Erreur serveur' });
        }

        res.status(201).json({ message: 'Utilisateur créé avec succès',id: result.insertId,});
      });
    } catch (hashError) {
      console.error('Erreur lors du hachage du mot de passe :', hashError);
      res.status(500).json({ message: 'Erreur serveur (hachage)' });
    }
  });
};

const connetUser = (req, res) => {
  const { Email, Mot_de_passe } = req.body;

  if (!Email || !Mot_de_passe) {
    return res.status(400).json({ message: 'Email et Mot de passe sont requis' });
  }

  const checkEmail = 'SELECT * FROM Utilisateur WHERE Email = ?';
  db.query(checkEmail, [Email], async (err, results) => {
    if (err) {
      console.error('Erreur lors de la vérification de l’email :', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Aucune inscription trouvée' });
    }

    const utilisateur = results[0];

    try {
      const isPasswordCorrect = await bcrypt.compare(Mot_de_passe, utilisateur.Mot_de_passe);

      if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Mot de passe incorrect' });
      }
      
     // if(utilisateur.Role === "admin"){
     //   console.log("Bonjour Admin");
     // }

      // Création du token JWT
      const token = jwt.sign(
        { id: utilisateur.Utilisateur_ID, role: utilisateur.Role },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Sauvegarder le token dans la table Session
      const expiration = new Date(Date.now() + 60 * 60 * 1000); // 1h
      const Created_at = new Date(); // Date actuelle
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      const insertSession = `INSERT INTO Session (Utilisateur_ID, Token_hash, Created_at, Expires_at) 
      VALUES (?, ?, ?, ?)`;

      db.query(insertSession,[utilisateur.Utilisateur_ID, hashedToken, Created_at, expiration], (err) => {
          if (err) {
            console.error('Erreur insertion session :', err);
            return res.status(500).json({ message: 'Erreur lors de la création de session' });
          }

          // Réponse envoyée au frontend
            return res.status(200).json({
            message: 'Connexion réussie',token,
            utilisateur: {
              id: utilisateur.Utilisateur_ID,
              nom: utilisateur.Nom,
              prenoms: utilisateur.Prenoms,
            }});
        });

    } catch (compareError) {
      console.error('Erreur comparaison mot de passe :', compareError);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  });
};


const updateUser = (req, res) => {
  const id = req.params.id;
  const { Nom, Prenoms, Email, Photo } = req.body;

  // Vérification basique
  if (!Nom || !Prenoms || !Email || !Photo) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  const sql = `
    UPDATE Utilisateur 
    SET Nom = ?, Prenoms = ?, Email = ?, Role = ?, Photo = ?
    WHERE Utilisateur_ID = ?
  `;

  db.query(sql, [Nom, Prenoms, Email, Role, Photo, id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la mise à jour de l’utilisateur :', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({ message: 'Utilisateur mis à jour avec succès' });
  });
};


const deleteUser = () => {
    // Logique pour suprimer un utilisateur un utilisateur

}

module.exports = {
getAllUsers,
createUser,
connetUser,
updateUser,
deleteUser,
getOneUser
};