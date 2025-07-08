import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { test, expect, vi } from 'vitest';

import App from './App';

vi.mock('ipfs-unixfs-importer', () => ({
  importer: vi.fn(),
}));

export async function waitSeconds(seconds: number = 2) {
  await waitFor(() => { }, { interval: 1000, timeout: seconds * 1000 });
}

test('renders title', () => {
  render(<App />);
  const logoElements = screen.getAllByAltText(/Tact Tour/i);
  expect(logoElements).toHaveLength(2);
  expect(logoElements[0]).toBeInTheDocument();
  expect(logoElements[1]).toBeInTheDocument();
});
