export class ResDistrictWardDTO {

  constructor(data:Partial<ResDistrictWardDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  name?: string|null;
  code?: string|null;
  district?: number|null;

}
