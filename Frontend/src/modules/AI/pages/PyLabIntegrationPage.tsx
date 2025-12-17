import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import { PyLabHeader } from '../components/PyLab/PyLabHeader';
import { PyLabEditor } from '../components/PyLab/PyLabEditor';
import { PyLabResults } from '../components/PyLab/PyLabResults';
import { PyLabModels } from '../components/PyLab/PyLabModels';

export const PyLabIntegrationPage: React.FC = () => {
  const [code, setCode] = React.useState('');

  const [results, setResults] = React.useState(null);

  return (
            <div className=" ">$2</div><PyLabHeader / />
      <div className=" ">$2</div><div className=" ">$2</div><PyLabEditor code={code} onChange={setCode} onRun={setResults} / />
          <PyLabResults results={results} / /></div><PyLabModels / />
      </div>);};
