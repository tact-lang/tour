import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Tour of Tact/i);
  expect(titleElement).toBeInTheDocument();
});
