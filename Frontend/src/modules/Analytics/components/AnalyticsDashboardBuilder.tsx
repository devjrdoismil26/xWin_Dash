import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import { DashboardWidgetSelector } from './DashboardWidgetSelector';
import { DashboardCanvas } from './DashboardCanvas';
import { DashboardToolbar } from './DashboardToolbar';

export const AnalyticsDashboardBuilder: React.FC = () => {
  const [widgets, setWidgets] = React.useState<unknown[]>([]);

  const [selectedWidget, setSelectedWidget] = React.useState<string | null>(null);

  const addWidget = (type: string) => {
    setWidgets([...widgets, { id: Date.now().toString(), type, config: {} ]);};

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));};

  const updateWidget = (id: string, config: unknown) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, config } : w));};

  return (
            <div className=" ">$2</div><DashboardToolbar onSave={() => {} onReset={ () => setWidgets([]) } />
      
      <div className=" ">$2</div><Card className="backdrop-blur-xl bg-white/10 border-white/20" />
          <Card.Header />
            <Card.Title>Widgets</Card.Title>
          </Card.Header>
          <Card.Content />
            <DashboardWidgetSelector onSelect={addWidget} / />
          </Card.Content></Card><div className=" ">$2</div><DashboardCanvas
            widgets={ widgets }
            selectedWidget={ selectedWidget }
            onSelectWidget={ setSelectedWidget }
            onRemoveWidget={ removeWidget }
            onUpdateWidget={ updateWidget }
          / /></div></div>);};
