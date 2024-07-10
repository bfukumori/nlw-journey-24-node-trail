import { CreateInviteDTORequest } from '../dtos/createInviteDTO.js';
import {
  GetParticipantsDTOResponse,
  Participant,
} from '../dtos/getParticipantsDTO.js';

export interface IParticipantRepository {
  getParticipants(tripId: string): Promise<GetParticipantsDTOResponse>;
  findParticipantById(participantId: string): Promise<Participant | null>;
  confirmParticipant(participantId: string): Promise<void>;
  createInvite(params: CreateInviteDTORequest): Promise<Participant>;
}
