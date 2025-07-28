const jwt = require('jsonwebtoken');

const verifierToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, 'ma_cle_secrete', (err, utilisateur) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide' });
    }

    req.utilisateur = utilisateur; // 👈 ici on attache les infos du user // => { id: 7, nom: 'Jean', role: 'admin', email: 'jean@gmail.com' }
    next();          // 👈 on continue vers la route suivante 
  });
};

module.exports = verifierToken;
