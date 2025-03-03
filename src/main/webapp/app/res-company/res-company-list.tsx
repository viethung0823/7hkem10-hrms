import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { ResCompanyDTO } from 'app/res-company/res-company-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function ResCompanyList() {
  const { t } = useTranslation();
  useDocumentTitle(t('resCompany.list.headline'));

  const [resCompanies, setResCompanies] = useState<ResCompanyDTO[]>([]);
  const navigate = useNavigate();

  const getAllResCompanies = async () => {
    try {
      const response = await axios.get('/api/resCompanies');
      setResCompanies(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/resCompanies/' + id);
      navigate('/resCompanies', {
            state: {
              msgInfo: t('resCompany.delete.success')
            }
          });
      getAllResCompanies();
    } catch (error: any) {
      if (error?.response?.data?.code === 'REFERENCED') {
        const messageParts = error.response.data.message.split(',');
        navigate('/resCompanies', {
              state: {
                msgError: t(messageParts[0]!, { id: messageParts[1]! })
              }
            });
        return;
      }
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    getAllResCompanies();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('resCompany.list.headline')}</h1>
      <div>
        <Link to="/resCompanies/add" className="btn btn-primary ms-2">{t('resCompany.list.createNew')}</Link>
      </div>
    </div>
    {!resCompanies || resCompanies.length === 0 ? (
    <div>{t('resCompany.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('resCompany.id.label')}</th>
            <th scope="col">{t('resCompany.name.label')}</th>
            <th scope="col">{t('resCompany.address.label')}</th>
            <th scope="col">{t('resCompany.phone.label')}</th>
            <th scope="col">{t('resCompany.email.label')}</th>
            <th scope="col">{t('resCompany.website.label')}</th>
            <th scope="col">{t('resCompany.taxCode.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {resCompanies.map((resCompany) => (
          <tr key={resCompany.id}>
            <td>{resCompany.id}</td>
            <td>{resCompany.name}</td>
            <td>{resCompany.address}</td>
            <td>{resCompany.phone}</td>
            <td>{resCompany.email}</td>
            <td>{resCompany.website}</td>
            <td>{resCompany.taxCode}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/resCompanies/edit/' + resCompany.id} className="btn btn-sm btn-secondary">{t('resCompany.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(resCompany.id!)} className="btn btn-sm btn-secondary">{t('resCompany.list.delete')}</button>
              </div>
            </td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
    )}
  </>);
}
