import { User as UserType } from '@/types/index';

export const MockUsers: UserType[] = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@example.com',
    role: 'admin',
    createdAt: '2023-01-01',
  },
  {
    id: '2',
    firstName: 'Bob',
    lastName: 'Jones',
    email: 'bob@example.com',
    role: 'user',
    createdAt: '2023-01-02',
  },
];
