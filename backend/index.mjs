import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { signUp } from "./routes/auth.mjs";
import { checkAuthParams } from "./routes/auth.mjs";
import { logIn } from "./routes/auth.mjs";
import * as sauce from "./routes/sauces.mjs";
import { auth } from "./middlewares/auth.mjs";
import { upload } from "./middlewares/upload.mjs";
import path, { dirname } from "path"; // Module Node pour gérer les chemins de fichiers
import { fileURLToPath } from 'url';

dotenv.config(); // Variable d'environnement

// Connexion à MongoDB sécurisée / COURS : https://openclassrooms.com/fr/courses/6390246-passez-au-full-stack-avec-node-js-express-et-mongodb/6466348-configurez-votre-base-de-donnees
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.moa2t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  )
  .then(() => console.log("Connexion à la base de donnée MongoDB réussie !"))
  .catch((err) =>
    console.log(
      "Echec de connexion à la base de donnée Mongo DB !" + err.message
    )
  );

const app = express();
// Middlewares se plaçant entre modules et fonctions :
app.use(express.json()); // Permet de recevoir des corps de requête en JSON
app.use(helmet()); // Module de sécurité évitant certaines formes d'attaques
// Tuto middleware appliqué à toutes les routes avec permission CORS (de base empêche les requêtes malveillantes d'accéder à des ressources)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Tout le monde a le droit d'accéder à l'API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Authorisation d'utiliser certaines en-têtes
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Authorisation d'utiliser certaines méthodes
    next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/images', express.static(path.join(__dirname, 'images'))); // Indique que le dossier possède des fichiers statiques

// Création de la route API
app.post("/api/auth/signup", checkAuthParams, signUp);
app.post("/api/auth/login", checkAuthParams, logIn);
app.get("/api/sauces", auth, sauce.getAll);
app.get("/api/sauces/:id", auth, sauce.getOne);
app.post("/api/sauces", auth, upload, sauce.create);
// app.put("/api/sauces/:id", );
app.delete("/api/sauces/:id", auth, sauce.deleteOne);

// Connexion au port backend
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Serveur actif sur le port " + PORT)); // Le serveur Node va tourner continuellement