import { render, fireEvent, waitFor } from '@testing-library/react';
import { MediaUploader } from '@/modules/Media/components/MediaUploader';

describe('Media - MediaUploader', () => {
  it('should render upload area', () => {
    const { getByText } = render(<MediaUploader />);
    expect(getByText(/drag and drop/i)).toBeInTheDocument();
  });

  it('should handle file selection', async () => {
    const onUpload = jest.fn();
    const { getByLabelText } = render(<MediaUploader onUpload={onUpload} />);
    
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
    const input = getByLabelText(/choose file/i);
    
    fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() => expect(onUpload).toHaveBeenCalled());
  });

  it('should validate file type', () => {
    const { getByLabelText, getByText } = render(<MediaUploader accept="image/*" />);
    
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(getByLabelText(/choose file/i), { target: { files: [file] } });
    
    expect(getByText(/invalid file type/i)).toBeInTheDocument();
  });
});
