export class HrContractAnnexDTO {

  constructor(data:Partial<HrContractAnnexDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  name?: string|null;
  number?: string|null;
  content?: string|null;
  dateEfective?: string|null;
  contract?: number|null;

}
