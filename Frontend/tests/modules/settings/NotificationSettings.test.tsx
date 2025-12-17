import { render, fireEvent } from '@testing-library/react';
import { NotificationSettings } from '@/modules/Settings/components/NotificationSettings';

describe('Settings - NotificationSettings', () => {
  it('should render notification toggles', () => {
    const { getByLabelText } = render(<NotificationSettings />);
    expect(getByLabelText(/email notifications/i)).toBeInTheDocument();
    expect(getByLabelText(/push notifications/i)).toBeInTheDocument();
  });

  it('should toggle notifications', () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(<NotificationSettings onChange={onChange} />);
    
    fireEvent.click(getByLabelText(/email notifications/i));
    expect(onChange).toHaveBeenCalledWith('email', true);
  });

  it('should show notification preferences', () => {
    const { getByText } = render(<NotificationSettings />);
    expect(getByText(/frequency/i)).toBeInTheDocument();
  });
});
