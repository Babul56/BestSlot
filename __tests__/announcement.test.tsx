import { render, screen } from '@testing-library/react';
import AnnouncementBanner from '@/app/(home)/announcement';

describe('AnnouncementBanner', () => {
  it('renders the announcement text', () => {
    render(<AnnouncementBanner />);
    const announcements = screen.getAllByText(/Introducing our new feature/i);
    expect(announcements.length).toBeGreaterThan(0);
  });
});
