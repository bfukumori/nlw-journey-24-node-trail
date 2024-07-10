import {
  CreateLinkDTORequest,
  CreateLinkDTOResponse,
} from '../dtos/createLinkDTO.js';
import { GetLinksDTOResponse } from '../dtos/getLinksDTO.js';

export interface ILinkRepository {
  createLink(params: CreateLinkDTORequest): Promise<CreateLinkDTOResponse>;
  getLinks(tripId: string): Promise<GetLinksDTOResponse>;
}
