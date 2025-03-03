export class ResUserRoleDTO {

  constructor(data:Partial<ResUserRoleDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  name?: string|null;

}
