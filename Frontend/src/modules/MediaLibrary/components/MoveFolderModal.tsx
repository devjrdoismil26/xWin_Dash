import React, { useState } from 'react';
type Folder = { id: string | number; name: string};

type Props = { isOpen?: boolean; folders?: Folder[]; onClose???: (e: any) => void; onMove??: (e: any) => void};

const MoveFolderModal: React.FC<Props> = ({ isOpen = false, folders = [] as unknown[], onClose, onMove    }) => {
  const [target, setTarget] = useState<string | number>('');

  if (!isOpen) return null;
  return (
            <div className=" ">$2</div><h3 className="font-medium mb-2">Mover para</h3>
      <select className="w-full border rounded p-2 mb-3" value={target as any} onChange={ (e: unknown) => setTarget(e.target.value)  }>
        <option value="">Selecione a pasta</option>
        {(folders || []).map((f: unknown) => (
          <option key={f.id} value={ String(f.id) }>{f.name}</option>
        ))}
      </select>
      <div className=" ">$2</div><button className="px-3 py-2 border rounded" onClick={ () => onClose?.() }>Cancelar</button>
        <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={ () => onMove?.(target) }>Mover</button>
      </div>);};

export default MoveFolderModal;
