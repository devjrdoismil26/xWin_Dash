import { render } from '@testing-library/react';
import { LoginForm } from '@/modules/Auth/components/LoginForm';
import { RegisterForm } from '@/modules/Auth/components/RegisterForm';
import { ForgotPasswordForm } from '@/modules/Auth/components/ForgotPasswordForm';

describe('Auth Module Snapshots', () => {
  it('should match LoginForm snapshot', () => {
    const { container } = render(<LoginForm onSubmit={jest.fn()} />);
    expect(container).toMatchSnapshot();
  });

  it('should match RegisterForm snapshot', () => {
    const { container } = render(<RegisterForm onSubmit={jest.fn()} />);
    expect(container).toMatchSnapshot();
  });

  it('should match ForgotPasswordForm snapshot', () => {
    const { container } = render(<ForgotPasswordForm onSubmit={jest.fn()} />);
    expect(container).toMatchSnapshot();
  });
});
