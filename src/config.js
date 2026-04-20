function toInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

module.exports = {
  port: toInt(process.env.PORT, 3010),
  width: toInt(process.env.SCOREBOARD_WIDTH, 768),
  height: toInt(process.env.SCOREBOARD_HEIGHT, 128),
  title: process.env.SCOREBOARD_TITLE || 'Scoreboard',
  periodLabel: process.env.SCOREBOARD_PERIOD_LABEL || 'Q',
  host: process.env.HOST || '0.0.0.0'
};
