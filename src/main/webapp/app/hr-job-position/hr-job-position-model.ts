export class HrJobPositionDTO {

  constructor(data:Partial<HrJobPositionDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  name?: string|null;
  isRecruiting?: boolean|null;
  targetRecruitment?: number|null;
  jobSummary?: string|null;
  company?: number|null;
  department?: number|null;
  location?: number|null;

}
