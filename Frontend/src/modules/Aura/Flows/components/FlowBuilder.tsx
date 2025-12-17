import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import { FlowToolbar } from './FlowToolbar';
import { FlowCanvas } from './FlowCanvas';
import { FlowNodePalette } from './FlowNodePalette';
import { FlowProperties } from './FlowProperties';

export const FlowBuilder: React.FC = () => {
  const [nodes, setNodes] = React.useState([]);

  const [selectedNode, setSelectedNode] = React.useState(null);

  return (
            <div className=" ">$2</div><FlowToolbar onSave={() => {} onReset={ () => setNodes([]) } />
      
      <div className=" ">$2</div><Card className="w-64 backdrop-blur-xl bg-white/10 border-white/20" />
          <Card.Header><Card.Title>Nós</Card.Title></Card.Header>
          <Card.Content />
            <FlowNodePalette onAddNode={ (node: unknown) => setNodes([...nodes, node]) } />
          </Card.Content></Card><div className=" ">$2</div><FlowCanvas nodes={nodes} selectedNode={selectedNode} onSelectNode={setSelectedNode} / />
        </div>

        {selectedNode && (
          <Card className="w-80 backdrop-blur-xl bg-white/10 border-white/20" />
            <Card.Header><Card.Title>Propriedades</Card.Title></Card.Header>
            <Card.Content />
              <FlowProperties node={selectedNode} onChange={ (n: unknown) => setNodes(nodes.map(node => node.id === n.id ? n : node)) } />
            </Card.Content>
      </Card>
    </>
  )}
      </div>);};
