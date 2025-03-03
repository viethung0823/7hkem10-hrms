export class HrJobTitleDTO {

  constructor(data:Partial<HrJobTitleDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  name?: string|null;
  code?: string|null;
  description?: string|null;

}
