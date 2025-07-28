const jwt = require('jsonwebtoken');
const secretKey = 'ma_cle_secrete'; // la même utilisée pour créer le token

const verifierAdmin = (req, res, next) => {
  // Récupération du token dans l'en-tête Authorization
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);

    if (decoded.role !== 'admin') { //role
      return res.status(403).json({ message: 'Accès refusé : seuls les le droit ' });
    }

    req.utilisateur = decoded; // Pour utilisation future si nécessaire
    next();

  } catch (err) {
    console.error('Erreur de vérification du token :', err);
    return res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = verifierAdmin;
