const { chromium } = require('playwright');
const path = require('node:path');

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });

  await page.addInitScript(() => {
    localStorage.setItem(
      'shadowbroker_onboarding_complete_v0.9.81-agentic-onboarding-1',
      'true',
    );
    localStorage.setItem('shadowbroker_onboarding_complete', 'true');
    localStorage.setItem('shadowbroker_startup_warmup_notice_v0.9.84', 'true');
    localStorage.setItem('shadowbroker_changelog_v0.9.84', 'true');
  });

  await page.goto('http://127.0.0.1:3000', {
    waitUntil: 'domcontentloaded',
    timeout: 60_000,
  });
  await page.getByText('AMUN SIGNAL', { exact: true }).first().waitFor({ timeout: 30_000 });
  await page.waitForTimeout(8_000);

  const output = path.resolve(__dirname, '../../docs/assets/amun-signal-interface.png');
  await page.screenshot({ path: output, type: 'png' });

  await page.getByRole('button', { name: /Cases/ }).click();
  await page.getByRole('heading', { name: 'Investigation Workspace' }).waitFor();
  await page.waitForTimeout(500);
  const investigationOutput = path.resolve(
    __dirname,
    '../../docs/assets/amun-signal-investigation-workspace.png',
  );
  await page.screenshot({ path: investigationOutput, type: 'png' });
  await browser.close();
  process.stdout.write(`${output}\n${investigationOutput}\n`);
}

capture().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
