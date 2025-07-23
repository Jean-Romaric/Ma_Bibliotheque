const bcrypt = require('bcrypt');
const db = require('../config/db');

const createUser = async (req, res) => {
  const { nom, Prenoms, email, Mot_de_passe } = req.body;

  if (!nom || !Prenoms || !email || !Mot_de_passe) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email)) {
    return res.status(400).json({ message: 'Email invalide' });
  }

  // Vérifier si l'email existe déjà
  const checkSql = 'SELECT * FROM Utilisateur WHERE Email = ?';
  db.query(checkSql, [email], async (err, results) => {
    if (err) {
      console.error('Erreur lors de la vérification de l’email :', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé' });
    }

    try {
      // 🔐 Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(Mot_de_passe, 10); // 10 = nombre de "rounds"

      const insertSql = 'INSERT INTO Utilisateur (Nom, Prenoms, Email, Mot_de_passe) VALUES (?, ?, ?, ?)';
      db.query(insertSql, [nom, Prenoms, email, hashedPassword], (err, result) => {
        if (err) {
          console.error('Erreur lors de la création de l’utilisateur :', err);
          return res.status(500).json({ message: 'Erreur serveur' });
        }

        res.status(201).json({
          message: 'Utilisateur créé avec succès',
          id: result.insertId,
        });
      });
    } catch (hashError) {
      console.error('Erreur lors du hachage du mot de passe :', hashError);
      res.status(500).json({ message: 'Erreur serveur (hachage)' });
    }
  });
};

module.exports = { createUser };
