import React from 'react';
import { Card } from "@/components/ui/Card"
export function CostAnalytics({ analytics }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <Card.Content className="p-6">
          <h3 className="text-lg font-semibold mb-4">Modelos com melhor custo</h3>
          <div className="space-y-3">
            {(analytics?.topModels || []).map((model, index) => (
              <div key={`${model.name}-${index}`} className="flex justify-between items-center">
                <span className="font-medium">{model.name}</span>
                <span className="text-sm text-muted-foreground ml-2">{model.costPerToken}/token</span>
                <span className="text-sm font-medium text-green-600">{model.savingsPercent}%</span>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>
      <Card>
        <Card.Content className="p-6">
          <h3 className="text-lg font-semibold mb-4">Uso diário</h3>
          <div className="h-48 flex items-end space-x-2">
            {(analytics?.dailyUsage || []).map((day, index) => (
              <div key={`${day.date}-${index}`} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-primary rounded-t transition-all duration-300 hover:bg-primary/80"
                  style={{ height: `${day.percent}%`, minHeight: '4px' }}
                />
                <span className="text-xs text-muted-foreground mt-1">
                  {new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
export default CostAnalytics;
