     const db = require('../config/db');



     const createEmprunt = (req, res) => {
          const Livre_ID = req.params.Livre_ID;
          const Utilisateur_ID = req.utilisateur.id;
          const Utilisateur_Nom = req.utilisateur.nom;
          console.log(Utilisateur_Nom);
          
          const Debut_Lecture = new Date();
          console.log(Debut_Lecture);
          
          

          const  selectUserIdSql = `SELECT * FROM Emprunt WHERE Utilisateur_ID = ?`
          db.query(selectUserIdSql,[Utilisateur_ID],(err, results)=>{
               if(err){
                    console.error("Erreur serveur: ", err);
                    res.status(500).json({error:"Erreur serveur"});
               }
               console.log(results);

               const Emprunt = results[0];
               const En_Cours_Lect = 1;

               if(Emprunt.En_Cours_Lect = 0 ){//si c'est pas le cas n'insert pas (ok)
                    const createEmpruntSql = `INSERT INTO Emprunt ( Utilisateur_ID, Livre_ID, Debut_Lecture ) VALUES (?, ?, ?)`;
                    db.query(createEmpruntSql, [Utilisateur_ID, Livre_ID, Debut_Lecture, En_Cours_Lect], (err, results)=>{
                    if(err){
                    console.error("Erreur serveur:", err);
                    return res.status(500).json({message: "Erreur lors de l'emprunt !!"})
               }
               res.status(200).json({message:`${Utilisateur_Nom} commence a lire super !!`});
          });
               }

          });


          

          
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
     deleteEmprunt
    }