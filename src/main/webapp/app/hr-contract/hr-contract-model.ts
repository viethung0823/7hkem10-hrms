export class HrContractDTO {

  constructor(data:Partial<HrContractDTO>) {
    Object.assign(this, data);
    if (data.status) {
      this.status = JSON.parse(data.status);
    }
  }

  id?: number|null;
  name?: string|null;
  code?: string|null;
  dateFrom?: string|null;
  dateTo?: string|null;
  salary?: string|null;
  status?: any|null;
  employee?: number|null;
  contractType?: number|null;
  jobPosition?: number|null;
  jobTitle?: number|null;
  department?: number|null;
  company?: number|null;

}
