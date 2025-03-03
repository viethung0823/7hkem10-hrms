export class HrContractTypeDTO {

  constructor(data:Partial<HrContractTypeDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  name?: string|null;
  code?: string|null;
  isUnlimited?: boolean|null;
  isProbationaryContract?: boolean|null;

}
