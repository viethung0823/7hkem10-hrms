import React from 'react';
import { Link } from 'react-router';
import { Trans, useTranslation } from 'react-i18next';
import useDocumentTitle from 'app/common/use-document-title';
import './home.scss';


export default function Home() {
  const { t } = useTranslation();
  useDocumentTitle(t('home.index.headline'));

  return (<>
    <h1 className="mb-4">{t('home.index.headline')}</h1>
    <p><Trans i18nKey="home.index.text" components={{ a: <a />, strong: <strong /> }} /></p>
    <p className="mb-5">
      <span>{t('home.index.swagger.text')}</span>
      <span> </span>
      <a href={process.env.API_PATH + '/swagger-ui.html'} target="_blank">{t('home.index.swagger.link')}</a>.
    </p>
    <div className="col-md-4 mb-5">
      <h4 className="mb-3">{t('home.index.exploreEntities')}</h4>
      <div className="list-group">
        <Link to="/hrDepartments" className="list-group-item list-group-item-action">{t('hrDepartment.list.headline')}</Link>
        <Link to="/resCompanies" className="list-group-item list-group-item-action">{t('resCompany.list.headline')}</Link>
        <Link to="/hrJobPositions" className="list-group-item list-group-item-action">{t('hrJobPosition.list.headline')}</Link>
        <Link to="/resLocations" className="list-group-item list-group-item-action">{t('resLocation.list.headline')}</Link>
        <Link to="/resProvinces" className="list-group-item list-group-item-action">{t('resProvince.list.headline')}</Link>
        <Link to="/resDistrictWards" className="list-group-item list-group-item-action">{t('resDistrictWard.list.headline')}</Link>
        <Link to="/hrJobTitles" className="list-group-item list-group-item-action">{t('hrJobTitle.list.headline')}</Link>
        <Link to="/resUsers" className="list-group-item list-group-item-action">{t('resUser.list.headline')}</Link>
        <Link to="/hrEmployees" className="list-group-item list-group-item-action">{t('hrEmployee.list.headline')}</Link>
        <Link to="/hrContractTypes" className="list-group-item list-group-item-action">{t('hrContractType.list.headline')}</Link>
        <Link to="/hrContracts" className="list-group-item list-group-item-action">{t('hrContract.list.headline')}</Link>
        <Link to="/hrContractAnnexes" className="list-group-item list-group-item-action">{t('hrContractAnnex.list.headline')}</Link>
        <Link to="/resUserRoles" className="list-group-item list-group-item-action">{t('resUserRole.list.headline')}</Link>
      </div>
    </div>
  </>);
}
