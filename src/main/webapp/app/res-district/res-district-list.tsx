import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { ResDistrictDTO } from 'app/res-district/res-district-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function ResDistrictList() {
  const { t } = useTranslation();
  useDocumentTitle(t('resDistrict.list.headline'));

  const [resDistricts, setResDistricts] = useState<ResDistrictDTO[]>([]);
  const navigate = useNavigate();

  const getAllResDistricts = async () => {
    try {
      const response = await axios.get('/api/resDistricts');
      setResDistricts(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/resDistricts/' + id);
      navigate('/resDistricts', {
            state: {
              msgInfo: t('resDistrict.delete.success')
            }
          });
      getAllResDistricts();
    } catch (error: any) {
      if (error?.response?.data?.code === 'REFERENCED') {
        const messageParts = error.response.data.message.split(',');
        navigate('/resDistricts', {
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
    getAllResDistricts();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('resDistrict.list.headline')}</h1>
      <div>
        <Link to="/resDistricts/add" className="btn btn-primary ms-2">{t('resDistrict.list.createNew')}</Link>
      </div>
    </div>
    {!resDistricts || resDistricts.length === 0 ? (
    <div>{t('resDistrict.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('resDistrict.id.label')}</th>
            <th scope="col">{t('resDistrict.name.label')}</th>
            <th scope="col">{t('resDistrict.code.label')}</th>
            <th scope="col">{t('resDistrict.province.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {resDistricts.map((resDistrict) => (
          <tr key={resDistrict.id}>
            <td>{resDistrict.id}</td>
            <td>{resDistrict.name}</td>
            <td>{resDistrict.code}</td>
            <td>{resDistrict.province}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/resDistricts/edit/' + resDistrict.id} className="btn btn-sm btn-secondary">{t('resDistrict.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(resDistrict.id!)} className="btn btn-sm btn-secondary">{t('resDistrict.list.delete')}</button>
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
