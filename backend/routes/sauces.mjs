import Sauce from "../models/sauce.mjs";


export async function getAllSauces(req, res, next) {
    try {
        const sauces = await Sauce.find({}); // Trouve les sauces de l'API
        // Authentification avant de permettre l'ajout
        console.log(sauces);
        res.status(200).json(sauces);
    } catch (err) {
        res.status(500).json({ message: "Une erreur s'est produite" });
    }
}

// export async function getAllSauces() {
//     try {
        
//     } catch (err) {
//         res.status(500).json({ message: "Une erreur s'est produite" });
//     }
// }