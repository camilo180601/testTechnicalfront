export type Role = 'viewer' | 'operator' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}
