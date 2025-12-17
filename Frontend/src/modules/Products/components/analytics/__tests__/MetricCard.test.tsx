import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetricCard } from '../MetricCard';
import { DollarSign } from 'lucide-react';

describe('MetricCard', () => {
  it('should render metric label and value', () => {
    render(
      <MetricCard
        label="Total Revenue"
        value={ 1000 }
        trend="up"
        change={ 15 }
        icon={ <DollarSign /> }
        colorClass="text-green-600" />);

    expect(screen.getByText('Total Revenue')).toBeInTheDocument();

  });

  it('should format currency correctly', () => {
    render(
      <MetricCard
        label="Revenue"
        value={ 1234.56 }
        trend="up"
        change={ 10 }
        format="currency"
        icon={ <DollarSign /> }
        colorClass="text-green-600" />);

    expect(screen.getByText(/\$1,234\.56/)).toBeInTheDocument();

  });

  it('should format percentage correctly', () => {
    render(
      <MetricCard
        label="Conversion"
        value={ 0.15 }
        trend="up"
        change={ 5 }
        format="percentage"
        icon={ <DollarSign /> }
        colorClass="text-green-600" />);

    expect(screen.getByText('15.0%')).toBeInTheDocument();

  });

  it('should show trend indicator', () => {
    const { container } = render(
      <MetricCard
        label="Test"
        value={ 100 }
        trend="up"
        change={ 10 }
        icon={ <DollarSign /> }
        colorClass="text-green-600" />);

    expect(container.querySelector('.text-green-600')).toBeInTheDocument();

  });

});
