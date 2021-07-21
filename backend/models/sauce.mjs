import mongoose from "mongoose";

// Création d'un template de sauces
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true }, // Ajout de nom de sauce
  manufacturer: { type: String, required: true }, // Champ texte
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true }, // Lien et téléchargement de l'image
  heat: { type: Number, required: true },
  likes: { type: Number, required: true, default: 0 }, // Initialise à zéro au nombre de like
  dislikes: { type: Number, required: true, default: 0 },
  usersLiked: { type: [String], required: true }, // Garde en mémoire qui a liké
  usersDisliked: { type: [String], required: true },
});

export default mongoose.model("Sauce", sauceSchema); // Créer un modèle de ce qui est au-dessus

// 4 routes CRUD + vérif du même gars qui fait en ligne (création de sauce, update, reception de sauce, delecte)
