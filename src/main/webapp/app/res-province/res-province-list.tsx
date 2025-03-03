import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { ResProvinceDTO } from 'app/res-province/res-province-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function ResProvinceList() {
  const { t } = useTranslation();
  useDocumentTitle(t('resProvince.list.headline'));

  const [resProvinces, setResProvinces] = useState<ResProvinceDTO[]>([]);
  const navigate = useNavigate();

  const getAllResProvinces = async () => {
    try {
      const response = await axios.get('/api/resProvinces');
      setResProvinces(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/resProvinces/' + id);
      navigate('/resProvinces', {
            state: {
              msgInfo: t('resProvince.delete.success')
            }
          });
      getAllResProvinces();
    } catch (error: any) {
      if (error?.response?.data?.code === 'REFERENCED') {
        const messageParts = error.response.data.message.split(',');
        navigate('/resProvinces', {
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
    getAllResProvinces();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('resProvince.list.headline')}</h1>
      <div>
        <Link to="/resProvinces/add" className="btn btn-primary ms-2">{t('resProvince.list.createNew')}</Link>
      </div>
    </div>
    {!resProvinces || resProvinces.length === 0 ? (
    <div>{t('resProvince.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('resProvince.id.label')}</th>
            <th scope="col">{t('resProvince.name.label')}</th>
            <th scope="col">{t('resProvince.code.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {resProvinces.map((resProvince) => (
          <tr key={resProvince.id}>
            <td>{resProvince.id}</td>
            <td>{resProvince.name}</td>
            <td>{resProvince.code}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/resProvinces/edit/' + resProvince.id} className="btn btn-sm btn-secondary">{t('resProvince.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(resProvince.id!)} className="btn btn-sm btn-secondary">{t('resProvince.list.delete')}</button>
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
