// controllers/companies.controller.js
import { db } from '../database/connection.js';

// 1) CREATE company
export async function createCompany(req, res) {
  const { name, address, city, postal_code } = req.body;
  const userId = req.user.id;

  try {
    // Vérifie si la company existe déjà pour cet user
    const [rows] = await db.query(
      `SELECT id FROM companies WHERE name = ? AND user_id = ?`,
      [name, userId]
    );

    if (rows.length > 0) {
      return res.status(400).send('Company already exists for this user!');
    }

    // Insert
    await db.query(
      `INSERT INTO companies (name, address, city, postal_code, user_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, address, city, postal_code, userId]
    );

    return res.status(201).send('Company created successfully');
  } catch (error) {
    console.error("Error creating company:", error);
    return res.status(500).send("Internal Server Error");
  }
}



// 2) GET all companies for logged user
export async function getCompanies(req, res) {
  const userId = req.user.id;

  try {
    // Récupérer toutes les companies
    const [companies] = await db.query(
      `SELECT * FROM companies WHERE user_id = ?`,
      [userId]
    );

    // Pour chaque company → récupérer la dernière interaction
    for (let company of companies) {
      const [lastInteraction] = await db.query(
        `SELECT date, type, description 
         FROM interactions 
         WHERE company_id = ?
         ORDER BY date DESC 
         LIMIT 1`,
        [company.id]
      );

      company.last_interaction = lastInteraction.length > 0 
        ? lastInteraction[0]
        : null; // Aucune interaction
    }

    return res.json(companies);
  } catch (error) {
    console.error("Error getting companies:", error);
    return res.status(500).send("Internal Server Error");
  }
}




// 3) GET one company by ID
export async function getCompanyById(req, res) {
  const userId = req.user.id;
  const companyId = req.params.id;

  try {
    const [rows] = await db.query(
      `SELECT * FROM companies WHERE id = ? AND user_id = ?`,
      [companyId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).send("Company not found");
    }

    const company = rows[0];

    // Récupérer la dernière interaction de cette company
    const [lastInteraction] = await db.query(
      `SELECT date, type, description 
       FROM interactions 
       WHERE company_id = ?
       ORDER BY date DESC 
       LIMIT 1`,
      [companyId]
    );

    company.last_interaction = lastInteraction.length > 0 
      ? lastInteraction[0]
      : null;

    return res.json(company);
  } catch (error) {
    console.error("Error getting company:", error);
    return res.status(500).send("Internal Server Error");
  }
}



// 4) UPDATE a company
export async function updateCompany(req, res) {
  const userId = req.user.id;
  const companyId = req.params.id;
  const { name, address, city, postal_code } = req.body;

  try {
    await db.query(
      `UPDATE companies 
       SET name = ?, address = ?, city = ?, postal_code = ?
       WHERE id = ? AND user_id = ?`,
      [name, address, city, postal_code, companyId, userId]
    );

    return res.send("Company updated successfully");
  } catch (error) {
    console.error("Error updating company:", error);
    return res.status(500).send("Internal Server Error");
  }
}



// 5) DELETE a company
export async function deleteCompany(req, res) {
  const userId = req.user.id;
  const companyId = req.params.id;

  try {
    await db.query(
      `DELETE FROM companies WHERE id = ? AND user_id = ?`,
      [companyId, userId]
    );

    return res.send("Company deleted successfully");
  } catch (error) {
    console.error("Error deleting company:", error);
    return res.status(500).send("Internal Server Error");
  }
}
