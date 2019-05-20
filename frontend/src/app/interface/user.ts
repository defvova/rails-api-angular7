export interface Attributes {
  email: string;
  first_name: string;
  last_name: string;
}

export class User {
  id: number;
  type: string;
  attributes: Attributes;
}
