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
