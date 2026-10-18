import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

describe('application routes', () => {
  it('shows the sign-in form for unauthenticated users', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /sign in to apexlib/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
  });
});
