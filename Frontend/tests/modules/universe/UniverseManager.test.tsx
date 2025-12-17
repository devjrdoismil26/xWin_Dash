import { render, fireEvent, waitFor } from '@testing-library/react';
import { UniverseManager } from '@/modules/Universe/components/UniverseManager';

describe('Universe - UniverseManager', () => {
  const mockUniverses = [
    { id: '1', name: 'Universe 1', status: 'active', entities: 100 },
    { id: '2', name: 'Universe 2', status: 'inactive', entities: 50 },
  ];

  it('should render universes list', () => {
    const { getByText } = render(<UniverseManager universes={mockUniverses} />);
    expect(getByText('Universe 1')).toBeInTheDocument();
    expect(getByText('Universe 2')).toBeInTheDocument();
  });

  it('should create new universe', async () => {
    const onCreate = jest.fn();
    const { getByRole, getByLabelText } = render(
      <UniverseManager universes={[]} onCreate={onCreate} />
    );
    
    fireEvent.click(getByRole('button', { name: /new universe/i }));
    fireEvent.change(getByLabelText(/name/i), { target: { value: 'New Universe' } });
    fireEvent.click(getByRole('button', { name: /create/i }));
    
    await waitFor(() => expect(onCreate).toHaveBeenCalled());
  });

  it('should toggle universe status', () => {
    const onToggle = jest.fn();
    const { getAllByRole } = render(
      <UniverseManager universes={mockUniverses} onToggle={onToggle} />
    );
    
    fireEvent.click(getAllByRole('button', { name: /toggle/i })[0]);
    expect(onToggle).toHaveBeenCalledWith('1');
  });
});
