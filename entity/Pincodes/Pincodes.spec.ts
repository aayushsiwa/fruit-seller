import { describe, expect, it } from 'vitest';

import { IPincodeOffice, PincodeData, PincodeOffice } from './Pincodes';

const mockOfficeData: IPincodeOffice = {
  officeName: 'Mumbai GPO',
  district: 'Mumbai',
  state: 'Maharashtra',
  block: 'Fort',
  delivery: true,
};

describe('PincodeOffice entity', () => {
  it('creates an instance of PincodeOffice', () => {
    const office = new PincodeOffice(mockOfficeData);
    expect(office).toBeInstanceOf(PincodeOffice);
  });

  it('maps all IPincodeOffice fields correctly', () => {
    const office = new PincodeOffice(mockOfficeData);

    expect(office.officeName).toBe('Mumbai GPO');
    expect(office.district).toBe('Mumbai');
    expect(office.state).toBe('Maharashtra');
    expect(office.block).toBe('Fort');
    expect(office.delivery).toBe(true);
  });

  it('preserves null block and false delivery', () => {
    const office = new PincodeOffice({
      officeName: 'Test PO',
      district: 'Test',
      state: 'Test',
      block: null,
      delivery: false,
    });

    expect(office.block).toBeNull();
    expect(office.delivery).toBe(false);
  });
});

describe('PincodeData entity', () => {
  it('creates an instance of PincodeData', () => {
    const data = new PincodeData({
      offices: [mockOfficeData],
    });
    expect(data).toBeInstanceOf(PincodeData);
  });

  it('maps all offices to PincodeOffice instances', () => {
    const data = new PincodeData({
      offices: [mockOfficeData],
    });

    expect(data.offices).toHaveLength(1);
    expect(data.offices[0]).toBeInstanceOf(PincodeOffice);
    expect(data.offices[0].officeName).toBe('Mumbai GPO');
  });

  it('handles empty offices array', () => {
    const data = new PincodeData({ offices: [] });

    expect(data.offices).toEqual([]);
  });
});
