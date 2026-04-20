const http = require('http');
const path = require('path');
const express = require('express');
const WebSocket = require('ws');
const { MatchState } = require('./state');
const config = require('./config');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const matchState = new MatchState();

app.use(express.json({ limit: '1mb' }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.get('/config.js', (_req, res) => {
  res.type('application/javascript');
  res.send(`window.__SCOREBOARD_CONFIG__ = ${JSON.stringify(config)};`);
});

app.use(express.static(path.join(__dirname, '..', 'public')));

function broadcast(payload) {
  const message = JSON.stringify(payload);
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

function publishState(eventType = 'MATCH_STATE') {
  const payload = {
    type: eventType,
    payload: matchState.snapshot()
  };
  broadcast(payload);
  return payload;
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, serverTime: Date.now() });
});

app.get('/api/state', (_req, res) => {
  res.json(matchState.snapshot());
});

app.get('/api/banners', (_req, res) => {
  res.json({ ok: true, banners: matchState.getBanners() });
});

app.post('/api/banners', (req, res) => {
  try {
    matchState.setBanners(req.body.banners || []);
    publishState('BANNERS_UPDATED');
    res.json({ ok: true, banners: matchState.getBanners() });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
});

app.post('/api/action', (req, res) => {
  try {
    const next = matchState.applyAction(req.body || {});
    publishState(req.body?.type || 'MATCH_STATE');
    res.json({ ok: true, state: next });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
});

wss.on('connection', (socket) => {
  socket.send(JSON.stringify({ type: 'MATCH_STATE', payload: matchState.snapshot() }));

  socket.on('message', (raw) => {
    try {
      const data = JSON.parse(raw.toString());
      if (data?.type === 'PING') {
        socket.send(JSON.stringify({ type: 'PONG', payload: { serverNow: Date.now(), echo: data.payload || null } }));
        return;
      }
      const next = matchState.applyAction(data);
      publishState(data.type || 'MATCH_STATE');
      socket.send(JSON.stringify({ type: 'ACK', payload: next }));
    } catch (error) {
      socket.send(JSON.stringify({ type: 'ERROR', payload: { message: error.message } }));
    }
  });
});

server.listen(config.port, config.host, () => {
  console.log(`Scoreboard local server listening on http://${config.host}:${config.port}`);
  console.log(`Display: http://localhost:${config.port}/`);
  console.log(`Control: http://localhost:${config.port}/control.html`);
});
