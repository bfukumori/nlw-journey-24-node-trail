export type Link = {
  id: string;
  title: string;
  url: string;
  tripId: string;
};

export type GetLinksDTOResponse = {
  links: Link[];
};
