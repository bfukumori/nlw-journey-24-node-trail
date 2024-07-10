export type CreateLinkDTORequest = {
  title: string;
  url: string;
  tripId: string;
};

export type CreateLinkDTOResponse = {
  linkId: string;
};
