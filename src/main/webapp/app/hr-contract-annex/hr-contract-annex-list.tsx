import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { HrContractAnnexDTO } from 'app/hr-contract-annex/hr-contract-annex-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function HrContractAnnexList() {
  const { t } = useTranslation();
  useDocumentTitle(t('hrContractAnnex.list.headline'));

  const [hrContractAnnexes, setHrContractAnnexes] = useState<HrContractAnnexDTO[]>([]);
  const navigate = useNavigate();

  const getAllHrContractAnnexes = async () => {
    try {
      const response = await axios.get('/api/hrContractAnnexes');
      setHrContractAnnexes(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/hrContractAnnexes/' + id);
      navigate('/hrContractAnnexes', {
            state: {
              msgInfo: t('hrContractAnnex.delete.success')
            }
          });
      getAllHrContractAnnexes();
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    getAllHrContractAnnexes();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('hrContractAnnex.list.headline')}</h1>
      <div>
        <Link to="/hrContractAnnexes/add" className="btn btn-primary ms-2">{t('hrContractAnnex.list.createNew')}</Link>
      </div>
    </div>
    {!hrContractAnnexes || hrContractAnnexes.length === 0 ? (
    <div>{t('hrContractAnnex.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('hrContractAnnex.id.label')}</th>
            <th scope="col">{t('hrContractAnnex.name.label')}</th>
            <th scope="col">{t('hrContractAnnex.number.label')}</th>
            <th scope="col">{t('hrContractAnnex.content.label')}</th>
            <th scope="col">{t('hrContractAnnex.dateEfective.label')}</th>
            <th scope="col">{t('hrContractAnnex.contract.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {hrContractAnnexes.map((hrContractAnnex) => (
          <tr key={hrContractAnnex.id}>
            <td>{hrContractAnnex.id}</td>
            <td>{hrContractAnnex.name}</td>
            <td>{hrContractAnnex.number}</td>
            <td>{hrContractAnnex.content}</td>
            <td>{hrContractAnnex.dateEfective}</td>
            <td>{hrContractAnnex.contract}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/hrContractAnnexes/edit/' + hrContractAnnex.id} className="btn btn-sm btn-secondary">{t('hrContractAnnex.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(hrContractAnnex.id!)} className="btn btn-sm btn-secondary">{t('hrContractAnnex.list.delete')}</button>
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
