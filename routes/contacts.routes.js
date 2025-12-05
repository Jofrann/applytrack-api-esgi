import { Router } from 'express';
import { authenticationMiddleware } from '../middlewares/authentication.js';
import { createContact, getContacts, deleteContact } from '../controllers/contacts.controller.js';

const router = Router();

router.post('/:companyId/contacts', authenticationMiddleware, createContact);
router.get('/:companyId/contacts', authenticationMiddleware, getContacts);
router.delete('/:companyId/contacts/:contactId', authenticationMiddleware, deleteContact);

export default router;
