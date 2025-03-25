export interface UserInterface {
  id?: string;
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  bio?: string;
  avatar?: string;
  banner?: string;
  theme?: string[];
  authentic?: boolean;
  verified: boolean;
  code?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
