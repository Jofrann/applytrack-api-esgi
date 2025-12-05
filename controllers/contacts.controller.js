// controllers/contacts.controller.js
import { db } from '../database/connection.js';

//
// 1) Add a contact to a company
//
export async function createContact(req, res) {
  const companyId = req.params.companyId;
  const { first_name, last_name, job_title, email, phone } = req.body;
  const userId = req.user.id;

  try {
    // Vérifier que la company appartient bien au user
    const [rows] = await db.query(
      `SELECT * FROM companies WHERE id = ? AND user_id = ?`,
      [companyId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).send("Company not found or unauthorized");
    }

    await db.query(
      `INSERT INTO contacts (company_id, first_name, last_name, job_title, email, phone)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [companyId, first_name, last_name, job_title, email, phone]
    );

    return res.status(201).send("Contact created successfully");
  } catch (error) {
    console.error("Error creating contact:", error);
    return res.status(500).send("Internal Server Error");
  }
}

//
// 2) GET all contacts for one company
//
export async function getContacts(req, res) {
  const companyId = req.params.companyId;
  const userId = req.user.id;

  try {
    // Vérifier que la company existe et appartient au user
    const [company] = await db.query(
      `SELECT * FROM companies WHERE id = ? AND user_id = ?`,
      [companyId, userId]
    );

    if (company.length === 0) {
      return res.status(404).send("Company not found or unauthorized");
    }

    const [contacts] = await db.query(
      `SELECT * FROM contacts WHERE company_id = ?`,
      [companyId]
    );

    return res.json(contacts);
  } catch (error) {
    console.error("Error getting contacts:", error);
    return res.status(500).send("Internal Server Error");
  }
}

//
// 3) DELETE a contact
//
export async function deleteContact(req, res) {
  const { companyId, contactId } = req.params;
  const userId = req.user.id;

  try {
    // Vérifier company
    const [company] = await db.query(
      `SELECT * FROM companies WHERE id = ? AND user_id = ?`,
      [companyId, userId]
    );

    if (company.length === 0) {
      return res.status(404).send("Company not found or unauthorized");
    }

    // Supprimer contact
    await db.query(
      `DELETE FROM contacts WHERE id = ? AND company_id = ?`,
      [contactId, companyId]
    );

    return res.send("Contact deleted successfully");
  } catch (error) {
    console.error("Error deleting contact:", error);
    return res.status(500).send("Internal Server Error");
  }
}
