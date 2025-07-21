export interface CommandParameters {
  query: string;
  near?: string;
  price?: string;
  open_now: boolean;
  rating?: number;
}

export interface CommandI {
  action: 'restaurant_search';
  parameters: CommandParameters;
}
