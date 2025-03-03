import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { HrContractTypeDTO } from 'app/hr-contract-type/hr-contract-type-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function HrContractTypeList() {
  const { t } = useTranslation();
  useDocumentTitle(t('hrContractType.list.headline'));

  const [hrContractTypes, setHrContractTypes] = useState<HrContractTypeDTO[]>([]);
  const navigate = useNavigate();

  const getAllHrContractTypes = async () => {
    try {
      const response = await axios.get('/api/hrContractTypes');
      setHrContractTypes(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/hrContractTypes/' + id);
      navigate('/hrContractTypes', {
            state: {
              msgInfo: t('hrContractType.delete.success')
            }
          });
      getAllHrContractTypes();
    } catch (error: any) {
      if (error?.response?.data?.code === 'REFERENCED') {
        const messageParts = error.response.data.message.split(',');
        navigate('/hrContractTypes', {
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
    getAllHrContractTypes();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('hrContractType.list.headline')}</h1>
      <div>
        <Link to="/hrContractTypes/add" className="btn btn-primary ms-2">{t('hrContractType.list.createNew')}</Link>
      </div>
    </div>
    {!hrContractTypes || hrContractTypes.length === 0 ? (
    <div>{t('hrContractType.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('hrContractType.id.label')}</th>
            <th scope="col">{t('hrContractType.name.label')}</th>
            <th scope="col">{t('hrContractType.code.label')}</th>
            <th scope="col">{t('hrContractType.isUnlimited.label')}</th>
            <th scope="col">{t('hrContractType.isProbationaryContract.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {hrContractTypes.map((hrContractType) => (
          <tr key={hrContractType.id}>
            <td>{hrContractType.id}</td>
            <td>{hrContractType.name}</td>
            <td>{hrContractType.code}</td>
            <td>{hrContractType.isUnlimited?.toString()}</td>
            <td>{hrContractType.isProbationaryContract?.toString()}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/hrContractTypes/edit/' + hrContractType.id} className="btn btn-sm btn-secondary">{t('hrContractType.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(hrContractType.id!)} className="btn btn-sm btn-secondary">{t('hrContractType.list.delete')}</button>
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
