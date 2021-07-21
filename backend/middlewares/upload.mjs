import multer from "multer"; // agit comme un middleware et il filtre
import fs from "fs"; // FileSystem est intégré à NODE, gère la création de fichier/dossier
import path from "path";

const mimeTypes = {
  // Gestion de l'extention des fichiers par objets JS
  "image/jpg": ".jpg",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
}; //Type de fichier envoyé et reconnu par toutes les plateformes

const storage = multer.diskStorage({
  // Dossier où les images seront sauvegardés + Réécriture du nom des fichiers
  destination: (req, file, callback) => {
    const dir = "images"; // Notre futur dossier images
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir); // Vérification du dossier "s'il est existe" pour éviter le plantage et le créer
    }
    callback(null, dir);
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("-"); // Remplacer espaces par tirets dans les fichiers de la dataBase, nettoyage du nom des fichiers
    const ext = mimeTypes[file.mimetype]; // Amène extention du mimeTypes selon l'extention
    const base = path.basename(name, ext); // Fonction Node qui gère encore ce qui est nom de fichier
    callback(null, Date.now() + "_" + base + ext); // Créé à la fin le nom du fichier en préfixant la date de publication
  },
});

export const upload = multer({ storage: storage }).single("image"); // Une façon de gérer l'upload par multer, champ attendu: image
