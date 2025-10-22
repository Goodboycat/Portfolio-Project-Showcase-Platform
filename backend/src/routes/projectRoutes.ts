import { Router } from 'express';
import projectController from '../controllers/projectController';
import { upload } from '../config/multer';
import { validateCreateProject, validateUpdateProject } from '../middleware/validation';

const router = Router();

router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProject);
router.post('/', upload.single('file'), validateCreateProject, projectController.createProject);
router.put('/:id', validateUpdateProject, projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
router.get('/:id/download', projectController.downloadProject);

export default router;
