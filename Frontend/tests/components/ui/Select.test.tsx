import { render, fireEvent } from '@testing-library/react';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/shared/components/ui/select';

describe('UI - Select', () => {
  it('should render select', () => {
    const { getByRole } = render(
      <Select>
        <SelectTrigger>Select option</SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
          <SelectItem value="2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );
    expect(getByRole('button')).toBeInTheDocument();
  });

  it('should open options on click', () => {
    const { getByRole, getByText } = render(
      <Select>
        <SelectTrigger>Select</SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    
    fireEvent.click(getByRole('button'));
    expect(getByText('Option 1')).toBeInTheDocument();
  });

  it('should select option', () => {
    const onValueChange = jest.fn();
    const { getByRole, getByText } = render(
      <Select onValueChange={onValueChange}>
        <SelectTrigger>Select</SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    
    fireEvent.click(getByRole('button'));
    fireEvent.click(getByText('Option 1'));
    expect(onValueChange).toHaveBeenCalledWith('1');
  });
});
