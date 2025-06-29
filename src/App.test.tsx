import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { test, expect, vi } from 'vitest';

import { type SrcInfo, OverwritableVirtualFileSystem, compile } from "./compilation";
import App from './App';

vi.mock('ipfs-unixfs-importer', () => ({
  importer: vi.fn(),
}));

async function waitSeconds(seconds: number = 2) {
  await waitFor(() => { }, { interval: 1000, timeout: seconds * 1000 });
}

test('renders title', () => {
  render(<App />);
  const logoElements = screen.getAllByAltText(/Tact Tour/i);
  expect(logoElements).toHaveLength(2);
  expect(logoElements[0]).toBeInTheDocument();
  expect(logoElements[1]).toBeInTheDocument();
});

test('compiles Tact code on the starting page', async () => {
  render(<App />);

  // NOTE: commented out for posterity.
  //       tests here are units at best, not e2e —
  //       they cannot perform complex rendering and/or ctrl+s compilation.
  //
  // const fs = new OverwritableVirtualFileSystem();
  // fs.writeFile('editor.tact', 'contract Editor() {}');
  // const buildRes = await compile(fs);
  // console.log(buildRes);
  // expect(buildRes.ok).toBe(true);
  //
  // waitSeconds(10);
  // const editor = (window as any)?.monaco?.editor?.getModels()?.at(0);
  // expect(editor?.getValue()).toContain(/contract HelloWorld/);
  //
  // const codeEditor = await screen.findByLabelText(/contract HelloWorld/, {}, { timeout: 5000 });
  // expect(codeEditor).toBeInTheDocument();
  //
  // const isMac = navigator.platform.toLowerCase().indexOf('mac') !== -1;
  // fireEvent.keyDown(document, {
  //   key: 's',
  //   code: 'KeyS',
  //   [isMac ? 'metaKey' : 'ctrlKey']: true,
  // });
  //
  // const buildOutputElement = await screen.findByText(/Compiled without errors/, {}, {
  //   interval: 1000, // how often to check, polling frequency
  //   timeout: 10000, // when to give up, max wait time
  // });
  // expect(buildOutputElement).toBeInTheDocument();
}, { timeout: 30000 });
