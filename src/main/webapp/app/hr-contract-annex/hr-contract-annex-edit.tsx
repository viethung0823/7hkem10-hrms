import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { HrContractAnnexDTO } from 'app/hr-contract-annex/hr-contract-annex-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    name: yup.string().emptyToNull().max(255),
    number: yup.string().emptyToNull().max(255),
    content: yup.string().emptyToNull().max(255),
    dateEfective: yup.string().emptyToNull(),
    contract: yup.number().integer().emptyToNull()
  });
}

export default function HrContractAnnexEdit() {
  const { t } = useTranslation();
  useDocumentTitle(t('hrContractAnnex.edit.headline'));

  const navigate = useNavigate();
  const [contractValues, setContractValues] = useState<Map<number,string>>(new Map());
  const params = useParams();
  const currentId = +params.id!;

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const prepareForm = async () => {
    try {
      const contractValuesResponse = await axios.get('/api/hrContractAnnexes/contractValues');
      setContractValues(contractValuesResponse.data);
      const data = (await axios.get('/api/hrContractAnnexes/' + currentId)).data;
      useFormResult.reset(data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareForm();
  }, []);

  const updateHrContractAnnex = async (data: HrContractAnnexDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.put('/api/hrContractAnnexes/' + currentId, data);
      navigate('/hrContractAnnexes', {
            state: {
              msgSuccess: t('hrContractAnnex.update.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('hrContractAnnex.edit.headline')}</h1>
      <div>
        <Link to="/hrContractAnnexes" className="btn btn-secondary">{t('hrContractAnnex.edit.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(updateHrContractAnnex)} noValidate>
      <InputRow useFormResult={useFormResult} object="hrContractAnnex" field="id" disabled={true} type="number" />
      <InputRow useFormResult={useFormResult} object="hrContractAnnex" field="name" />
      <InputRow useFormResult={useFormResult} object="hrContractAnnex" field="number" />
      <InputRow useFormResult={useFormResult} object="hrContractAnnex" field="content" />
      <InputRow useFormResult={useFormResult} object="hrContractAnnex" field="dateEfective" type="datepicker" />
      <InputRow useFormResult={useFormResult} object="hrContractAnnex" field="contract" type="select" options={contractValues} />
      <input type="submit" value={t('hrContractAnnex.edit.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
