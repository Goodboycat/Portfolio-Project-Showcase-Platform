import axios from 'axios';
import { Project, ProjectsResponse, Tag, CreateProjectData } from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const projectsApi = {
  getAll: async (params?: Record<string, any>): Promise<ProjectsResponse> => {
    const response = await api.get('/projects', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Project> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  create: async (data: CreateProjectData): Promise<Project> => {
    const formData = new FormData();
    
    formData.append('name', data.name);
    formData.append('language', data.language);
    
    if (data.description) formData.append('description', data.description);
    if (data.githubUrl) formData.append('githubUrl', data.githubUrl);
    if (data.demoUrl) formData.append('demoUrl', data.demoUrl);
    if (data.techStack) formData.append('techStack', JSON.stringify(data.techStack));
    if (data.tags) formData.append('tags', JSON.stringify(data.tags));
    if (data.file) formData.append('file', data.file);

    const response = await api.post('/projects', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, data: Partial<CreateProjectData>): Promise<Project> => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },

  download: (id: string): string => {
    return `${API_BASE_URL}/projects/${id}/download`;
  },
};

export const tagsApi = {
  getAll: async (): Promise<Tag[]> => {
    const response = await api.get('/tags');
    return response.data;
  },

  create: async (name: string): Promise<Tag> => {
    const response = await api.post('/tags', { name });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tags/${id}`);
  },
};

export default api;
