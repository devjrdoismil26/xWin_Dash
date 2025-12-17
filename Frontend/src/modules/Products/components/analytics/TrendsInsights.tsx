import React from 'react';
import Card from '@/shared/components/ui/Card';
import Badge from '@/shared/components/ui/Badge';
import { TrendingUp, Users, Target } from 'lucide-react';

export const TrendsInsights: React.FC = () => (
  <Card className="p-6" />
    <div className=" ">$2</div><h3 className="text-lg font-semibold text-gray-900">Trends & Insights</h3>
      <Badge variant="secondary">Last 30 days</Badge></div><div className=" ">$2</div><div className=" ">$2</div><TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
        <p className="font-semibold text-green-900">Growth Trend</p>
        <p className="text-sm text-green-700">Consistent upward trajectory</p></div><div className=" ">$2</div><Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
        <p className="font-semibold text-blue-900">User Engagement</p>
        <p className="text-sm text-blue-700">High interaction rates</p></div><div className=" ">$2</div><Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
        <p className="font-semibold text-purple-900">Conversion Rate</p>
        <p className="text-sm text-purple-700">Above industry average</p></div></Card>);
