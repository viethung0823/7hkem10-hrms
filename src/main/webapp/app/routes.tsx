import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from "./app";
import Home from './home/home';
import HrDepartmentList from './hr-department/hr-department-list';
import HrDepartmentAdd from './hr-department/hr-department-add';
import HrDepartmentEdit from './hr-department/hr-department-edit';
import ResCompanyList from './res-company/res-company-list';
import ResCompanyAdd from './res-company/res-company-add';
import ResCompanyEdit from './res-company/res-company-edit';
import HrJobPositionList from './hr-job-position/hr-job-position-list';
import HrJobPositionAdd from './hr-job-position/hr-job-position-add';
import HrJobPositionEdit from './hr-job-position/hr-job-position-edit';
import ResLocationList from './res-location/res-location-list';
import ResLocationAdd from './res-location/res-location-add';
import ResLocationEdit from './res-location/res-location-edit';
import ResProvinceList from './res-province/res-province-list';
import ResProvinceAdd from './res-province/res-province-add';
import ResProvinceEdit from './res-province/res-province-edit';
import ResDistrictWardList from './res-district-ward/res-district-ward-list';
import ResDistrictWardAdd from './res-district-ward/res-district-ward-add';
import ResDistrictWardEdit from './res-district-ward/res-district-ward-edit';
import HrJobTitleList from './hr-job-title/hr-job-title-list';
import HrJobTitleAdd from './hr-job-title/hr-job-title-add';
import HrJobTitleEdit from './hr-job-title/hr-job-title-edit';
import ResUserList from './res-user/res-user-list';
import ResUserAdd from './res-user/res-user-add';
import ResUserEdit from './res-user/res-user-edit';
import HrEmployeeList from './hr-employee/hr-employee-list';
import HrEmployeeAdd from './hr-employee/hr-employee-add';
import HrEmployeeEdit from './hr-employee/hr-employee-edit';
import HrContractTypeList from './hr-contract-type/hr-contract-type-list';
import HrContractTypeAdd from './hr-contract-type/hr-contract-type-add';
import HrContractTypeEdit from './hr-contract-type/hr-contract-type-edit';
import HrContractList from './hr-contract/hr-contract-list';
import HrContractAdd from './hr-contract/hr-contract-add';
import HrContractEdit from './hr-contract/hr-contract-edit';
import HrContractAnnexList from './hr-contract-annex/hr-contract-annex-list';
import HrContractAnnexAdd from './hr-contract-annex/hr-contract-annex-add';
import HrContractAnnexEdit from './hr-contract-annex/hr-contract-annex-edit';
import ResUserRoleList from './res-user-role/res-user-role-list';
import ResUserRoleAdd from './res-user-role/res-user-role-add';
import ResUserRoleEdit from './res-user-role/res-user-role-edit';
import Error from './error/error';


export default function AppRoutes() {
  const router = createBrowserRouter([
    {
      element: <App />,
      children: [
        { path: '', element: <Home /> },
        { path: 'hrDepartments', element: <HrDepartmentList /> },
        { path: 'hrDepartments/add', element: <HrDepartmentAdd /> },
        { path: 'hrDepartments/edit/:id', element: <HrDepartmentEdit /> },
        { path: 'resCompanies', element: <ResCompanyList /> },
        { path: 'resCompanies/add', element: <ResCompanyAdd /> },
        { path: 'resCompanies/edit/:id', element: <ResCompanyEdit /> },
        { path: 'hrJobPositions', element: <HrJobPositionList /> },
        { path: 'hrJobPositions/add', element: <HrJobPositionAdd /> },
        { path: 'hrJobPositions/edit/:id', element: <HrJobPositionEdit /> },
        { path: 'resLocations', element: <ResLocationList /> },
        { path: 'resLocations/add', element: <ResLocationAdd /> },
        { path: 'resLocations/edit/:id', element: <ResLocationEdit /> },
        { path: 'resProvinces', element: <ResProvinceList /> },
        { path: 'resProvinces/add', element: <ResProvinceAdd /> },
        { path: 'resProvinces/edit/:id', element: <ResProvinceEdit /> },
        { path: 'resDistrictWards', element: <ResDistrictWardList /> },
        { path: 'resDistrictWards/add', element: <ResDistrictWardAdd /> },
        { path: 'resDistrictWards/edit/:id', element: <ResDistrictWardEdit /> },
        { path: 'hrJobTitles', element: <HrJobTitleList /> },
        { path: 'hrJobTitles/add', element: <HrJobTitleAdd /> },
        { path: 'hrJobTitles/edit/:id', element: <HrJobTitleEdit /> },
        { path: 'resUsers', element: <ResUserList /> },
        { path: 'resUsers/add', element: <ResUserAdd /> },
        { path: 'resUsers/edit/:id', element: <ResUserEdit /> },
        { path: 'hrEmployees', element: <HrEmployeeList /> },
        { path: 'hrEmployees/add', element: <HrEmployeeAdd /> },
        { path: 'hrEmployees/edit/:id', element: <HrEmployeeEdit /> },
        { path: 'hrContractTypes', element: <HrContractTypeList /> },
        { path: 'hrContractTypes/add', element: <HrContractTypeAdd /> },
        { path: 'hrContractTypes/edit/:id', element: <HrContractTypeEdit /> },
        { path: 'hrContracts', element: <HrContractList /> },
        { path: 'hrContracts/add', element: <HrContractAdd /> },
        { path: 'hrContracts/edit/:id', element: <HrContractEdit /> },
        { path: 'hrContractAnnexes', element: <HrContractAnnexList /> },
        { path: 'hrContractAnnexes/add', element: <HrContractAnnexAdd /> },
        { path: 'hrContractAnnexes/edit/:id', element: <HrContractAnnexEdit /> },
        { path: 'resUserRoles', element: <ResUserRoleList /> },
        { path: 'resUserRoles/add', element: <ResUserRoleAdd /> },
        { path: 'resUserRoles/edit/:id', element: <ResUserRoleEdit /> },
        { path: 'error', element: <Error /> },
        { path: '*', element: <Error /> }
      ]
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}
