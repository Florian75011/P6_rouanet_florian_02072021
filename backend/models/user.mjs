import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

// Création d'un schéma à mail unique + MDP
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: {type: String, required: true }
})
userSchema.plugin(uniqueValidator, { message: "Le champ {PATH} doit être unique" }); // Un "app.use" permettant d'user d'une clé unique

export default mongoose.model('User', userSchema);