import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';

export const journalService = {
  async getAll(filters: { page?: number; limit?: number; published?: boolean } = {}) {
    const { page = 1, limit = 9, published = true } = filters;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (published !== undefined) where.isPublished = published;

    const [total, posts] = await Promise.all([
      prisma.journalPost.count({ where }),
      prisma.journalPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true, title: true, slug: true, excerpt: true,
          imageUrl: true, tags: true, publishedAt: true,
          author: true, readTime: true, isPublished: true,
        },
      }),
    ]);

    return { posts, pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
  },

  async getBySlug(slug: string) {
    const post = await prisma.journalPost.findUnique({ where: { slug } });
    if (!post || !post.isPublished) throw ApiError.notFound('Post not found');
    return post;
  },

  async create(data: any) {
    const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const publishedAt = data.isPublished ? new Date() : null;
    const { summary, ...rest } = data;
    return prisma.journalPost.create({
      data: {
        ...rest,
        slug,
        publishedAt,
        excerpt: summary,
      }
    });
  },

  async update(id: string, data: any) {
    const existing = await prisma.journalPost.findUnique({ where: { id } });
    let publishedAt = data.publishedAt;
    if (data.isPublished && (!existing || !existing.isPublished)) {
      publishedAt = new Date();
    } else if (data.isPublished === false) {
      publishedAt = null;
    }
    const { summary, ...rest } = data;
    return prisma.journalPost.update({
      where: { id },
      data: {
        ...rest,
        publishedAt,
        excerpt: summary,
      }
    });
  },

  async delete(id: string) {
    return prisma.journalPost.delete({ where: { id } });
  },
};
