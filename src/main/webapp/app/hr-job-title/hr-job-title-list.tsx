import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { HrJobTitleDTO } from 'app/hr-job-title/hr-job-title-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function HrJobTitleList() {
  const { t } = useTranslation();
  useDocumentTitle(t('hrJobTitle.list.headline'));

  const [hrJobTitles, setHrJobTitles] = useState<HrJobTitleDTO[]>([]);
  const navigate = useNavigate();

  const getAllHrJobTitles = async () => {
    try {
      const response = await axios.get('/api/hrJobTitles');
      setHrJobTitles(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/hrJobTitles/' + id);
      navigate('/hrJobTitles', {
            state: {
              msgInfo: t('hrJobTitle.delete.success')
            }
          });
      getAllHrJobTitles();
    } catch (error: any) {
      if (error?.response?.data?.code === 'REFERENCED') {
        const messageParts = error.response.data.message.split(',');
        navigate('/hrJobTitles', {
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
    getAllHrJobTitles();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('hrJobTitle.list.headline')}</h1>
      <div>
        <Link to="/hrJobTitles/add" className="btn btn-primary ms-2">{t('hrJobTitle.list.createNew')}</Link>
      </div>
    </div>
    {!hrJobTitles || hrJobTitles.length === 0 ? (
    <div>{t('hrJobTitle.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('hrJobTitle.id.label')}</th>
            <th scope="col">{t('hrJobTitle.name.label')}</th>
            <th scope="col">{t('hrJobTitle.code.label')}</th>
            <th scope="col">{t('hrJobTitle.description.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {hrJobTitles.map((hrJobTitle) => (
          <tr key={hrJobTitle.id}>
            <td>{hrJobTitle.id}</td>
            <td>{hrJobTitle.name}</td>
            <td>{hrJobTitle.code}</td>
            <td>{hrJobTitle.description}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/hrJobTitles/edit/' + hrJobTitle.id} className="btn btn-sm btn-secondary">{t('hrJobTitle.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(hrJobTitle.id!)} className="btn btn-sm btn-secondary">{t('hrJobTitle.list.delete')}</button>
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
