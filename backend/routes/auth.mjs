import bcrypt from "bcrypt";
import User from "../models/user.mjs";

// Filtre avant la fonction signUp + Validation de les paramètres en backend par rapport au frontend + Vérif email/MDP pas vide
export function checkAuthParams(req, res, next) {
  // console.log(req.body);
  if (
    req.body.email &&
    req.body.email !== "" &&
    req.body.password &&
    req.body.password !== ""
  ) {
    // Vérifier email
    if (!isValidEmail(req.body.email)) {
      res.status(400).json({ message: "Email non valide!" });
    }
    // Vérifier mot de passe
    else if (!isValidPassword(req.body.password)) {
      res.status(400).json({
        message:
          "Mot de passe non valide (6 caractères minimum, une majuscule, une minuscule, un chiffre et un caractère spécial)",
      });
    } else {
        // Création d'un utilisateur
        const newUser = new User ({
            email: req.body.email,
            password: req.body.password
        })
        // fluffy.save(function (err, fluffy) {
        //     if (err) return console.error(err);
        //     fluffy.speak();
        //   });
    }
  } else {
    res.status(400).json({ message: "Paramètres manquants ou invalides!" });
  }
}

function isValidEmail(value) {
  if (
    /\S+@\S+\.\S+/.test(value) &&
    !/[`!#$%^&*()+_ /\=\[\]{};':"\\|,<>?~]/.test(value) // Texte séparé par un arobase puis un point, puis empêche de mettre des caractères spéciaux
  ) {
    return true;
  }
  return false;
}

function isValidPassword(value) {
  // Regex pour renforcer le MDP
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,}$/;
  return re.test(value);
}

// Documentation API (2)
// POST /api/auth/login
// { email: string,
// password: string }
// { userId: string,
// token: string }
// Vérifie les informations d'identification de l'utilisateur, en renvoyant l'identifiant userID depuis la base de données
// et un jeton Web JSON signé (contenant également l'identifiant userID)
     
/*
// Utilisation de la fonction sign et login, encode un nouveau token
var jwt = require('jsonwebtoken');
var token = jwt.sign({ foo: 'bar' }, 'shhhhh');

// Exemple de construction du logIn
// Controlleur user P6. Fonction pour connecter des utilisateurs existants. Contrôle du bon mot de passe taper par l'user.
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        // Comparaison pour trouver si le MDP est bon
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
            userId: user._id,
            // Crée et vérifier token d'authentication vérifiant l'utilisateur
            token: jwt.sign(
                // Chaîne secrète temporaire mute en chaîne aléatoire
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                // La validité du token ne dure qu'une journée, déconnexion automatique
                { expiresIn: '24h' }
            )
            });
        }) // Renvoie
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
// Token d'identification pour terminer cette partie

const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
module.exports = router;
const userRoutes = require('./routes/user');
app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);
*/