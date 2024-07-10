export type CreateTripDTORequest = {
  destination: string;
  startsAt: Date;
  endsAt: Date;
  ownerName: string;
  ownerEmail: string;
  emailsToInvite: string[];
};

export type CreateTripDTOResponse = {
  tripId: string;
};
