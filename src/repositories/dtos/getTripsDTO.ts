export type Participant = {
  id: string;
  name?: string | null;
  email: string;
  isConfirmed: boolean;
  isOwner: boolean;
  tripId: string;
};

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
