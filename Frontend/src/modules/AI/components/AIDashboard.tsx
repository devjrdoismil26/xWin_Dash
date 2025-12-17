import React from 'react';
import AIHeader from './AIHeader';
import AIMetricsCards from './AIMetricsCards';
import AIStats from './AIStats';
import AIServicesStatus from './AIServicesStatus';

export const AIDashboard: React.FC = () => {
  return (
            <div className=" ">$2</div><AIHeader / />
      <AIMetricsCards / />
      <div className=" ">$2</div><AIStats / />
        <AIServicesStatus / />
      </div>);};

export default AIDashboard;
