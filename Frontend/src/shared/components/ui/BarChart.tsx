/**
 * Componente BarChart - Gr?fico de Barras
 *
 * @description
 * Componente wrapper para gr?ficos de barras usando a biblioteca Recharts.
 * Fornece uma interface simples e reutiliz?vel para exibir dados em formato
 * de gr?fico de barras com t?tulo, cores personaliz?veis e responsividade.
 *
 * @example
 * ```tsx
 * <BarChart
 *   data={ salesData }
 *   xAxisDataKey="month"
 *   barDataKey="sales"
 *   title="Vendas Mensais"
 *   color="#3b82f6"
 *   height={ 400 }
 * / />
 * ```
 *
 * @module components/ui/BarChart
 * @since 1.0.0
 */
import React from "react";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,  } from 'recharts';

/**
 * Props do componente BarChart
 *
 * @description
 * Propriedades que podem ser passadas para o componente BarChart.
 *
 * @interface BarChartProps
 * @property {Array<Record<string, any>>} data - Array de objetos com os dados do gr?fico
 * @property {string} xAxisDataKey - Chave do objeto de dados a ser usada no eixo X
 * @property {string} barDataKey - Chave do objeto de dados a ser usada nas barras
 * @property {string} [title] - T?tulo opcional do gr?fico
 * @property {string} [color] - Cor das barras em formato hexadecimal (padr?o: '#8884d8')
 * @property {number} [height] - Altura do gr?fico em pixels (padr?o: 300)
 * @property {string} [className] - Classes CSS adicionais para customiza??o
 */
export interface BarChartProps {
  /** Array de objetos com os dados do gr?fico */
data: Array<Record<string, any>>;
  /** Chave do objeto de dados a ser usada no eixo X */
xAxisDataKey: string;
  /** Chave do objeto de dados a ser usada nas barras */
barDataKey: string;
  /** T?tulo opcional do gr?fico */
title?: string;
  /** Cor das barras em formato hexadecimal (padr?o: '#8884d8') */
color?: string;
  /** Altura do gr?fico em pixels (padr?o: 300) */
height?: number;
  /** Classes CSS adicionais para customiza??o */
className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente BarChart
 *
 * @description
 * Renderiza um gr?fico de barras responsivo usando Recharts com grid, tooltip,
 * legendas e eixos configurados automaticamente.
 *
 * @component
 * @param {BarChartProps} props - Props do componente
 * @returns {JSX.Element} Gr?fico de barras estilizado e responsivo
 */
const BarChart: React.FC<BarChartProps> = ({ data,
  xAxisDataKey,
  barDataKey,
  title,
  color = "#8884d8",
  height = 300,
  className = "",
   }) => {
  return (
        <>
      <div className={`w-full ${className} `}>
      </div>{title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      )}
      <div style={width: "100%", height } >
           
        </div><ResponsiveContainer width="100%" height="100%" />
          <RechartsBarChart
            data={ data }
            margin={ top: 16, right: 16, bottom: 0, left: 0 } />
            <CartesianGrid strokeDasharray="3 3" / />
            <XAxis dataKey={xAxisDataKey} / />
            <YAxis / />
            <Tooltip / />
            <Legend / />
            <Bar dataKey={barDataKey} fill={color} / /></RechartsBarChart></ResponsiveContainer>
      </div>);};

export default BarChart;
