const express = require('express'); //importes le module Express.
//Résultat : maintenant, express contient toutes les fonctionnalités offertes par le framework Express

const app = express();  //express() est une fonction du module Express.
                        //Mais se fichier c'est objet app 
const bcrypt = require('bcrypt');                        
const db = require('./config/db');
const verifierAdmin = require('./middlewares/verifierAdmin');
const verifierToken = require('./middlewares/verifierToken')


const userRoutes = require('./routes/userRoutes');
const livreRoutes = require('./routes/livreRoutes');
const empruntRoutes = require('./routes/empruntRoutes');
const eleveRoutes = require('./routes/eleveRoutes')
const port = 3000;



//app.use(('Api'), userRoutes);
//app.getAll();
app.use(express.json())
app.use(userRoutes);
app.use(livreRoutes);
app.use(empruntRoutes);
app.use(eleveRoutes);


app.get('/dashboard',verifierToken ,verifierAdmin, (req, res) => {
  res.json({ message: 'Bienvenue Admin !', utilisateur: req.utilisateur });
});
//Je veux demander sur les diff pages ?

app.get('/profil', verifierToken, (req, res) => {
  res.json({ message: 'Page profil', utilisateur: req.user });
});


app.get('/', (req, res) => { //req et res sont des objets qui ont des methodes
  res.send('Home Page ',{utilisateur: req.utilisateur });
})
//app.use(getAllUsers);

app.listen(port, () => {
  console.log(`Le server ecoute http://localhost:${port}`)
})
