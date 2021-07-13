import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.mjs";

dotenv.config(); // Permet d'user des .env

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
      next();
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

// Possibilité de création de comptes inscrits uniques
export async function signUp(req, res, next) {
  try {
    const hash = bcrypt.hashSync(req.body.password, 10); // Hashé le MDP côté back pour ne rien stocker dans la data base
    const user = new User({ email: req.body.email, password: hash });
    await user.save();
    res.status(201).json({ message: "Inscription de l'utilisateur réussie" }); // 201 dit que le compte est créé avec succès
  } catch (err) {
    console.log(err);
    if (err.errors && err.errors.email) {
      res.status(400).json({ message: err.errors.email });
    } else {
      res.status(500).json({ message: "Une erreur s'est produite" }); // Ne pas l'identifier précisémment pour ne pas aider les pirates informatiques
    }
  }
}

// Gestion du log in du site
export async function logIn(req, res, next) {
  try {
    // Vérifier que cet email existe
    const searchUser = await User.findOne({ email: req.body.email }); // Fonction MongoDB qui récupère un élément ajouté au paramètre
    if (searchUser != null) {
      // Comparer les mots de passe
      const comparePassword = await bcrypt.compareSync(
        req.body.password,
        searchUser.password
      ); // Renvoie true ou false
      if (comparePassword === true) {
        // Créer le token, et envoyer une réponse
        const obj = { // Créer un objet
          userId: "" + searchUser._id, // Contenu d'un jeton: user de la doc API + ID de MongoDB
          token: jwt.sign({ data: {userId: searchUser._id} }, process.env.TOKEN_SECRET, { expiresIn: '24h' }) // L'utilisateur existe vraiment, donc on lui renvoie un jeton/token ; Crypte information pour la décrypter ensuite
        }
        console.log(obj);
        res.status(200).json(obj);
      } else {
        res.status(401).json({ message: "Problème d'identification" }); // Renvoie une erreur 401 qui est une erreur d'authenfication
      }
    } else {
      res.status(400).json({ message: "Utilisateur introuvable" }); // Renvoie une erreur 400 de paramètres
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Une erreur s'est produite" }); // Ne pas l'identifier précisémment pour ne pas aider les pirates informatiques
  }
}