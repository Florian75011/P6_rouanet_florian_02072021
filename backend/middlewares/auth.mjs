import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function auth(req, res, next) {
    console.log("request:", req);
  // Export rend accessible la fonction dans tout le dossier
  try {
    let isConnected = false; // Variable reste sur faux à la base
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) { 
        // console.log(req.headers);
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET); // Jwt vérifie le token et le réutilise
        // req.body.decodedUserId = decodedToken.userId;
        // const userId = decodedToken.userId; // L'ID se place à l'intérieur du Token s'il n'y a pas de problème
        if (decodedToken != undefined) {
            isConnected = true; // En cas de bon fonctionnement
        }
    }
    if (isConnected) { // Nouveau if si on est bien "isConnected"
        next();
    } else {
        res.status(401).json(new Error("Pas connecté"));
    }

  } catch (err) {
    console.log(err);
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
}
