export class ResLocationDTO {

  constructor(data:Partial<ResLocationDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  name?: string|null;
  latitude?: number|null;
  longitude?: number|null;
  street?: string|null;
  districWard?: number|null;
  province?: number|null;
  district?: number|null;

}
