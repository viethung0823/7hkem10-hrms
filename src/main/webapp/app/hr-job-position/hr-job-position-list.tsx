import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { HrJobPositionDTO } from 'app/hr-job-position/hr-job-position-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function HrJobPositionList() {
  const { t } = useTranslation();
  useDocumentTitle(t('hrJobPosition.list.headline'));

  const [hrJobPositions, setHrJobPositions] = useState<HrJobPositionDTO[]>([]);
  const navigate = useNavigate();

  const getAllHrJobPositions = async () => {
    try {
      const response = await axios.get('/api/hrJobPositions');
      setHrJobPositions(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/hrJobPositions/' + id);
      navigate('/hrJobPositions', {
            state: {
              msgInfo: t('hrJobPosition.delete.success')
            }
          });
      getAllHrJobPositions();
    } catch (error: any) {
      if (error?.response?.data?.code === 'REFERENCED') {
        const messageParts = error.response.data.message.split(',');
        navigate('/hrJobPositions', {
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
    getAllHrJobPositions();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('hrJobPosition.list.headline')}</h1>
      <div>
        <Link to="/hrJobPositions/add" className="btn btn-primary ms-2">{t('hrJobPosition.list.createNew')}</Link>
      </div>
    </div>
    {!hrJobPositions || hrJobPositions.length === 0 ? (
    <div>{t('hrJobPosition.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('hrJobPosition.id.label')}</th>
            <th scope="col">{t('hrJobPosition.name.label')}</th>
            <th scope="col">{t('hrJobPosition.isRecruiting.label')}</th>
            <th scope="col">{t('hrJobPosition.targetRecruitment.label')}</th>
            <th scope="col">{t('hrJobPosition.company.label')}</th>
            <th scope="col">{t('hrJobPosition.department.label')}</th>
            <th scope="col">{t('hrJobPosition.location.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {hrJobPositions.map((hrJobPosition) => (
          <tr key={hrJobPosition.id}>
            <td>{hrJobPosition.id}</td>
            <td>{hrJobPosition.name}</td>
            <td>{hrJobPosition.isRecruiting?.toString()}</td>
            <td>{hrJobPosition.targetRecruitment}</td>
            <td>{hrJobPosition.company}</td>
            <td>{hrJobPosition.department}</td>
            <td>{hrJobPosition.location}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/hrJobPositions/edit/' + hrJobPosition.id} className="btn btn-sm btn-secondary">{t('hrJobPosition.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(hrJobPosition.id!)} className="btn btn-sm btn-secondary">{t('hrJobPosition.list.delete')}</button>
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
