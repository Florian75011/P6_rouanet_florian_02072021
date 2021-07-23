import { isOwner } from "../middlewares/auth.mjs";
import Sauce from "../models/sauce.mjs"; // import
import fs from "fs";

// 4 routes CRUD + vérif du même gars qui fait la mise en ligne (création de sauce, update, reception de sauce, delecte)

// Récupère toutes les sauces à faire afficher, route Get
export async function getAll(req, res, next) {
  try {
    const sauces = await Sauce.find({}); // Trouve toutes les sauces de l'API
    res.status(200).json(sauces);
  } catch (err) {
    res.status(500).json({ message: "Une erreur s'est produite" });
  }
}

// Récupère une sauce crée et selectionnée, route Get
export async function getOne(req, res, next) {
  try {
    const findSauce = await Sauce.findOne({ _id: req.params.id }); // Récupération d'une seule sauce
    if (findSauce) {
      res.status(200).json(findSauce);
    } else {
      res.status(404).json({ message: "Sauce introuvable" });
    }
  } catch (err) {
    res.status(500).json({ message: "Une erreur s'est produite" });
  }
}

// Crée une nouvelle sauce, route POST
export async function create(req, res, next) {
  try {
    if (req.body.sauce) {
      const obj = JSON.parse(req.body.sauce);
      obj.imageUrl = `${req.protocol}://${req.get("host")}/${req.file.path}`; // Multer va prendre le champ image pour en extraire le fichier et l'enregistrer sur le serveur, puis glisser ce qui est chargé dans req.file
      const sauce = new Sauce(obj);
      await sauce.save(); // Mongoose sauvegarde le fichier en dataBase
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
    const findSauce = await Sauce.findOne({ _id: req.params.id }); // Vérifie que la sauce existe bien et récupère ses données
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
          fs.unlink(imagePath, async (err) => { // fonction FS (Node) de suppression
            if (err) throw err; // Renvoie une éventuelle erreur classique en callback
          });
          // Remplacer le chemin de l'image par la nouvelle
          sauceData.imageUrl = `${req.protocol}://${req.get("host")}/${
            req.file.path
          }`;
        } else {
          // S'il n'y a pas de nouvelle image, la sauce est req.body
          sauceData = req.body;
        }
        // Maj final de la sauce
        await Sauce.updateOne({ _id: req.params.id }, sauceData); // Maj de la sauce effective grâce à cette fonction Mongo (get+post)
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

// Possibilité de suppression d'une sauce, route Delete
export async function deleteOne(req, res, next) {
  try {
    const findSauce = await Sauce.findOne({ _id: req.params.id }); // Get/récupération de la sauce avant de pouvoir agir dessus
    if (findSauce) {
      // Vérifier que la sauce appartient à l'utilisateur
      if (isOwner(req, res, findSauce.userId)) {
        // On récupère la sauce ajoutée par rapport à l'ID concerné + supprimer l'image avant
        const imagePath = findSauce.imageUrl.split(req.get("host") + "/")[1]; // Récupérer le chemin vers l'image
        // console.log(imagePath);
        fs.unlink(imagePath, async (err) => { // fonction FS (Node) de suppression
          if (err) throw err; // Renvoie une éventuelle erreur classique en callback
          await Sauce.deleteOne({ _id: req.params.id }); // Ensuite suppression complète de la sauce par l'ID
          res.status(200).json({ message: "Sauce supprimée" });
        });
      } else {
        res.status(403).json({ message: "Action non authorisée" }); // L'utilisateur est connecté mais n'a pas accès à la sauce
      }
    } else {
      res.status(404).json({ message: "Sauce introuvable" });
    }
  } catch (err) {
    res.status(500).json({ message: "Une erreur s'est produite" });
  }
}
 
// Additionnel : gestion des likes (POST) + index.mjs:   app.post("/api/sauces/:id/like", auth, sauce.like);
export async function like(req, res, next) {
  try {
    const findSauce = await Sauce.findOne({ _id: req.params.id });
    if (findSauce) { // Au cas où il y a un paramètre manquant
      if (req.body.userId && [-1, 0, 1].includes(req.body.like)) { // tableau avec valeurs possibles des likes/vide/dislikes
        // Retirer l'ID utilisateur des deux tableaux
        findSauce.usersLiked = findSauce.usersLiked.filter((id) => { // Fonction filter qui itère sur le tableau usersLiked
          return id != req.body.userId; // Si ID non différente, ajoute au tableau filtré ou id supprimé de la liste
        });
        findSauce.usersDisliked = findSauce.usersDisliked.filter((id) => { // Même chose. Fonction filter itère sur le tableau usersLiked
          return id != req.body.userId;
        });
        // Ajouter dans liste appropriée (ou pas) concernant le like ou dislike
        if (req.body.like == 1) {
          findSauce.usersLiked.push(req.body.userId); // 1 userID ne peut liker qu'une fois
        }
        if (req.body.like == -1) {
          findSauce.usersDisliked.push(req.body.userId); // 1 userID ne peut disliker qu'une fois
        }
        // Mettre à jour les compteur (moyenne affichée)
        findSauce.likes = findSauce.usersLiked.length;
        findSauce.dislikes = findSauce.usersDisliked.length;
        await Sauce.updateOne({ _id: req.params.id }, findSauce); // Maj de l'action sur la sauce est effective [1,0,-1]
        res.status(200).json({ message: "Sauce modifiée" });
      } else {
        res.status(400).json({ message: "Paramètre manquant ou invalide" });
      }
    } else {
      res.status(404).json({ message: "Sauce introuvable" });
    }
  } catch (err) {
    res.status(500).json({ message: "Une erreur s'est produite" });
  }
}