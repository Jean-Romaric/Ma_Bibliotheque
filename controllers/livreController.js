// controllers/livreController.js
const { NULL } = require('mysql/lib/protocol/constants/types');
const db = require('../config/db');

const getAllBooks = (req, res) => {
    // Logique pour récupérer tous les Livres
    const sql = 'SELECT * FROM Livre'
    db.query(sql,(err, results)=> {
        if(err){
            console.error('Erreur lors de la recupération des livres',err)
            return res.status(500).json({error:'Erreur serveur'});
        }
        res.status(200).json(results);
    });
};

const getOneBook = (req, res) => {
     // Logique pour récupérer un Livre
     const Livre_ID = req.params.id;
        const sql = 'SELECT * FROM Livre WHERE Livre_ID = ?'
        db.query(sql,[Livre_ID],(err,results)=> {
            
            if(err) {
                console.error('Erreur lors de la récupération du livre',err);
            }
            
            if ( results.length === 0){
                 return res.status(404).json({ message:'Livre non trouvé' });
            }
            res.status(200).json(results[0]);
        })
}

const createBook = (req, res) => {
  const { Titre, Auteur, Annee_publication, Genre, Image_livre } = req.body;

  if (!Titre || !Auteur || !Annee_publication || !Genre || !Image_livre) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  const checkSql = `
    SELECT * FROM Livre
    WHERE Titre = ? AND Auteur = ? AND Annee_publication = ? AND Genre = ? AND Image_livre = ?
  `;

  db.query(checkSql, [Titre, Auteur, Annee_publication, Genre, Image_livre], (err, results) => {
    if (err) {
      console.error('Erreur lors de la vérification du livre :', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    if (results.length > 0) {
      // 📌 Le livre existe déjà → on incrémente la quantité
      const updateSql = `
        UPDATE Livre
        SET Quantite = Quantite + 1
        WHERE Titre = ? AND Auteur = ? AND Annee_publication = ? AND Genre = ? AND Image_livre = ?
      `;
      db.query(updateSql, [Titre, Auteur, Annee_publication, Genre, Image_livre], (updateErr) => {
        if (updateErr) {
          console.error('Erreur lors de la mise à jour de la quantité :', updateErr);
          return res.status(500).json({ message: 'Erreur serveur' });
        }

        return res.status(200).json({ message: 'livre ajouté avec succès' });
      });

    } else {
      // 📌 Le livre n'existe pas → on l’insère avec Quantite = 1
      const insertSql = `
        INSERT INTO Livre (Titre, Auteur, Annee_publication, Genre, Image_livre, Quantite)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      db.query(insertSql, [Titre, Auteur, Annee_publication, Genre, Image_livre, 1], (insertErr) => {
        if (insertErr) {
          console.error('Erreur lors de l\'ajout du livre :', insertErr);
          return res.status(500).json({ message: 'Erreur serveur' });
        }

        return res.status(201).json({ message: 'Livre ajouté avec succès' });
      });
    }
  });
};

const updateBook = (req, res) => {
            //Récupérer les données
  const livreId = req.params.id; // ID du livre depuis l'URL
  const { Titre, Auteur, Annee_publication, Genre, Image_livre } = req.body;


            //Vérifier si le livre existe       
  const checkSql = 'SELECT * FROM Livre WHERE Livre_ID = ?';     
  db.query(checkSql, [livreId], (err, results) => {     
    if (err) {
      console.error('Erreur lors de la vérification du livre :', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

            //Effectuer la mise à jour
    const updateSql = `
      UPDATE Livre
      SET Titre = ?, Auteur = ?, Annee_publication = ?, Genre = ?, Image_livre = ?
      WHERE Livre_ID = ?
    `;

    db.query(updateSql, [Titre, Auteur, Annee_publication, Genre, Image_livre, livreId], (updateErr) => {
      if (updateErr) {
        console.error('Erreur lors de la mise à jour du livre :', updateErr);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      return res.status(200).json({ message: 'Livre modifié avec succès' });
    });
  });
};
  

const deleteBook = (req, res) => {
  const livreId = req.params.id; // Récupérer l’ID du livre

            //Vérifier si le livre existe

       const checkSql = 'SELECT * FROM Livre WHERE Livre_ID = ?';
  db.query(checkSql, [livreId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la vérification du livre :', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

       // Supprimer le livre

           const deleteSql = 'DELETE FROM Livre WHERE Livre_ID = ?';
    db.query(deleteSql, [livreId], (deleteErr) => {
      if (deleteErr) {
        console.error('Erreur lors de la suppression du livre :', deleteErr);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      return res.status(200).json({ message: 'Livre supprimé avec succès' });
    });
  });
};

module.exports = { getAllBooks, getOneBook, createBook, updateBook, deleteBook };


