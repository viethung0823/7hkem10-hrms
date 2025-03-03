import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { ResDistrictWardDTO } from 'app/res-district-ward/res-district-ward-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function ResDistrictWardList() {
  const { t } = useTranslation();
  useDocumentTitle(t('resDistrictWard.list.headline'));

  const [resDistrictWards, setResDistrictWards] = useState<ResDistrictWardDTO[]>([]);
  const navigate = useNavigate();

  const getAllResDistrictWards = async () => {
    try {
      const response = await axios.get('/api/resDistrictWards');
      setResDistrictWards(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/resDistrictWards/' + id);
      navigate('/resDistrictWards', {
            state: {
              msgInfo: t('resDistrictWard.delete.success')
            }
          });
      getAllResDistrictWards();
    } catch (error: any) {
      if (error?.response?.data?.code === 'REFERENCED') {
        const messageParts = error.response.data.message.split(',');
        navigate('/resDistrictWards', {
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
    getAllResDistrictWards();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('resDistrictWard.list.headline')}</h1>
      <div>
        <Link to="/resDistrictWards/add" className="btn btn-primary ms-2">{t('resDistrictWard.list.createNew')}</Link>
      </div>
    </div>
    {!resDistrictWards || resDistrictWards.length === 0 ? (
    <div>{t('resDistrictWard.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('resDistrictWard.id.label')}</th>
            <th scope="col">{t('resDistrictWard.name.label')}</th>
            <th scope="col">{t('resDistrictWard.code.label')}</th>
            <th scope="col">{t('resDistrictWard.district.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {resDistrictWards.map((resDistrictWard) => (
          <tr key={resDistrictWard.id}>
            <td>{resDistrictWard.id}</td>
            <td>{resDistrictWard.name}</td>
            <td>{resDistrictWard.code}</td>
            <td>{resDistrictWard.district}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/resDistrictWards/edit/' + resDistrictWard.id} className="btn btn-sm btn-secondary">{t('resDistrictWard.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(resDistrictWard.id!)} className="btn btn-sm btn-secondary">{t('resDistrictWard.list.delete')}</button>
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
