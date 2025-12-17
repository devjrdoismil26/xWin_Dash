import { render, fireEvent, waitFor } from '@testing-library/react';
import { SettingsForm } from '@/modules/Settings/components/SettingsForm';

describe('Settings - SettingsForm', () => {
  const mockSettings = {
    appName: 'xWin Dash',
    language: 'en',
    timezone: 'UTC',
    notifications: true,
  };

  it('should render settings fields', () => {
    const { getByLabelText } = render(<SettingsForm settings={mockSettings} />);
    expect(getByLabelText(/app name/i)).toBeInTheDocument();
    expect(getByLabelText(/language/i)).toBeInTheDocument();
  });

  it('should display current values', () => {
    const { getByDisplayValue } = render(<SettingsForm settings={mockSettings} />);
    expect(getByDisplayValue('xWin Dash')).toBeInTheDocument();
  });

  it('should save settings', async () => {
    const onSave = jest.fn();
    const { getByLabelText, getByRole } = render(
      <SettingsForm settings={mockSettings} onSave={onSave} />
    );
    
    fireEvent.change(getByLabelText(/app name/i), { target: { value: 'New Name' } });
    fireEvent.click(getByRole('button', { name: /save/i }));
    
    await waitFor(() => expect(onSave).toHaveBeenCalled());
  });
});
