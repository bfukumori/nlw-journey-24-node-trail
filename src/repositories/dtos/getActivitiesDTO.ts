import { Dayjs } from 'dayjs';

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
    date: Dayjs;
    activities: Activity[];
  }[];
};
