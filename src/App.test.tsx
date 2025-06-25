import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Tact Tour/i);
  expect(titleElement).toBeInTheDocument();
});

test('compiles Tact code on the starting page', () => {
  render(<App />);

  const codeEditor = screen.getByText(/contract HelloWorld/);
  expect(codeEditor).toBeInTheDocument();

  // const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  const isMac = navigator.platform.toLowerCase().indexOf('mac') !== -1;
  fireEvent.keyDown(document, {
    key: 's',
    code: 'KeyS',
    [isMac ? 'metaKey' : 'ctrlKey']: true,
  });
  const buildOutputElement = screen.getByText(/Compiled without errors/);
  expect(buildOutputElement).toBeInTheDocument();

  // expect(consoleSpy).toHaveBeenCalled();
  // expect(consoleSpy).toHaveBeenCalledWith('msg');
  // consoleSpy.mockRestore();
});
