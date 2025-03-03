export class ResCompanyDTO {

  constructor(data:Partial<ResCompanyDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  name?: string|null;
  address?: string|null;
  phone?: string|null;
  email?: string|null;
  website?: string|null;
  taxCode?: string|null;

}
