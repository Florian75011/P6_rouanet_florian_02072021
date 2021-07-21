import { isOwner } from "../middlewares/auth.mjs";
import Sauce from "../models/sauce.mjs";
import fs from "fs";

// Récupère toutes les sauces
export async function getAll(req, res, next) {
  try {
    const sauces = await Sauce.find({}); // Trouve les sauces de l'API
    // Authentification avant de permettre l'ajout
    res.status(200).json(sauces);
  } catch (err) {
    res.status(500).json({ message: "Une erreur s'est produite" });
  }
}

// Récupère une sauce crée
export async function getOne(req, res, next) {
  try {
    const findSauce = await Sauce.findOne({ _id: req.params.id });
    if (findSauce) {
      res.status(200).json(findSauce);
    } else {
      res.status(404).json({ message: "Sauce introuvable" });
    }
  } catch (err) {
    res.status(500).json({ message: "Une erreur s'est produite" });
  }
}

// Crée une nouvelle sauce
export async function create(req, res, next) {
  try {
    if (req.body.sauce) {
      const obj = JSON.parse(req.body.sauce);
      obj.imageUrl = `${req.protocol}://${req.get("host")}/${req.file.path}`; // Multer va prendre le champ image pour en extraire le fichier et l'enregistrer sur le serveur puis glisser ce qui est chargé dans req.file
      const sauce = new Sauce(obj);
      await sauce.save(); // Mongoose sauvegarde le fichier
      res.status(201).json({ message: "Sauce crée" });
    } else {
      res.status(400).json({ message: "Paramètre invalide" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Une erreur s'est produite" });
  }
}

// Possibilité de modificication d'une sauce, route PUT
export async function updateOne(req, res, next) {
  try {
    const findSauce = await Sauce.findOne({ _id: req.params.id }); // Vérifie que la sauce existe bien et récup ses données
    if (findSauce) {
      // Vérifier que la sauce appartient à l'utilisateur
      if (isOwner(req, res, findSauce.userId)) {
        let sauceData;
        // Si une image a été uploadée
        if (req.file) {
          // Si une img a été uploadée la sauce est dans req.body.sauce
          sauceData = JSON.parse(req.body.sauce);
          // Supprimer l'ancienne image
          const imagePath = findSauce.imageUrl.split(req.get("host") + "/")[1]; // Récupérer le chemin vers l'image
          fs.unlink(imagePath, async (err) => {
            // fonction FS (Node) de suppression
            if (err) throw err; // Renvoie une éventuelle erreur classique en callback
          });
          // Remplacer le chemin de l'image par la nouvelle
          sauceData.imageUrl = `${req.protocol}://${req.get("host")}/${
            req.file.path
          }`;
        } else {
          // Si pas de nouvelle image, la sauce est req.body
          sauceData = req.body;
        }
        // Maj de la sauce
        await Sauce.updateOne({ _id: req.params.id }, sauceData); // Maj de la sauce effective grâce à Mongo
        res.status(200).json({ message: "Sauce modifiée" });
      } else {
        res.status(403).json({ message: "Action non authorisée" }); // L'utilisateur est connecté mais n'a pas accès à la sauce
      }
    } else {
      res.status(404).json({ message: "Sauce introuvable" });
    }
  } catch (err) {
    // console.log(err);
    res.status(500).json({ message: "Une erreur s'est produite" });
  }
}

// Possibilité de suppression d'une sauce
export async function deleteOne(req, res, next) {
  try {
    const findSauce = await Sauce.findOne({ _id: req.params.id });
    if (findSauce) {
      // Vérifier que la sauce appartient à l'utilisateur
      if (isOwner(req, res, findSauce.userId)) {
        // On récupère la sauce ajoutée par rapport à l'ID concerné
        // Supprimer l'image avant
        const imagePath = findSauce.imageUrl.split(req.get("host") + "/")[1]; // Récupérer le chemin vers l'image
        // console.log(imagePath);
        fs.unlink(imagePath, async (err) => {
          // fonction FS (Node) de suppression
          if (err) throw err; // Renvoie une éventuelle erreur classique en callback
          // Supprimer la sauce entière
          await Sauce.deleteOne({ _id: req.params.id });
          res.status(200).json({ message: "Sauce supprimée" });
        });
      } else {
        res.status(403).json({ message: "Action non authorisée" }); // L'utilisateur est connecté mais n'a pas accès à la sauce
      }
    } else {
      res.status(404).json({ message: "Sauce introuvable" });
    }
  } catch (err) {
    // console.log(err);
    res.status(500).json({ message: "Une erreur s'est produite" });
  }
}
