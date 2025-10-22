import { Request } from 'express';

export interface ProjectData {
  id: string;
  name: string;
  description?: string;
  language: string;
  techStack?: string[];
  githubUrl?: string;
  demoUrl?: string;
  filePath?: string;
  fileSize?: number;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  isSample: boolean;
  tags?: TagData[];
}

export interface TagData {
  id: string;
  name: string;
}

export interface ProjectQueryParams {
  language?: string;
  tag?: string;
  search?: string;
  sort?: 'createdAt' | 'name' | 'language';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export interface CreateProjectDTO {
  name: string;
  description?: string;
  language: string;
  techStack?: string[];
  githubUrl?: string;
  demoUrl?: string;
  tags?: string[];
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  language?: string;
  techStack?: string[];
  githubUrl?: string;
  demoUrl?: string;
  tags?: string[];
}
