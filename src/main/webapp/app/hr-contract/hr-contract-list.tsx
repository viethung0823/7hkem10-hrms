import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { HrContractDTO } from 'app/hr-contract/hr-contract-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function HrContractList() {
  const { t } = useTranslation();
  useDocumentTitle(t('hrContract.list.headline'));

  const [hrContracts, setHrContracts] = useState<HrContractDTO[]>([]);
  const navigate = useNavigate();

  const getAllHrContracts = async () => {
    try {
      const response = await axios.get('/api/hrContracts');
      setHrContracts(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/hrContracts/' + id);
      navigate('/hrContracts', {
            state: {
              msgInfo: t('hrContract.delete.success')
            }
          });
      getAllHrContracts();
    } catch (error: any) {
      if (error?.response?.data?.code === 'REFERENCED') {
        const messageParts = error.response.data.message.split(',');
        navigate('/hrContracts', {
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
    getAllHrContracts();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('hrContract.list.headline')}</h1>
      <div>
        <Link to="/hrContracts/add" className="btn btn-primary ms-2">{t('hrContract.list.createNew')}</Link>
      </div>
    </div>
    {!hrContracts || hrContracts.length === 0 ? (
    <div>{t('hrContract.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('hrContract.id.label')}</th>
            <th scope="col">{t('hrContract.name.label')}</th>
            <th scope="col">{t('hrContract.code.label')}</th>
            <th scope="col">{t('hrContract.dateFrom.label')}</th>
            <th scope="col">{t('hrContract.dateTo.label')}</th>
            <th scope="col">{t('hrContract.salary.label')}</th>
            <th scope="col">{t('hrContract.employee.label')}</th>
            <th scope="col">{t('hrContract.contractType.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {hrContracts.map((hrContract) => (
          <tr key={hrContract.id}>
            <td>{hrContract.id}</td>
            <td>{hrContract.name}</td>
            <td>{hrContract.code}</td>
            <td>{hrContract.dateFrom}</td>
            <td>{hrContract.dateTo}</td>
            <td>{hrContract.salary}</td>
            <td>{hrContract.employee}</td>
            <td>{hrContract.contractType}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/hrContracts/edit/' + hrContract.id} className="btn btn-sm btn-secondary">{t('hrContract.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(hrContract.id!)} className="btn btn-sm btn-secondary">{t('hrContract.list.delete')}</button>
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
