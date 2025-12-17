import React from 'react';
import { Upload, Download } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import Card from '@/shared/components/ui/Card';

export const LeadImportExport: React.FC = () => {
  return (
        <>
      <Card className="p-6" />
      <h3 className="text-lg font-semibold mb-4">Import/Export</h3>
      <div className=" ">$2</div><Button />
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button variant="outline" />
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button></div></Card>);};

export default LeadImportExport;
