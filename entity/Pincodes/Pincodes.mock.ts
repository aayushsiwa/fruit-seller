import { PincodeData, PincodeOffice } from './Pincodes';

export const MockPincodeOffices: PincodeOffice[] = [
  new PincodeOffice({
    officeName: 'Mumbai GPO',
    district: 'Mumbai',
    state: 'Maharashtra',
    block: 'Fort',
    delivery: true,
  }),
  new PincodeOffice({
    officeName: 'Elephanta Caves PO',
    district: 'Raigarh',
    state: 'Maharashtra',
    block: 'Raigarh',
    delivery: true,
  }),
];

export const MockPincodeData: PincodeData = new PincodeData({
  offices: MockPincodeOffices,
});

export const MockSinglePincodeData: PincodeData = new PincodeData({
  offices: [
    new PincodeOffice({
      officeName: 'Ludhiana HO',
      district: 'Ludhiana',
      state: 'Punjab',
      block: 'Bharat Nagar Chowk',
      delivery: true,
    }),
  ],
});
