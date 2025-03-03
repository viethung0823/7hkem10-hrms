export class ResUserDTO {

  constructor(data:Partial<ResUserDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  username?: string|null;
  password?: string|null;
  name?: string|null;
  role?: number[]|null;

}
