import { render, fireEvent } from '@testing-library/react';
import { MediaLibrary } from '@/modules/Media/components/MediaLibrary';

describe('Media - MediaLibrary', () => {
  const mockMedia = [
    { id: '1', name: 'image1.jpg', type: 'image', url: 'https://example.com/1.jpg' },
    { id: '2', name: 'video1.mp4', type: 'video', url: 'https://example.com/1.mp4' },
  ];

  it('should render media items', () => {
    const { getByText } = render(<MediaLibrary media={mockMedia} />);
    expect(getByText('image1.jpg')).toBeInTheDocument();
    expect(getByText('video1.mp4')).toBeInTheDocument();
  });

  it('should filter by type', () => {
    const { getByRole, queryByText } = render(<MediaLibrary media={mockMedia} />);
    fireEvent.click(getByRole('button', { name: /images/i }));
    expect(queryByText('video1.mp4')).not.toBeInTheDocument();
  });

  it('should select media', () => {
    const onSelect = jest.fn();
    const { getByAltText } = render(<MediaLibrary media={mockMedia} onSelect={onSelect} />);
    fireEvent.click(getByAltText('image1.jpg'));
    expect(onSelect).toHaveBeenCalledWith('1');
  });
});
