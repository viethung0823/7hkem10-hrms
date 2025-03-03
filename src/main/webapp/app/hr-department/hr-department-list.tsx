import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { HrDepartmentDTO } from 'app/hr-department/hr-department-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function HrDepartmentList() {
  const { t } = useTranslation();
  useDocumentTitle(t('hrDepartment.list.headline'));

  const [hrDepartments, setHrDepartments] = useState<HrDepartmentDTO[]>([]);
  const navigate = useNavigate();

  const getAllHrDepartments = async () => {
    try {
      const response = await axios.get('/api/hrDepartments');
      setHrDepartments(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/hrDepartments/' + id);
      navigate('/hrDepartments', {
            state: {
              msgInfo: t('hrDepartment.delete.success')
            }
          });
      getAllHrDepartments();
    } catch (error: any) {
      if (error?.response?.data?.code === 'REFERENCED') {
        const messageParts = error.response.data.message.split(',');
        navigate('/hrDepartments', {
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
    getAllHrDepartments();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('hrDepartment.list.headline')}</h1>
      <div>
        <Link to="/hrDepartments/add" className="btn btn-primary ms-2">{t('hrDepartment.list.createNew')}</Link>
      </div>
    </div>
    {!hrDepartments || hrDepartments.length === 0 ? (
    <div>{t('hrDepartment.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('hrDepartment.id.label')}</th>
            <th scope="col">{t('hrDepartment.code.label')}</th>
            <th scope="col">{t('hrDepartment.name.label')}</th>
            <th scope="col">{t('hrDepartment.parent.label')}</th>
            <th scope="col">{t('hrDepartment.company.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {hrDepartments.map((hrDepartment) => (
          <tr key={hrDepartment.id}>
            <td>{hrDepartment.id}</td>
            <td>{hrDepartment.code}</td>
            <td>{hrDepartment.name}</td>
            <td>{hrDepartment.parent}</td>
            <td>{hrDepartment.company}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/hrDepartments/edit/' + hrDepartment.id} className="btn btn-sm btn-secondary">{t('hrDepartment.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(hrDepartment.id!)} className="btn btn-sm btn-secondary">{t('hrDepartment.list.delete')}</button>
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
