import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().optional(),
  language: z.string().min(1, 'Language is required').max(100),
  techStack: z.array(z.string()).optional(),
  githubUrl: z.string().url().optional().or(z.literal('')),
  demoUrl: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  language: z.string().min(1).max(100).optional(),
  techStack: z.array(z.string()).optional(),
  githubUrl: z.string().url().optional().or(z.literal('')),
  demoUrl: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
});

export const validateCreateProject = (req: Request, res: Response, next: NextFunction) => {
  try {
    createProjectSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
};

export const validateUpdateProject = (req: Request, res: Response, next: NextFunction) => {
  try {
    updateProjectSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
};
