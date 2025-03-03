export class ResProvinceDTO {

  constructor(data:Partial<ResProvinceDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  name?: string|null;
  code?: string|null;

}
