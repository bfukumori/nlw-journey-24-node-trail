import { randomUUID } from 'node:crypto';

import {
  CreateLinkDTORequest,
  CreateLinkDTOResponse,
} from '../dtos/createLinkDTO.js';
import { GetLinksDTOResponse, Link } from '../dtos/getLinksDTO.js';
import { ILinkRepository } from '../interfaces/ILinkRepository.js';

export class InMemoryLinkRepository implements ILinkRepository {
  private links: Link[] = [];

  async createLink({
    title,
    tripId,
    url,
  }: CreateLinkDTORequest): Promise<CreateLinkDTOResponse> {
    const linkId = randomUUID();

    const link: Link = {
      id: linkId,
      title,
      url,
      tripId,
    };

    this.links.push(link);

    return { linkId };
  }

  async getLinks(tripId: string): Promise<GetLinksDTOResponse> {
    const links = this.links.filter((activity) => activity.tripId === tripId);

    return {
      links,
    };
  }
}
