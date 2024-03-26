export interface IUserDetailForToken {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

export interface IRoles {
  title: string;
  type: string;
  description: string;
}
