import { Participant } from './getParticipantsDTO.js';

export type Trip = {
  id: string;
  destination: string;
  startsAt: Date;
  endsAt: Date;
  isConfirmed: boolean;
  participants: Participant[];
  createdAt: Date;
};

export type GetTripsDTOResponse = {
  trips: Trip[];
  total: number;
};
