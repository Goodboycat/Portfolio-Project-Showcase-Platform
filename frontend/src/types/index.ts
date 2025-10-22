export interface Project {
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
  createdAt: string;
  updatedAt: string;
  isSample: boolean;
  tags?: Tag[];
}

export interface Tag {
  id: string;
  name: string;
}

export interface ProjectsResponse {
  projects: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateProjectData {
  name: string;
  description?: string;
  language: string;
  techStack?: string[];
  githubUrl?: string;
  demoUrl?: string;
  tags?: string[];
  file?: File;
}
