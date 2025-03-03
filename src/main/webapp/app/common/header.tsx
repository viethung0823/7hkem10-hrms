import React from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';


export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="bg-light">
      <div className="container">
        <nav className="navbar navbar-light navbar-expand-md">
          <Link to="/" className="navbar-brand">
            <img src="/images/logo.png" alt={t('app.title')} width="30" height="30" className="d-inline-block align-top" />
            <span className="ps-1">{t('app.title')}</span>
          </Link>
          <button type="button" className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarToggle"
              aria-label={t('navigation.toggle')} aria-controls="navbarToggle" aria-expanded="false">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarToggle">
            <ul className="navbar-nav ms-auto">
              <li className="navbar-item">
                <Link to="/" className="nav-link">{t('navigation.home')}</Link>
              </li>
              <li className="navbar-item dropdown">
                <button type="button" className="nav-link dropdown-toggle" data-bs-toggle="dropdown" id="navbarEntitiesLink"
                    aria-expanded="false">{t('navigation.entities')}</button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarEntitiesLink">
                  <li><Link to="/hrDepartments" className="dropdown-item">{t('hrDepartment.list.headline')}</Link></li>
                  <li><Link to="/resCompanies" className="dropdown-item">{t('resCompany.list.headline')}</Link></li>
                  <li><Link to="/hrJobPositions" className="dropdown-item">{t('hrJobPosition.list.headline')}</Link></li>
                  <li><Link to="/resLocations" className="dropdown-item">{t('resLocation.list.headline')}</Link></li>
                  <li><Link to="/resProvinces" className="dropdown-item">{t('resProvince.list.headline')}</Link></li>
                  <li><Link to="/resDistrictWards" className="dropdown-item">{t('resDistrictWard.list.headline')}</Link></li>
                  <li><Link to="/hrJobTitles" className="dropdown-item">{t('hrJobTitle.list.headline')}</Link></li>
                  <li><Link to="/resUsers" className="dropdown-item">{t('resUser.list.headline')}</Link></li>
                  <li><Link to="/hrEmployees" className="dropdown-item">{t('hrEmployee.list.headline')}</Link></li>
                  <li><Link to="/hrContractTypes" className="dropdown-item">{t('hrContractType.list.headline')}</Link></li>
                  <li><Link to="/hrContracts" className="dropdown-item">{t('hrContract.list.headline')}</Link></li>
                  <li><Link to="/hrContractAnnexes" className="dropdown-item">{t('hrContractAnnex.list.headline')}</Link></li>
                  <li><Link to="/resUserRoles" className="dropdown-item">{t('resUserRole.list.headline')}</Link></li>
                  <li><Link to="/resDistricts" className="dropdown-item">{t('resDistrict.list.headline')}</Link></li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
