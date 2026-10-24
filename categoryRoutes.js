import express from 'express';
import {
  getCategories,
  createCategory,
} from '../controllers/categoryController.js';

const router = express.Router();

router.route('/').get(getCategories).post(createCategory);

export default router;
