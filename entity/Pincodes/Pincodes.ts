export interface IPincodeOffice {
  officeName: string;
  district: string;
  state: string;
  block: string | null;
  delivery: boolean;
}

export class PincodeOffice implements IPincodeOffice {
  officeName: string;
  district: string;
  state: string;
  block: string | null;
  delivery: boolean;

  constructor(data: IPincodeOffice) {
    this.officeName = data.officeName;
    this.district = data.district;
    this.state = data.state;
    this.block = data.block;
    this.delivery = data.delivery;
  }
}

export interface IPincodeData {
  offices: IPincodeOffice[];
}

export class PincodeData implements IPincodeData {
  offices: PincodeOffice[];

  constructor(data: IPincodeData) {
    this.offices = data.offices.map((o) => new PincodeOffice(o));
  }
}
