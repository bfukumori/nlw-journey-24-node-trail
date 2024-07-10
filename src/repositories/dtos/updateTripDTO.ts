export type UpdateTripDTORequest = {
  tripId: string;
  destination?: string;
  startsAt?: Date;
  endsAt?: Date;
};
