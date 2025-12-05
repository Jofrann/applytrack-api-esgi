import { Router } from 'express';
import { authenticationMiddleware } from '../middlewares/authentication.js';
import { 
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany
} from '../controllers/companies.controller.js';

// Définition des routes pour les companies
const router = Router();

// Routes CRUD pour les companies, protégées par le middleware d'authentification
router.post('/', authenticationMiddleware, createCompany);
router.get('/', authenticationMiddleware, getCompanies);
router.get('/:id', authenticationMiddleware, getCompanyById);
router.put('/:id', authenticationMiddleware, updateCompany);
router.delete('/:id', authenticationMiddleware, deleteCompany);

export default router;
