import prisma from '../config/database';
import { CreateProjectDTO, UpdateProjectDTO, ProjectQueryParams } from '../types';
import { AppError } from '../middleware/errorHandler';
import fs from 'fs';
import path from 'path';

export class ProjectService {
  async getAllProjects(params: ProjectQueryParams) {
    const {
      language,
      tag,
      search,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 20,
    } = params;

    const where: any = {};

    if (language) {
      where.language = { contains: language, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tag) {
      where.tags = {
        some: {
          tag: {
            name: { equals: tag, mode: 'insensitive' },
          },
        },
      };
    }

    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: { [sort]: order },
        skip,
        take: limit,
      }),
      prisma.project.count({ where }),
    ]);

    return {
      projects: projects.map(this.formatProject),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProjectById(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    return this.formatProject(project);
  }

  async createProject(data: CreateProjectDTO, filePath?: string, fileSize?: number) {
    const { tags, techStack, ...projectData } = data;

    const project = await prisma.project.create({
      data: {
        ...projectData,
        techStack: techStack ? JSON.stringify(techStack) : null,
        filePath,
        fileSize,
      },
    });

    // Handle tags
    if (tags && tags.length > 0) {
      await this.updateProjectTags(project.id, tags);
    }

    return this.getProjectById(project.id);
  }

  async updateProject(id: string, data: UpdateProjectDTO) {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const { tags, techStack, ...projectData } = data;

    await prisma.project.update({
      where: { id },
      data: {
        ...projectData,
        techStack: techStack ? JSON.stringify(techStack) : undefined,
      },
    });

    // Handle tags
    if (tags !== undefined) {
      await this.updateProjectTags(id, tags);
    }

    return this.getProjectById(id);
  }

  async deleteProject(id: string) {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Delete file if exists
    if (project.filePath && fs.existsSync(project.filePath)) {
      fs.unlinkSync(project.filePath);
    }

    await prisma.project.delete({ where: { id } });
  }

  private async updateProjectTags(projectId: string, tagNames: string[]) {
    // Remove existing tags
    await prisma.projectTag.deleteMany({ where: { projectId } });

    // Add new tags
    for (const tagName of tagNames) {
      // Find or create tag
      let tag = await prisma.tag.findUnique({ where: { name: tagName } });
      if (!tag) {
        tag = await prisma.tag.create({ data: { name: tagName } });
      }

      // Create project-tag relationship
      await prisma.projectTag.create({
        data: {
          projectId,
          tagId: tag.id,
        },
      });
    }
  }

  private formatProject(project: any) {
    return {
      ...project,
      techStack: project.techStack ? JSON.parse(project.techStack) : [],
      tags: project.tags?.map((pt: any) => ({
        id: pt.tag.id,
        name: pt.tag.name,
      })) || [],
    };
  }
}

export default new ProjectService();
