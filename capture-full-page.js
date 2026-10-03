const fs = require('fs');

const endpoint = 'http://127.0.0.1:9223/json';
const output = process.env.OUTPUT || 'full-page-raw.png';
const pageUrl =
  process.env.TARGET_URL ||
  'file:///C:/Users/mone2/OneDrive/Desktop/beauty%20Renovation%20LandingPage/index.html';
const viewportWidth = Number(process.env.VIEWPORT_WIDTH || 1280);
const initialHeight = Number(process.env.VIEWPORT_HEIGHT || 9000);

async function request(method, params = {}) {
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

  const send = (name, args = {}) =>
    new Promise((resolve, reject) => {
      const callId = ++id;
      pending.set(callId, { resolve, reject });
      ws.send(JSON.stringify({ id: callId, method: name, params: args }));
    });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url: pageUrl });
  await new Promise((resolve) => setTimeout(resolve, 2500));
  await send('Emulation.setDeviceMetricsOverride', {
    width: viewportWidth,
    height: initialHeight,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send('Runtime.evaluate', {
    expression: 'document.fonts ? document.fonts.ready.then(() => true) : true',
    awaitPromise: true,
  });
  const metrics = await send('Page.getLayoutMetrics');
  const width = Math.ceil(metrics.cssContentSize.width);
  const height = Math.ceil(metrics.cssContentSize.height);
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  const screenshot = await send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: true,
    clip: { x: 0, y: 0, width, height, scale: 1 },
  });
  fs.writeFileSync(output, Buffer.from(screenshot.data, 'base64'));
  ws.close();
  console.log(`${output} ${width}x${height}`);
}

request().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
