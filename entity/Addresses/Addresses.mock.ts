import { Address } from '@/types/index';

export const MockAddresses: Address[] = [
  {
    ID: 'addr-1',
    street: '123 Main St',
    city: 'Delhi',
    state: 'Delhi',
    postalCode: '110001',
    country: 'India',
    phone: '1234567890',
  },
];

export const MockAddress: Address = MockAddresses[0];
