import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { HrEmployeeDTO } from 'app/hr-employee/hr-employee-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function HrEmployeeList() {
  const { t } = useTranslation();
  useDocumentTitle(t('hrEmployee.list.headline'));

  const [hrEmployees, setHrEmployees] = useState<HrEmployeeDTO[]>([]);
  const navigate = useNavigate();

  const getAllHrEmployees = async () => {
    try {
      const response = await axios.get('/api/hrEmployees');
      setHrEmployees(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/hrEmployees/' + id);
      navigate('/hrEmployees', {
            state: {
              msgInfo: t('hrEmployee.delete.success')
            }
          });
      getAllHrEmployees();
    } catch (error: any) {
      if (error?.response?.data?.code === 'REFERENCED') {
        const messageParts = error.response.data.message.split(',');
        navigate('/hrEmployees', {
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
    getAllHrEmployees();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('hrEmployee.list.headline')}</h1>
      <div>
        <Link to="/hrEmployees/add" className="btn btn-primary ms-2">{t('hrEmployee.list.createNew')}</Link>
      </div>
    </div>
    {!hrEmployees || hrEmployees.length === 0 ? (
    <div>{t('hrEmployee.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('hrEmployee.id.label')}</th>
            <th scope="col">{t('hrEmployee.name.label')}</th>
            <th scope="col">{t('hrEmployee.code.label')}</th>
            <th scope="col">{t('hrEmployee.email.label')}</th>
            <th scope="col">{t('hrEmployee.workPhone.label')}</th>
            <th scope="col">{t('hrEmployee.gender.label')}</th>
            <th scope="col">{t('hrEmployee.dateJoin.label')}</th>
            <th scope="col">{t('hrEmployee.dateLeft.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {hrEmployees.map((hrEmployee) => (
          <tr key={hrEmployee.id}>
            <td>{hrEmployee.id}</td>
            <td>{hrEmployee.name}</td>
            <td>{hrEmployee.code}</td>
            <td>{hrEmployee.email}</td>
            <td>{hrEmployee.workPhone}</td>
            <td>{hrEmployee.gender}</td>
            <td>{hrEmployee.dateJoin}</td>
            <td>{hrEmployee.dateLeft}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/hrEmployees/edit/' + hrEmployee.id} className="btn btn-sm btn-secondary">{t('hrEmployee.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(hrEmployee.id!)} className="btn btn-sm btn-secondary">{t('hrEmployee.list.delete')}</button>
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
