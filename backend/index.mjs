import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Variable d'environnement
console.log(process.env.PORT);

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

// TEST de connexion
app.post("/api/auth/signup", (req, res, next) => {
  console.log(req.body);
  res.status(200).json({ message: "test" });
});

// Connexion au port backend
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Serveur actif sur le port " + PORT)); // Le serveur Node va tourner continuellement

/*
    "bcrypt": "^5.0.1",
    "body-parser": "^1.19.0",
    "express": "^4.17.1",
    "jsonwebtoken": "^8.5.1",
    "mongoose": "^5.12.13",
    "mongoose-unique-validator": "^2.0.3",
    "multer": "^1.4.2"

    app.post("/api/auth/signup", (req, res, next) => {
    delete_req.body.id;
    const thing = new Thing({
      ...req.body,
    });
    thing
      .save()
      .then(() => res.status(201).json({ message: "Objet enregistré" }))
      .catch((error) => res.status(400).json({ error }));
  });
*/