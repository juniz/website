import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MaintenancePage from './MaintenancePage';

describe('MaintenancePage', () => {
  const mockData = {
    message: 'Test maintenance message',
    estimatedFinish: 'Senin, 10 Mei',
  };

  const mockContact = {
    phone: '(0358) 123456',
    email: 'test@rs-bhayangkara.id',
  };

  it('renders maintenance message correctly', () => {
    render(<MaintenancePage data={mockData} contact={mockContact} />);
    
    expect(screen.getByText('Sedang Dalam Pemeliharaan')).toBeInTheDocument();
    expect(screen.getByText('Test maintenance message')).toBeInTheDocument();
  });

  it('displays estimated finish time when provided', () => {
    render(<MaintenancePage data={mockData} contact={mockContact} />);
    
    expect(screen.getByText(/Senin, 10 Mei/)).toBeInTheDocument();
  });

  it('displays dynamic contact information', () => {
    render(<MaintenancePage data={mockData} contact={mockContact} />);
    
    expect(screen.getByText('IGD: (0358) 123456')).toBeInTheDocument();
    expect(screen.getByText('test@rs-bhayangkara.id')).toBeInTheDocument();
  });

  it('uses fallback contact info if none provided', () => {
    render(<MaintenancePage data={mockData} contact={null} />);
    
    expect(screen.getByText(/IGD: \(0358\) 321111/)).toBeInTheDocument();
    expect(screen.getByText('info@rsbhayangkara-nganjuk.id')).toBeInTheDocument();
  });
});
