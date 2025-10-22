import { Request, Response, NextFunction } from 'express';
import tagService from '../services/tagService';

export class TagController {
  async getTags(req: Request, res: Response, next: NextFunction) {
    try {
      const tags = await tagService.getAllTags();
      res.json(tags);
    } catch (error) {
      next(error);
    }
  }

  async createTag(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;
      const tag = await tagService.createTag(name);
      res.status(201).json(tag);
    } catch (error) {
      next(error);
    }
  }

  async deleteTag(req: Request, res: Response, next: NextFunction) {
    try {
      await tagService.deleteTag(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new TagController();
