import { Router } from 'express';
import tagController from '../controllers/tagController';

const router = Router();

router.get('/', tagController.getTags);
router.post('/', tagController.createTag);
router.delete('/:id', tagController.deleteTag);

export default router;
