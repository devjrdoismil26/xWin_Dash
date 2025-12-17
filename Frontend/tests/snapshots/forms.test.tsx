import { render } from '@testing-library/react';
import { FormInput } from '@/shared/components/forms/FormInput';
import { FormSelect } from '@/shared/components/forms/FormSelect';
import { FormTextarea } from '@/shared/components/forms/FormTextarea';

describe('Forms Snapshots', () => {
  it('should match FormInput snapshot', () => {
    const { container } = render(<FormInput label="Name" name="name" />);
    expect(container).toMatchSnapshot();
  });

  it('should match FormSelect snapshot', () => {
    const options = [{ value: '1', label: 'Option 1' }];
    const { container } = render(<FormSelect label="Select" name="select" options={options} />);
    expect(container).toMatchSnapshot();
  });

  it('should match FormTextarea snapshot', () => {
    const { container } = render(<FormTextarea label="Description" name="description" />);
    expect(container).toMatchSnapshot();
  });
});
