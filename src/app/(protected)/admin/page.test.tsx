/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdminDashboard from './page';

describe('AdminDashboard', () => {
  it('renders dashboard title', () => {
    render(<AdminDashboard />);
    
    expect(screen.getByRole('heading', { name: /管理者ダッシュボード/i })).toBeInTheDocument();
  });

  it('renders system status section', () => {
    render(<AdminDashboard />);
    
    expect(screen.getByText(/システムステータス/i)).toBeInTheDocument();
  });

  it('renders KPI panel section', () => {
    render(<AdminDashboard />);
    
    expect(screen.getByText(/KPI/i)).toBeInTheDocument();
  });
});
