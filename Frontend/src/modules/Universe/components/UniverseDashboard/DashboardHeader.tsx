import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';

export const DashboardHeader: React.FC<{ onRefresh??: (e: any) => void; refreshing: boolean }> = ({ onRefresh, refreshing }) => (
  <div className=" ">$2</div><h1 className="text-3xl font-bold">Universe Dashboard</h1>
    <Button onClick={onRefresh} disabled={ refreshing } />
      <RefreshCw className={refreshing ? 'animate-spin' : ''} / />
      Atualizar
    </Button>
  </div>);
