import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { ResUserRoleDTO } from 'app/res-user-role/res-user-role-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function ResUserRoleList() {
  const { t } = useTranslation();
  useDocumentTitle(t('resUserRole.list.headline'));

  const [resUserRoles, setResUserRoles] = useState<ResUserRoleDTO[]>([]);
  const navigate = useNavigate();

  const getAllResUserRoles = async () => {
    try {
      const response = await axios.get('/api/resUserRoles');
      setResUserRoles(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/resUserRoles/' + id);
      navigate('/resUserRoles', {
            state: {
              msgInfo: t('resUserRole.delete.success')
            }
          });
      getAllResUserRoles();
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    getAllResUserRoles();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('resUserRole.list.headline')}</h1>
      <div>
        <Link to="/resUserRoles/add" className="btn btn-primary ms-2">{t('resUserRole.list.createNew')}</Link>
      </div>
    </div>
    {!resUserRoles || resUserRoles.length === 0 ? (
    <div>{t('resUserRole.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('resUserRole.id.label')}</th>
            <th scope="col">{t('resUserRole.name.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {resUserRoles.map((resUserRole) => (
          <tr key={resUserRole.id}>
            <td>{resUserRole.id}</td>
            <td>{resUserRole.name}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/resUserRoles/edit/' + resUserRole.id} className="btn btn-sm btn-secondary">{t('resUserRole.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(resUserRole.id!)} className="btn btn-sm btn-secondary">{t('resUserRole.list.delete')}</button>
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
