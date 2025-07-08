import { test, expect } from '@playwright/test';

import { OverwritableVirtualFileSystem, compile } from "../src/compilation";

test('compiles Tact code on the starting page', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(5000);

  // 1. Compile in isolation, on the Node.js side
  const fs = new OverwritableVirtualFileSystem();
  fs.writeFile('editor.tact', 'contract Editor() {}');
  const buildRes = await compile(fs);
  // console.log(buildRes);
  expect(buildRes.ok).toBe(true);

  // 2. Compile in the page (doesn't know where to look up those dependencies)
  // const onPageBuildOk = await page.evaluate(async () => {
  //   const fs = new OverwritableVirtualFileSystem();
  //   fs.writeFile('editor.tact', 'contract Editor() {}');
  //   const buildRes = await compile(fs);
  //   return buildRes.ok;
  // });
  // expect(onPageBuildOk).toBe(true);

  // 3. Compile on the page
  await page.keyboard.press('ControlOrMeta+s');
  await expect(page.getByText('Compiled without errors')).toBeVisible({ timeout: 5000 });
});
