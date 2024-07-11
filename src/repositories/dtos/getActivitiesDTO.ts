export type Activity = {
  id: string;
  title: string;
  occursAt: Date;
  tripId?: string;
};

export type GetActivitiesDTOResponse = {
  activities: Activity[];
};

export type GetActivitiesDTOGroupedByDate = {
  activities: {
    date: Date;
    activities: Activity[];
  }[];
};
