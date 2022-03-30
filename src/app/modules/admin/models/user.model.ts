export interface ICompanyGroupModel {
  code: string;
  id: string;
}

export interface ICompanyModel {
  code: string;
  company: string[];
  id: string;
}

export interface IZipcodeModel {
  code: string;
  id: string;
}

export interface IUserModel {
  address: string;
  age: number;
  company: string;
  companyGroup: ICompanyGroupModel;
  id: string ;
  mail: string;
  name: string;
  phone: number;
  zipcode: string;
}
