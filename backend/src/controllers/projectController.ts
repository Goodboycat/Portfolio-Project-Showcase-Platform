import { Request, Response, NextFunction } from 'express';
import projectService from '../services/projectService';
import { MulterRequest, ProjectQueryParams } from '../types';
import path from 'path';
import fs from 'fs';

export class ProjectController {
  async getProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const params: ProjectQueryParams = {
        language: req.query.language as string,
        tag: req.query.tag as string,
        search: req.query.search as string,
        sort: req.query.sort as any,
        order: req.query.order as any,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      };

      const result = await projectService.getAllProjects(params);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getProject(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await projectService.getProjectById(req.params.id);
      res.json(project);
    } catch (error) {
      next(error);
    }
  }

  async createProject(req: MulterRequest, res: Response, next: NextFunction) {
    try {
      const file = req.file;
      const projectData = {
        ...req.body,
        techStack: req.body.techStack ? JSON.parse(req.body.techStack) : undefined,
        tags: req.body.tags ? JSON.parse(req.body.tags) : undefined,
      };

      const project = await projectService.createProject(
        projectData,
        file?.path,
        file?.size
      );

      res.status(201).json(project);
    } catch (error) {
      // Clean up uploaded file if project creation fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      next(error);
    }
  }

  async updateProject(req: Request, res: Response, next: NextFunction) {
    try {
      const projectData = {
        ...req.body,
        techStack: req.body.techStack ? JSON.parse(req.body.techStack) : undefined,
        tags: req.body.tags ? JSON.parse(req.body.tags) : undefined,
      };

      const project = await projectService.updateProject(req.params.id, projectData);
      res.json(project);
    } catch (error) {
      next(error);
    }
  }

  async deleteProject(req: Request, res: Response, next: NextFunction) {
    try {
      await projectService.deleteProject(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async downloadProject(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await projectService.getProjectById(req.params.id);

      if (!project.filePath || !fs.existsSync(project.filePath)) {
        return res.status(404).json({ message: 'Project file not found' });
      }

      const fileName = `${project.name}${path.extname(project.filePath)}`;
      res.download(project.filePath, fileName);
    } catch (error) {
      next(error);
    }
  }
}

export default new ProjectController();
