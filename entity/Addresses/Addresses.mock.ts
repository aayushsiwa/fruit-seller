import { Address } from '@/types/index';

export const MockAddresses: Address[] = [
  {
    id: 'addr-1',
    street: '123 Main St',
    city: 'Delhi',
    state: 'Delhi',
    postal_code: '110001',
    country: 'India',
    phone: '1234567890',
  },
];

export const MockAddress: Address = MockAddresses[0];
