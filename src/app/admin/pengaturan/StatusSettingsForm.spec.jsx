import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StatusSettingsForm from './StatusSettingsForm';

// Mock the server action
vi.mock('@/app/actions/admin/settings', () => ({
  updateSiteSettings: vi.fn(() => Promise.resolve({ success: true })),
}));

describe('StatusSettingsForm', () => {
  const initialData = {
    isMaintenance: false,
    message: 'Original message',
    estimatedFinish: 'Besok',
  };

  it('renders initial state correctly', () => {
    render(<StatusSettingsForm initialData={initialData} />);
    
    expect(screen.getByText('Website Aktif & Online')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Original message')).toBeInTheDocument();
  });

  it('toggles banner text when maintenance mode is switched', () => {
    render(<StatusSettingsForm initialData={initialData} />);
    
    const toggle = screen.getByRole('switch');
    
    // Switch to maintenance mode
    fireEvent.click(toggle);
    
    expect(screen.getByText('Website Sedang Offline')).toBeInTheDocument();
    expect(screen.getByText('Website sedang tidak dapat diakses oleh publik!')).toBeInTheDocument();
  });

  it('disables message fields when maintenance is off', () => {
    render(<StatusSettingsForm initialData={initialData} />);
    
    const messageInput = screen.getByLabelText('Pesan Pemberitahuan');
    const estimatedInput = screen.getByLabelText(/Estimasi Selesai/);
    
    expect(messageInput).toBeDisabled();
    expect(estimatedInput).toBeDisabled();
  });

  it('enables message fields when maintenance is on', () => {
    render(<StatusSettingsForm initialData={{ ...initialData, isMaintenance: true }} />);
    
    const messageInput = screen.getByLabelText('Pesan Pemberitahuan');
    expect(messageInput).not.toBeDisabled();
  });
});
