import { User as UserType } from '@/types/index';

export const MockUsers: UserType[] = [
  {
    ID: '1',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@example.com',
    role: 'ADMIN',
    createdAt: '2023-01-01',
  },
  {
    ID: '2',
    firstName: 'Bob',
    lastName: 'Jones',
    email: 'bob@example.com',
    role: 'USER',
    createdAt: '2023-01-02',
  },
];
