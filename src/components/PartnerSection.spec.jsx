import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PartnerSection from './PartnerSection';

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

// Mock utils
vi.mock('@/lib/utils', () => ({
  getImageUrl: (url) => `http://localhost:3000${url}`,
}));

describe('PartnerSection', () => {
  const mockPartners = [
    {
      id: '1',
      name: 'BPJS Kesehatan',
      logo_url: '/uploads/bpjs.png',
      website_url: 'https://bpjs-kesehatan.go.id',
    },
    {
      id: '2',
      name: 'Asuransi Test',
      logo_url: null, // Fallback test
      website_url: '',
    },
  ];

  it('renders nothing if data is empty', () => {
    const { container } = render(<PartnerSection data={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly with partner data', () => {
    render(<PartnerSection data={mockPartners} />);
    
    expect(screen.getByText('Didukung Mitra & Asuransi')).toBeInTheDocument();
    expect(screen.getByLabelText('Logo mitra: BPJS Kesehatan')).toBeInTheDocument();
  });

  it('renders partner links correctly', () => {
    render(<PartnerSection data={mockPartners} />);
    
    const link = screen.getByTitle('Kunjungi situs BPJS Kesehatan');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://bpjs-kesehatan.go.id');
  });

  it('renders fallback monogram when logo_url is missing', () => {
    render(<PartnerSection data={mockPartners} />);
    
    // BPJS should have img
    expect(screen.getByAltText('BPJS Kesehatan')).toBeInTheDocument();
    
    // Asuransi Test should have monogram "AS"
    expect(screen.getByText('AS')).toBeInTheDocument();
  });
});
