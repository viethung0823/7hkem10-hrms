export class HrEmployeeDTO {

  constructor(data:Partial<HrEmployeeDTO>) {
    Object.assign(this, data);
    if (data.status) {
      this.status = JSON.parse(data.status);
    }
    if (data.maritalStatus) {
      this.maritalStatus = JSON.parse(data.maritalStatus);
    }
  }

  id?: number|null;
  name?: string|null;
  code?: string|null;
  email?: string|null;
  workPhone?: string|null;
  gender?: string|null;
  status?: any|null;
  dateJoin?: string|null;
  dateLeft?: string|null;
  country?: string|null;
  idNumber?: string|null;
  idDate?: string|null;
  idAddress?: string|null;
  birthday?: string|null;
  placeOfBirth?: string|null;
  permanentAddress?: string|null;
  currentAddress?: string|null;
  passport?: string|null;
  maritalStatus?: any|null;
  emergencyContact?: string|null;
  emergencyPhone?: string|null;
  socialInsuranceCode?: string|null;
  taxCode?: string|null;
  religion?: string|null;
  isUnion?: boolean|null;
  company?: number|null;
  department?: number|null;
  jobPosition?: number|null;
  jobTitle?: number|null;
  province?: number|null;
  district?: string|null;
  ward?: number|null;
  user?: number|null;
  manager?: number|null;

}
