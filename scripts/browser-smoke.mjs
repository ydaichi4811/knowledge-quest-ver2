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

const optionCircles = ['①', '②', '③', '④'];

for (const target of targets) {
  const context = await browser.newContext({
    viewport: target.viewport,
    isMobile: target.isMobile || false,
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400) {
      pageErrors.push(`${response.status()} ${response.url()}`);
    }
  });
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().startsWith('Failed to load resource:')) {
      pageErrors.push(message.text());
    }
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

  const closeDailyMissionIfPresent = async () => {
    const closeButton = page.getByRole('button', { name: '閉じる' }).first();
    const appeared = await closeButton
      .waitFor({ state: 'visible', timeout: 5000 })
      .then(() => true)
      .catch(() => false);
    if (appeared) {
      await closeButton.click();
      await closeButton.waitFor({ state: 'hidden' });
    }
  };

  const completeCompanionHatchingIfPresent = async () => {
    const hatchButton = page.getByRole('button', { name: /タマゴを誕生させる/ });
    if (await hatchButton.isVisible()) {
      await page.screenshot({ path: `${outputDir}/${target.name}-hatching.png`, fullPage: true });
      await hatchButton.click({ force: true });
      const departButton = page.getByRole('button', { name: /一緒に冒険へ出発/ });
      await departButton.waitFor();
      await departButton.click();
      await departButton.waitFor({ state: 'hidden' });
    }
  };

  const dismissBattleTutorialIfPresent = async () => {
    await completeCompanionHatchingIfPresent();
    const tutorialButton = page.getByRole('button', { name: /わかった/ });
    const appeared = await tutorialButton
      .waitFor({ state: 'visible', timeout: 1200 })
      .then(() => true)
      .catch(() => false);
    if (appeared) await tutorialButton.click();
  };

  const chooseOption = async (circle) => {
    await page.getByText(circle, { exact: true }).last().click();
  };

  const answerCurrentQuestionCorrectly = async () => {
    await chooseOption(optionCircles[0]);
    await page.getByRole('button', { name: 'けってい（答える）' }).click();
    await page.getByRole('button', { name: /つぎの問題へ/ }).waitFor();
    await dismissBattleTutorialIfPresent();

    const retryButton = page.getByRole('button', { name: /再挑戦/ });
    if (await retryButton.isVisible()) {
      const correctOption = page.locator('button.ring-2.ring-emerald-500').first();
      const correctCircle = (await correctOption.locator('span').first().innerText()).trim();
      await retryButton.click();
      await chooseOption(correctCircle);
      await page.getByRole('button', { name: 'けってい（答える）' }).click();
      await page.getByRole('button', { name: /つぎの問題へ/ }).waitFor();
      await dismissBattleTutorialIfPresent();
    }
  };

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  if ((await page.locator('html').getAttribute('lang')) !== 'ja') {
    throw new Error(`${target.name}: document language must be ja`);
  }
  await page.getByRole('img', { name: 'Knowledge Quest ナレッジクエスト' }).waitFor();
  await page.screenshot({ path: `${outputDir}/${target.name}-01-title.png`, fullPage: true });
  await assertNoHorizontalOverflow('title');

  await page.getByRole('button', { name: 'ゲームをスタート' }).click();
  await page.getByText(/迷ったら、名前だけ入力して出発して大丈夫/).waitFor();
  await page.getByPlaceholder('なまえを入力（例: タロウ）').fill(`テスト${target.name === 'mobile' ? 'M' : 'D'}`);
  await page.screenshot({ path: `${outputDir}/${target.name}-02-registration.png`, fullPage: true });
  await assertNoHorizontalOverflow('registration');
  await page.getByRole('button', { name: /この設定でマスリア王国へ旅立つ/ }).click();

  await page.getByText('冒険の進め方').waitFor();
  await closeDailyMissionIfPresent();
  await page.screenshot({ path: `${outputDir}/${target.name}-03-home.png`, fullPage: true });
  await assertNoHorizontalOverflow('home');
  await page.getByRole('button', { name: '問題に挑戦する', exact: true }).waitFor();

  await page.getByRole('button', { name: /ガチャ.*GACHA/ }).click();
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

  await page.getByRole('button', { name: '相棒の部屋を閉じる' }).click();
  await page.getByText('冒険の進め方').waitFor();
  await page.getByRole('button', { name: /問題に挑戦する/ }).click();
  const firstStage = page.getByText('はじまりの草原', { exact: true });
  await firstStage.waitFor();
  await firstStage.click();
  await page.getByRole('button', { name: /このクエストに挑戦する/ }).click();
  const questionHeader = page.getByText(/問題\s+\d+\s*\/\s*\d+/).first();
  await questionHeader.waitFor();
  await page.screenshot({ path: `${outputDir}/${target.name}-06-battle.png`, fullPage: true });
  await assertNoHorizontalOverflow('battle');

  const questionHeaderText = await questionHeader.innerText();
  const totalQuestions = Number(questionHeaderText.match(/\/\s*(\d+)/)?.[1] || 0);
  if (!totalQuestions) throw new Error(`${target.name}: could not determine battle question count`);

  for (let questionIndex = 0; questionIndex < totalQuestions; questionIndex += 1) {
    await answerCurrentQuestionCorrectly();
    await page.getByRole('button', { name: /つぎの問題へ/ }).click();
  }

  await page.getByText(/QUEST CLEAR!|CHALLENGE FINISHED/).waitFor();
  const npcClose = page.getByRole('button', { name: '閉じる' }).first();
  if (await npcClose.isVisible()) await npcClose.click();
  await page.screenshot({ path: `${outputDir}/${target.name}-07-result.png`, fullPage: true });
  await assertNoHorizontalOverflow('result');

  await page.getByRole('button', { name: /ホームへ戻る/ }).last().click();
  await page.getByText('冒険の進め方').waitFor();
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'ゲームをスタート' }).click();
  await page.getByText('冒険の進め方').waitFor();
  await page.getByText(`テスト${target.name === 'mobile' ? 'M' : 'D'}`, { exact: true }).first().waitFor();
  await page.screenshot({ path: `${outputDir}/${target.name}-08-persisted-home.png`, fullPage: true });
  await assertNoHorizontalOverflow('persisted-home');

  if (pageErrors.length) failures.push(`${target.name}: browser errors: ${pageErrors.join(' | ')}`);
  await context.close();
}

await browser.close();

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Desktop and mobile browser smoke checks passed.');

