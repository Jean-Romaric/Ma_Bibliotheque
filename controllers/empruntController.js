const { json } = require('express');
const db = require('../config/db');


const Date_Lecture = new Date();
const En_Cours_Lect = 1;

const createEmprunt = (req, res) => {
    const Livre_ID = req.params.Livre_ID;
    const Utilisateur_ID = req.utilisateur.id;
    const Utilisateur_Nom = req.utilisateur.nom;
    

    const selectUserIdSql = `SELECT * FROM Emprunt WHERE Utilisateur_ID = ? AND Livre_ID = ? AND En_Cours_Lect = 1`;

    db.query(selectUserIdSql, [Utilisateur_ID, Livre_ID], (err, results) => {
        if (err) {
            console.error("Erreur serveur: ", err);
            return res.status(500).json({ error: "Erreur serveur" });
        }

        if (results.length == 0) {                
            const createEmpruntSql = `INSERT INTO Emprunt (Utilisateur_ID, Livre_ID, Debut_Lecture, En_Cours_Lect) VALUES (?, ?, ?, ?)`;
            db.query(createEmpruntSql, [Utilisateur_ID, Livre_ID, Date_Lecture, En_Cours_Lect], (err, results) => {
                if (err) {
                    console.error("Erreur serveur:", err);
                    return res.status(500).json({ message: "Erreur lors de l'emprunt !!" });
                }
                return res.status(200).json({ message: `${Utilisateur_Nom} commence à lire super !!` });
            });
        } else {
            return res.status(200).json({ message: `${Utilisateur_Nom} est déjà en train de lire ce livre !!` });
        }
    });
}


//PATH pour fin lecture
const empruntTerminer = (req, res)=>{
    const Livre_ID = req.params.Livre_ID;
    const Utilisateur_ID = req.utilisateur.id;
    const Utilisateur_Nom = req.utilisateur.nom;
   //let En_Cours_Lect = 1; je peut mettre directement dans la requette sql
   

     const empruntTerminerSql = `SELECT * FROM Emprunt WHERE Utilisateur_ID = ? AND Livre_ID = ? `;
     db.query(empruntTerminerSql, [Utilisateur_ID, Livre_ID], (err, results)=>{
          if(err){
               console.error("Erreur server:", err);
               return res.status(500).json({message:"Erreur server"});
          }
          //console.log(results);
          //if(results.length == 0 ){ // si l'utilisateur appuis sur ter miner pourtant il n'a pa commercer a lire 
          //     const updateSql = `UPDATE Emprunt SET En_Cours_Lect = ?`// idée :marquez les livres lu
          //}
          if(results.length === 0) {
         return res.status(400).json({message: `${Utilisateur_Nom} vous n'avez pas encore commencé ce livre `});
          }

          if(results.length > 0 ){
               const updateSql = `UPDATE Emprunt SET En_Cours_Lect = 0, Fin_lecture = ?`; //c'est  normale c'est comme si il est train de lire plusiuer fois le meme livre.
               db.query(updateSql, [Date_Lecture], (err, results)=>{
                    if(err){
                         console.error("Erreur server: ", err);
                         res.status(500).json({message:"Ereur server"});
                    }
                    return res.status(200).json({message:`Bien noté ${Utilisateur_Nom}, livres terminer super !!`})
               });
          }

     })

}



















const getAllEmprunts = (req, res) => {
    // Logique pour récupérer tous les emprunts
   
}

const getOneEmprunt = (req, res) => {
     // Logique pour récupérer un livre
    const id = req.params.id;
    const getOneEmpruntsSql =`SELECT * FROM Emprunt WHERE Emprunt_ID = ?`;

    db.query(getOneEmpruntsSql, [id], (err, results)=>{
     if(err){
          console.error('Erreur Server:', err);
          return res.status(500).json({error:"Erreur lors de la recuperation d'un emprunts"})
     }else{
          res.status(200).json({results});
     }
});

}

const updateEmprunt = (req, res) => {

//Pas utile
}

const deleteEmprunt = (req, res) => {
     
}

module.exports = {getAllEmprunts,
     getOneEmprunt,
     createEmprunt,
     updateEmprunt, 
     deleteEmprunt,
     empruntTerminer
    }