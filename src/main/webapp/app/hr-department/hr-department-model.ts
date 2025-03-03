export class HrDepartmentDTO {

  constructor(data:Partial<HrDepartmentDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  code?: string|null;
  name?: string|null;
  parent?: number|null;
  company?: number|null;

}
