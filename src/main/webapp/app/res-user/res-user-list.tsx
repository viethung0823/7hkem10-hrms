import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { ResUserDTO } from 'app/res-user/res-user-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function ResUserList() {
  const { t } = useTranslation();
  useDocumentTitle(t('resUser.list.headline'));

  const [resUsers, setResUsers] = useState<ResUserDTO[]>([]);
  const navigate = useNavigate();

  const getAllResUsers = async () => {
    try {
      const response = await axios.get('/api/resUsers');
      setResUsers(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/resUsers/' + id);
      navigate('/resUsers', {
            state: {
              msgInfo: t('resUser.delete.success')
            }
          });
      getAllResUsers();
    } catch (error: any) {
      if (error?.response?.data?.code === 'REFERENCED') {
        const messageParts = error.response.data.message.split(',');
        navigate('/resUsers', {
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
    getAllResUsers();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('resUser.list.headline')}</h1>
      <div>
        <Link to="/resUsers/add" className="btn btn-primary ms-2">{t('resUser.list.createNew')}</Link>
      </div>
    </div>
    {!resUsers || resUsers.length === 0 ? (
    <div>{t('resUser.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('resUser.id.label')}</th>
            <th scope="col">{t('resUser.username.label')}</th>
            <th scope="col">{t('resUser.password.label')}</th>
            <th scope="col">{t('resUser.name.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {resUsers.map((resUser) => (
          <tr key={resUser.id}>
            <td>{resUser.id}</td>
            <td>{resUser.username}</td>
            <td>{resUser.password}</td>
            <td>{resUser.name}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/resUsers/edit/' + resUser.id} className="btn btn-sm btn-secondary">{t('resUser.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(resUser.id!)} className="btn btn-sm btn-secondary">{t('resUser.list.delete')}</button>
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
