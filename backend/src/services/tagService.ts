import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class TagService {
  async getAllTags() {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
    });
    return tags;
  }

  async createTag(name: string) {
    const existingTag = await prisma.tag.findUnique({ where: { name } });
    if (existingTag) {
      throw new AppError('Tag already exists', 400);
    }

    const tag = await prisma.tag.create({
      data: { name },
    });
    return tag;
  }

  async deleteTag(id: string) {
    const tag = await prisma.tag.findUnique({ where: { id } });
    if (!tag) {
      throw new AppError('Tag not found', 404);
    }

    await prisma.tag.delete({ where: { id } });
  }
}

export default new TagService();
