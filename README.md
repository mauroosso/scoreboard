# Scoreboard local

Backend local + pantalla HDMI para mostrar reloj, score y equipos en estadio.

## Requisitos
- Node.js 18 o superior

## Instalación
```bash
npm install
```

## Ejecución
```bash
npm start
```

## URLs
- Pantalla: `http://localhost:3000/`
- Control manual: `http://localhost:3000/control.html`
- Estado actual: `http://localhost:3000/api/state`
- Acción: `POST http://localhost:3000/api/action`

## Variables de entorno
Podés copiar `.env.example` y setear:
- `PORT`
- `HOST`
- `SCOREBOARD_WIDTH`
- `SCOREBOARD_HEIGHT`
- `SCOREBOARD_TITLE`
- `SCOREBOARD_PERIOD_LABEL`

## Acciones soportadas
### Equipos
```json
{ "type": "SET_TEAMS", "homeTeam": "GEBA", "awayTeam": "Ciudad" }
```

### Score
```json
{ "type": "SET_SCORE", "homeScore": 2, "awayScore": 1 }
{ "type": "GOAL_HOME" }
{ "type": "GOAL_AWAY" }
{ "type": "UNDO_GOAL_HOME" }
{ "type": "UNDO_GOAL_AWAY" }
```

### Período y estado
```json
{ "type": "SET_PERIOD", "period": 2 }
{ "type": "SET_STATUS", "status": "LIVE" }
{ "type": "NEXT_PERIOD" }
```

### Reloj
```json
{ "type": "START_CLOCK" }
{ "type": "PAUSE_CLOCK" }
{ "type": "RESET_CLOCK" }
{ "type": "SET_CLOCK_MS", "elapsedMs": 532000 }
{ "type": "SET_PERIOD_DURATION_MS", "periodDurationMs": 900000 }
```

## Integración desde tu planilla React
Ejemplo de gol del local:
```js
await fetch('http://IP-LOCAL-PC:3000/api/action', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'GOAL_HOME' })
});
```

Ejemplo setear equipos:
```js
await fetch('http://IP-LOCAL-PC:3000/api/action', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'SET_TEAMS',
    homeTeam: 'Banco Provincia',
    awayTeam: 'San Fernando'
  })
});
```

## Cronómetro
El backend guarda:
- `elapsedMs`
- `isRunning`
- `lastStartServerTs`

La pantalla calcula el reloj visible localmente con base en ese snapshot. Esto evita depender de un tick por red cada segundo.
