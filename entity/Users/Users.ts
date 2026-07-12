import { User as UserType, UserRole } from '@/types/index';

export class User implements UserType {
  ID: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt: string;

  constructor(data: UserType) {
    this.ID = data.ID;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.role = data.role;
    this.createdAt = data.createdAt;
  }
}
