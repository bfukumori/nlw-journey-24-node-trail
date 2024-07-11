import { prisma } from '@/lib/prisma.js';
import { CreateLinkDTORequest } from '../dtos/createLinkDTO.js';
import { ILinkRepository } from '../interfaces/ILinkRepository.js';

export class PrismaLinkRepository implements ILinkRepository {
  async createLink({ url, title, tripId }: CreateLinkDTORequest) {
    const { id } = await prisma.link.create({
      data: {
        title,
        url,
        trip_id: tripId,
      },
    });

    return { linkId: id };
  }

  async getLinks(tripId: string) {
    const links = await prisma.link.findMany({
      where: {
        trip_id: tripId,
      },
      select: {
        id: true,
        title: true,
        url: true,
      },
    });

    return {
      links: links.map((link) => ({
        id: link.id,
        title: link.title,
        url: link.url,
      })),
    };
  }
}
