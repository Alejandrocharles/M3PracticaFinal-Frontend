import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'

describe('App', () => {
  beforeEach(() => {
    // Simulate a logged-in user by setting a token
    window.localStorage.setItem('token', 'test-token');
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('renders login form', () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    )
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /email address/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  })
}) 