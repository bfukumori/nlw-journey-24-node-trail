export type CreateActivityDTORequest = {
  title: string;
  occursAt: Date;
  tripId: string;
};

export type CreateActivityDTOResponse = {
  activityId: string;
};
