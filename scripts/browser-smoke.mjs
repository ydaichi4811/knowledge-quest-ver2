import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.KQ_BASE_URL || 'http://127.0.0.1:4173';
const outputDir = 'artifacts/browser-smoke';
await mkdir(outputDir, { recursive: true });

const targets = [
  { name: 'desktop', viewport: { width: 1440, height: 1000 } },
  { name: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true },
];

const browser = await chromium.launch();
const failures = [];

for (const target of targets) {
  const context = await browser.newContext({
    viewport: target.viewport,
    isMobile: target.isMobile || false,
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') pageErrors.push(message.text());
  });

  const assertNoHorizontalOverflow = async (screen) => {
    const metrics = await page.evaluate(() => ({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth,
    }));
    if (metrics.document > metrics.viewport + 2) {
      failures.push(`${target.name}/${screen}: horizontal overflow ${metrics.document}px > ${metrics.viewport}px`);
    }
  };

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByText('Knowledge Quest', { exact: true }).waitFor();
  await page.screenshot({ path: `${outputDir}/${target.name}-01-title.png`, fullPage: true });
  await assertNoHorizontalOverflow('title');

  await page.getByRole('button', { name: 'ゲームをスタート' }).click();
  await page.getByPlaceholder('なまえを入力（例: タロウ）').fill(`テスト${target.name === 'mobile' ? 'M' : 'D'}`);
  await page.screenshot({ path: `${outputDir}/${target.name}-02-registration.png`, fullPage: true });
  await assertNoHorizontalOverflow('registration');
  await page.getByRole('button', { name: /この設定でマスリア王国へ旅立つ/ }).click();

  const closeDaily = page.getByRole('button', { name: '閉じる' }).first();
  if (await closeDaily.isVisible({ timeout: 3000 }).catch(() => false)) await closeDaily.click();
  await page.getByText('冒険の進め方').waitFor();
  await page.screenshot({ path: `${outputDir}/${target.name}-03-home.png`, fullPage: true });
  await assertNoHorizontalOverflow('home');

  await page.getByRole('button', { name: /宝箱ガチャを開ける/ }).click();
  await page.getByText('マスリア王国の宝箱ガチャ').waitFor();
  await page.getByRole('button', { name: /1回引く/ }).click();
  await page.waitForTimeout(1800);
  await page.getByText(/ガチャコレクション/).waitFor();
  await page.screenshot({ path: `${outputDir}/${target.name}-04-gacha.png`, fullPage: true });
  await assertNoHorizontalOverflow('gacha');

  await page.getByRole('button').filter({ hasText: 'ホーム' }).last().click();
  await page.getByText('冒険の進め方').waitFor();
  await page.getByRole('button', { name: /相棒を育てる/ }).click();
  await page.getByText(/相棒の部屋/).first().waitFor();
  await page.screenshot({ path: `${outputDir}/${target.name}-05-companion-room.png`, fullPage: true });
  await assertNoHorizontalOverflow('companion-room');

  if (pageErrors.length) failures.push(`${target.name}: browser errors: ${pageErrors.join(' | ')}`);
  await context.close();
}

await browser.close();

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Desktop and mobile browser smoke checks passed.');

