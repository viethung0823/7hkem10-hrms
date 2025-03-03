export class ResDistrictDTO {

  constructor(data:Partial<ResDistrictDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  name?: string|null;
  code?: string|null;
  province?: number|null;

}
