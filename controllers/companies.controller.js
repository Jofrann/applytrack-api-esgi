// controllers/companies.controller.js
import { db } from '../database/connection.js';

// 1) CREATE company
export async function createCompany(req, res) {
  const { name, address, city, postal_code } = req.body;

  // req.user vient du middleware JWT
  const userId = req.user.id;

  // Insertion dans la base de données
  try {
    await db.query(
      `INSERT INTO companies (name, address, city, postal_code, user_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, address, city, postal_code, userId]
    );

    // Réponse au client & 201 Created.
    return res.status(201).send('Company created successfully');
  } catch (error) {
    // Erreur lors de l'insertion
    console.error("Error creating company:", error);
    return res.status(500).send("Internal Server Error");
  }
}

// 2) GET all companies for logged user
export async function getCompanies(req, res) {
  const userId = req.user.id;

  // Récupération des companies depuis la base de données
  try {
    const [companies] = await db.query(
      `SELECT * FROM companies WHERE user_id = ?`,
      [userId]
    );

    // Réponse au client avec la liste des companies & 200 OK.
    return res.json(companies);
  } catch (error) {
    // Erreur lors de la récupération
    console.error("Error getting companies:", error);
    return res.status(500).send("Internal Server Error");
  }
}

// 3) GET one company by ID

export async function getCompanyById(req, res) {
  // Récupérer l'ID de l'utilisateur connecté et l'ID de la company depuis les paramètres de la requête
  const userId = req.user.id;
  const companyId = req.params.id;

  try {
    // Requête pour récupérer la company spécifique & vérifier qu'elle appartient à l'utilisateur
    const [rows] = await db.query(
      `SELECT * FROM companies WHERE id = ? AND user_id = ?`,
      [companyId, userId]
    );
 
    // Si aucune company n'est trouvée, retourner une erreur 404
    if (rows.length === 0) {
      return res.status(404).send("Company not found");
    }

    // Retourner la company trouvée
    return res.json(rows[0]);
  } catch (error) {
    // Erreur lors de la récupération 
    console.error("Error getting company:", error);
    return res.status(500).send("Internal Server Error");
  }
}


// 4) UPDATE a company
export async function updateCompany(req, res) {
  // Récupérer l'ID de l'utilisateur connecté, l'ID de la company depuis les paramètres de la requête, et les nouvelles données depuis le corps de la requête
  const userId = req.user.id;
  const companyId = req.params.id;
  const { name, address, city, postal_code } = req.body;

  try {
    // Requête pour mettre à jour la company spécifique & vérifier qu'elle appartient à l'utilisateur
    await db.query(
      `UPDATE companies 
       SET name = ?, address = ?, city = ?, postal_code = ?
       WHERE id = ? AND user_id = ?`,
      [name, address, city, postal_code, companyId, userId]
    );

    // Réponse au client & 200 OK. 
    return res.send("Company updated successfully");
  } catch (error) {
    // Erreur lors de la mise à jour
    console.error("Error updating company:", error);
    return res.status(500).send("Internal Server Error");
  }
}


// 5) DELETE a company
export async function deleteCompany(req, res) {
  // Récupérer l'ID de l'utilisateur connecté et l'ID de la company depuis les paramètres de la requête
  const userId = req.user.id;
  const companyId = req.params.id;

  try {
    // Requête pour supprimer la company spécifique & vérifier qu'elle appartient à l'utilisateur
    await db.query(
      `DELETE FROM companies WHERE id = ? AND user_id = ?`,
      [companyId, userId]
    );

    // Réponse au client & 200 OK.
    return res.send("Company deleted successfully");
  } catch (error) {
    // Erreur lors de la suppression
    console.error("Error deleting company:", error);
    return res.status(500).send("Internal Server Error");
  }
}
