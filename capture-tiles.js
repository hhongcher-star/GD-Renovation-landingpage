const fs = require('fs');

const endpoint = 'http://127.0.0.1:9223/json';
const pageUrl = 'file:///C:/Users/mone2/OneDrive/Desktop/beauty%20Renovation%20LandingPage/index.html';
const width = 1264;
const height = 1800;

async function main() {
  const tabs = await fetch(endpoint).then((res) => res.json());
  const page = tabs.find((tab) => tab.type === 'page');
  if (!page) throw new Error('No Chrome page found');

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(msg.error.message));
      else resolve(msg.result);
    }
  };

  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const callId = ++id;
      pending.set(callId, { resolve, reject });
      ws.send(JSON.stringify({ id: callId, method, params }));
    });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url: pageUrl });
  await new Promise((resolve) => setTimeout(resolve, 2500));
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send('Runtime.evaluate', {
    expression: 'document.fonts ? document.fonts.ready.then(() => true) : true',
    awaitPromise: true,
  });
  const metrics = await send('Page.getLayoutMetrics');
  const fullHeight = Math.ceil(metrics.cssContentSize.height);
  const count = Math.ceil(fullHeight / height);

  fs.mkdirSync('promo-tiles', { recursive: true });
  for (let i = 0; i < count; i += 1) {
    const y = Math.min(i * height, Math.max(0, fullHeight - height));
    await send('Runtime.evaluate', {
      expression: `window.scrollTo(0, ${y}); new Promise(resolve => setTimeout(resolve, 900));`,
      awaitPromise: true,
    });
    const screenshot = await send('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true,
    });
    const filename = `promo-tiles/tile-${String(i).padStart(2, '0')}.png`;
    fs.writeFileSync(filename, Buffer.from(screenshot.data, 'base64'));
    console.log(filename);
  }

  console.log(`height=${fullHeight} count=${count}`);
  ws.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
