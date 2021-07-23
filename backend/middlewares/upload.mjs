import multer from "multer"; // agit comme un middleware qui filtre et stocke
import fs from "fs"; // FileSystem est intégré à NODE pour gérer la création de fichier/dossier
import path from "path"; // import du chemin pour la gestion de l'image

const mimeTypes = {
  // Gestion de l'extention des fichiers par objets JS
  "image/jpg": ".jpg",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
}; //Types de fichier envoyé et reconnu par toutes les plateformes

const storage = multer.diskStorage({
  // Dossier où les images seront sauvegardés + Réécriture du nom des fichiers
  destination: (req, file, callback) => {
    const dir = "images"; // Notre futur dossier images
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir); // Vérification du dossier "s'il existe" pour éviter le plantage et le créer
    }
    callback(null, dir);
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("-"); // Remplacer espaces par des tirets dans les fichiers de la dataBase, nettoyage du nom des fichiers
    const ext = mimeTypes[file.mimetype]; // Amène extention du mimeTypes selon l'extention
    const base = path.basename(name, ext); // Fonction Node qui gère encore ce qui est considéré "nom de fichier"
    callback(null, Date.now() + "_" + base + ext); // Créé à la fin le nom du fichier en préfixant la date de publication (en fonction de rappel à l'intérieur de la fonction externe)
  },
});

export const upload = multer({ storage: storage }).single("image"); // Une façon de gérer l'upload par multer, champ attendu: image, exporté pour les "routes sauces" de l'index