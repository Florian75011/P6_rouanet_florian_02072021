import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Variable d'environnement
console.log(process.env.PORT);

// Connexion à MongoDB sécurisée
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
// Middlewares se plaçant entre modules, fonctions, etc. :
app.use(express.json()); // Permet de recevoir des corps de requête en JSON
app.use(helmet()); // Module de sécurité évitant certaines formes d'attaques
// Permission CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// TEST de connexion
app.post("/api/auth/signup", (req, res, next) => {
  console.log(req.body);
  res.status(200).json({ message: "test" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Serveur actif sur le port " + PORT)); // Le serveur Node va tourner continuellement
