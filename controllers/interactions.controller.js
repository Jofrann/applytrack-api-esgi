import { db } from '../database/connection.js';


// 1) Create an interaction
export async function createInteraction(req, res) {
  const { companyId } = req.params;
  const { date, type, description } = req.body;
  const userId = req.user.id;

  // Vérification et insertion dans la base de données
  try {

    //Verifier que la date à laquelle l'interaction est créée n'est pas dans le futur et n'est pas la meme que celle d'une interaction déjà existante pour cette company
    const interactionDate = new Date(date);
    const currentDate = new Date();

    // Si la date est dans le futur, renvoyer une erreur
    if (interactionDate > currentDate) {
      return res.status(400).send("Interaction date cannot be in the future");
    }

    // Vérifier que la company appartient au user
    const [company] = await db.query(
      `SELECT id FROM companies WHERE id = ? AND user_id = ?`,
      [companyId, userId]
    );

    // Si la company n'existe pas ou n'appartient pas à l'utilisateur connecté
    if (company.length === 0) {
        // Retourner une erreur 404 Not Found
      return res.status(404).send("Company not found or unauthorized");
    }

    // Insertion de l'interaction
    await db.query(
      `INSERT INTO interactions (company_id, date, type, description)
       VALUES (?, ?, ?, ?)`,
      [companyId, date, type, description]
    );

    // Réponse au client & 201 Created.
    return res.status(201).send("Interaction created successfully");
  } catch (error) {
    // Erreur lors de l'insertion
    console.error("Error creating interaction:", error);
    return res.status(500).send("Internal Server Error");
  }
}


// 2) Get all interactions for a company
export async function getInteractions(req, res) {
  const { companyId } = req.params;
  const userId = req.user.id;

  try {
    // Vérifier que la company existe et appartient au user
    const [company] = await db.query(
      `SELECT id FROM companies WHERE id = ? AND user_id = ?`,
      [companyId, userId]
    );

    // Si la company n'existe pas ou n'appartient pas à l'utilisateur connecté
    if (company.length === 0) {
      return res.status(404).send("Company not found or unauthorized");
    }

    // Récupérer les interactions associées à la company
    const [interactions] = await db.query(
      `SELECT * FROM interactions WHERE company_id = ? ORDER BY date DESC`,
      [companyId]
    );

    // Réponse au client avec la liste des interactions & 200 OK.
    return res.json(interactions);
  } catch (error) {
    console.error("Error getting interactions:", error);
    return res.status(500).send("Internal Server Error");
  }
}
