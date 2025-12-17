import React from 'react';
import Card from '@/shared/components/ui/Card';
import BarChartComponent from '@/shared/components/ui/BarChart';
import { LineChart, BarChart, PieChart } from 'lucide-react';

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
  data: number[];
  backgroundColor?: string;
  borderColor?: string; }>;
}

interface ExecutiveTrendChartsProps {
  revenueData: ChartData;
  userGrowthData: ChartData;
  conversionData: ChartData;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ExecutiveTrendCharts: React.FC<ExecutiveTrendChartsProps> = ({ revenueData,
  userGrowthData,
  conversionData
   }) => {
  return (
            <div className=" ">$2</div><Card className="p-6" />
        <div className=" ">$2</div><div className=" ">$2</div><LineChart className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white" />
              Tendência de Receita
            </h3></div><div className=" ">$2</div><BarChartComponent
            data={ revenueData }
            options={ responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'bottom'
                 } } / /></div></Card>

      <Card className="p-6" />
        <div className=" ">$2</div><div className=" ">$2</div><BarChart className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white" />
              Crescimento de Usuários
            </h3></div><div className=" ">$2</div><BarChartComponent
            data={ userGrowthData }
            options={ responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'bottom'
                 } } / /></div></Card>

      <Card className="p-6 lg:col-span-2" />
        <div className=" ">$2</div><div className=" ">$2</div><PieChart className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white" />
              Taxa de Conversão por Canal
            </h3></div><div className=" ">$2</div><BarChartComponent
            data={ conversionData }
            options={ responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'bottom'
                 } } / /></div></Card>
    </div>);};
