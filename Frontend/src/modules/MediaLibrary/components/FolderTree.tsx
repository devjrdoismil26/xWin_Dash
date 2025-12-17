import React from 'react';
type Node = { id: string | number; name: string; children?: Node[]};

type Props = { roots?: Node[]; onSelect??: (e: any) => void};

const FolderTree: React.FC<Props> = ({ roots = [] as unknown[], onSelect    }) => {
  const renderNode = (n: Node) => (
    <li key={n.id} className="ml-2" />
      <button type="button" className="text-left hover:underline" onClick={ () => onSelect?.(n.id) }>{n.name}</button>
      {Array.isArray(n.children) && n.children.length > 0 && (
        <ul className="ml-4 list-disc" />
          {(n.children || []).map((c: unknown) => renderNode(c))}
        </ul>
      )}
    </li>);

  return <ul className="list-disc">{(roots || []).map((r: unknown) => renderNode(r))}</ul>;};

export default FolderTree;
