import Sauce from "../models/sauce.mjs";

export async function getAll(req, res, next) {
  // getAllSauce
  try {
    const sauces = await Sauce.find({}); // Trouve les sauces de l'API
    // Authentification avant de permettre l'ajout
    console.log(sauces);
    res.status(200).json(sauces);
  } catch (err) {
    res.status(500).json({ message: "Une erreur s'est produite" });
  }
}

export async function create(req, res, next) {
  const userId = req.body.decodedUserId; // Récupération de l'userId de l'utilisateur qui fait la requête
  const sauce = new Sauce({
    userId: "",
    name: req.body.sauce.name,
    manufacturer: "",
    description: "",
    mainPepper: "",
    imageUrl: "",
    heat: 0,
    likes: 0,
    dislikes: 0,
    userLiked: [""],
    userDisliked: [""],
    auth,
  });
}

// Modifier les routes pour prendre en compte les Fichiers

/*
Doc
{ sauce : Chaîne,
image : Fichier }

{ message : Chaîne }

Capture et enregistre l'image, analyse la sauce en utilisant
une chaîne de caractères et l'enregistre dans la base de données,
en définissant correctement son image URL. Remet les sauces aimées
et celles détestées à 0, et les sauces usersliked et celles
usersdisliked aux tableaux vides.

export async function getAllSauces() {
    try {

    } catch (err) {
        res.status(500).json({ message: "Une erreur s'est produite" });
    }
}
*/
