import React from 'react';
type MediaItem = { id?: string | number; name?: string; url?: string; type?: string};

type Props = { isOpen?: boolean; item?: MediaItem | null; onClose???: (e: any) => void};

const MediaDetailsModal: React.FC<Props> = ({ isOpen = false, item, onClose    }) => {
  if (!isOpen || !item) return null;
  return (
            <div className=" ">$2</div><h3 className="font-medium mb-2">Detalhes do arquivo</h3>
      <div className=" ">$2</div><div>Nome: {item.name ?? '-'}</div>
        <div>Tipo: {item.type ?? '-'}</div>
        {item.url && (
          <div className=" ">$2</div><a className="text-blue-600 underline" href={item.url} target="_blank" rel="noreferrer">Abrir</a>
      </div>
    </>
  )}
      </div>
      <div className=" ">$2</div><button className="text-sm underline" onClick={ () => onClose?.() }>Fechar</button>
      </div>);};

export { MediaDetailsModal };

export default MediaDetailsModal;
