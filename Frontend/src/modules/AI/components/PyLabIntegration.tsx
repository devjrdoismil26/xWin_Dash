import React, { useState } from 'react';
import { PyLabHeader } from './PyLab/PyLabHeader';
import { PyLabEditor } from './PyLab/PyLabEditor';

export const PyLabIntegration: React.FC = () => {
  const [code, setCode] = useState('');

  const [running, setRunning] = useState(false);

  const handleRun = () => {
    setRunning(true);

    setTimeout(() => setRunning(false), 2000);};

  const handleSave = () => {};

  return (
            <div className=" ">$2</div><PyLabHeader onRun={handleRun} onSave={handleSave} running={running} / />
      <PyLabEditor code={code} onChange={setCode} / />
    </div>);};

export default PyLabIntegration;
