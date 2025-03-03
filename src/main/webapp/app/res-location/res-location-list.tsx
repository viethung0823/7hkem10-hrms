import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { ResLocationDTO } from 'app/res-location/res-location-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function ResLocationList() {
  const { t } = useTranslation();
  useDocumentTitle(t('resLocation.list.headline'));

  const [resLocations, setResLocations] = useState<ResLocationDTO[]>([]);
  const navigate = useNavigate();

  const getAllResLocations = async () => {
    try {
      const response = await axios.get('/api/resLocations');
      setResLocations(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/resLocations/' + id);
      navigate('/resLocations', {
            state: {
              msgInfo: t('resLocation.delete.success')
            }
          });
      getAllResLocations();
    } catch (error: any) {
      if (error?.response?.data?.code === 'REFERENCED') {
        const messageParts = error.response.data.message.split(',');
        navigate('/resLocations', {
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
    getAllResLocations();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('resLocation.list.headline')}</h1>
      <div>
        <Link to="/resLocations/add" className="btn btn-primary ms-2">{t('resLocation.list.createNew')}</Link>
      </div>
    </div>
    {!resLocations || resLocations.length === 0 ? (
    <div>{t('resLocation.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('resLocation.id.label')}</th>
            <th scope="col">{t('resLocation.name.label')}</th>
            <th scope="col">{t('resLocation.latitude.label')}</th>
            <th scope="col">{t('resLocation.longitude.label')}</th>
            <th scope="col">{t('resLocation.street.label')}</th>
            <th scope="col">{t('resLocation.districWard.label')}</th>
            <th scope="col">{t('resLocation.province.label')}</th>
            <th scope="col">{t('resLocation.district.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {resLocations.map((resLocation) => (
          <tr key={resLocation.id}>
            <td>{resLocation.id}</td>
            <td>{resLocation.name}</td>
            <td>{resLocation.latitude}</td>
            <td>{resLocation.longitude}</td>
            <td>{resLocation.street}</td>
            <td>{resLocation.districWard}</td>
            <td>{resLocation.province}</td>
            <td>{resLocation.district}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/resLocations/edit/' + resLocation.id} className="btn btn-sm btn-secondary">{t('resLocation.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(resLocation.id!)} className="btn btn-sm btn-secondary">{t('resLocation.list.delete')}</button>
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
