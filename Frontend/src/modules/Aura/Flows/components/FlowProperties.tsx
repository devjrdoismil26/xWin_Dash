import React from 'react';
import { Input } from '@/shared/components/ui/Input';

export const FlowProperties: React.FC<{ node: unknown; onChange?: (e: any) => void }> = ({ node, onChange }) => (
  <div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
      <Input value={node.name || ''} onChange={(e: unknown) => onChange({ ...node, name: e.target.value })} />
    </div>);
