class MatchState {
  constructor() {
    this.state = this.createInitialState();
    this.banners = [];
  }

  createInitialState() {
    return {
      matchId: 'local-match',
      homeTeam: 'LOCAL',
      awayTeam: 'VISITA',
      homeScore: 0,
      awayScore: 0,
      homeLogoUrl: '',
      awayLogoUrl: '',
      homeColor: '',
      awayColor: '',
      period: 1,
      status: 'PRE',
      clock: {
        isRunning: false,
        elapsedMs: 0,
        lastStartServerTs: null,
        periodDurationMs: 15 * 60 * 1000
      },
      updatedAt: Date.now()
    };
  }

  now() {
    return Date.now();
  }

  snapshot() {
    const s = this.state;
    return {
      ...s,
      clock: { ...s.clock },
      serverNow: this.now(),
      banners: this.banners
    };
  }

  setBanners(banners) {
    if (!Array.isArray(banners)) throw new Error('Banners must be an array');
    this.banners = banners.map((b, i) => ({
      id: b.id || `banner-${i}`,
      image: b.image || '',
      title: b.title || '',
      subtitle: b.subtitle || '',
      backgroundColor: b.backgroundColor || '#0d1137',
      sponsorName: b.sponsorName || ''
    }));
  }

  getBanners() {
    return this.banners;
  }

  getVisibleElapsedMs(now = this.now()) {
    const { clock } = this.state;
    if (!clock.isRunning || clock.lastStartServerTs == null) {
      return clock.elapsedMs;
    }
    return clock.elapsedMs + Math.max(0, now - clock.lastStartServerTs);
  }

  setUpdated() {
    this.state.updatedAt = this.now();
  }

  syncElapsed() {
    const visible = this.getVisibleElapsedMs();
    this.state.clock.elapsedMs = visible;
    this.state.clock.lastStartServerTs = this.state.clock.isRunning ? this.now() : null;
    this.setUpdated();
  }

  applyAction(action = {}) {
    const type = action.type;
    if (!type || typeof type !== 'string') {
      throw new Error('Action type is required');
    }

    switch (type) {
      case 'SET_TEAMS': {
        if (typeof action.homeTeam === 'string') this.state.homeTeam = action.homeTeam.trim() || this.state.homeTeam;
        if (typeof action.awayTeam === 'string') this.state.awayTeam = action.awayTeam.trim() || this.state.awayTeam;
        if (typeof action.homeLogoUrl === 'string') this.state.homeLogoUrl = action.homeLogoUrl;
        if (typeof action.awayLogoUrl === 'string') this.state.awayLogoUrl = action.awayLogoUrl;
        if (typeof action.homeColor === 'string') this.state.homeColor = action.homeColor.trim();
        if (typeof action.awayColor === 'string') this.state.awayColor = action.awayColor.trim();
        this.setUpdated();
        break;
      }
      case 'SET_SCORE': {
        if (Number.isInteger(action.homeScore) && action.homeScore >= 0) this.state.homeScore = action.homeScore;
        if (Number.isInteger(action.awayScore) && action.awayScore >= 0) this.state.awayScore = action.awayScore;
        this.setUpdated();
        break;
      }
      case 'GOAL_HOME': {
        this.state.homeScore += 1;
        this.setUpdated();
        break;
      }
      case 'GOAL_AWAY': {
        this.state.awayScore += 1;
        this.setUpdated();
        break;
      }
      case 'UNDO_GOAL_HOME': {
        this.state.homeScore = Math.max(0, this.state.homeScore - 1);
        this.setUpdated();
        break;
      }
      case 'UNDO_GOAL_AWAY': {
        this.state.awayScore = Math.max(0, this.state.awayScore - 1);
        this.setUpdated();
        break;
      }
      case 'SET_PERIOD': {
        if (Number.isInteger(action.period) && action.period > 0) {
          this.state.period = action.period;
          this.setUpdated();
        }
        break;
      }
      case 'SET_STATUS': {
        if (typeof action.status === 'string' && action.status.trim()) {
          this.state.status = action.status.trim().toUpperCase();
          this.setUpdated();
        }
        break;
      }
      case 'SET_PERIOD_DURATION_MS': {
        if (Number.isInteger(action.periodDurationMs) && action.periodDurationMs > 0) {
          this.state.clock.periodDurationMs = action.periodDurationMs;
          this.setUpdated();
        }
        break;
      }
      case 'START_CLOCK': {
        if (!this.state.clock.isRunning) {
          this.state.clock.isRunning = true;
          this.state.clock.lastStartServerTs = this.now();
          this.state.status = 'LIVE';
          this.setUpdated();
        }
        break;
      }
      case 'PAUSE_CLOCK': {
        if (this.state.clock.isRunning) {
          this.state.clock.elapsedMs = this.getVisibleElapsedMs();
          this.state.clock.isRunning = false;
          this.state.clock.lastStartServerTs = null;
          this.state.status = 'PAUSED';
          this.setUpdated();
        }
        break;
      }
      case 'RESET_CLOCK': {
        this.state.clock.elapsedMs = 0;
        this.state.clock.isRunning = false;
        this.state.clock.lastStartServerTs = null;
        this.setUpdated();
        break;
      }
      case 'SET_CLOCK_MS': {
        if (Number.isInteger(action.elapsedMs) && action.elapsedMs >= 0) {
          this.state.clock.elapsedMs = action.elapsedMs;
          if (this.state.clock.isRunning) {
            this.state.clock.lastStartServerTs = this.now();
          }
          this.setUpdated();
        }
        break;
      }
      case 'NEXT_PERIOD': {
        this.syncElapsed();
        this.state.period += 1;
        this.state.clock.elapsedMs = 0;
        this.state.clock.isRunning = false;
        this.state.clock.lastStartServerTs = null;
        this.state.status = 'BREAK';
        this.setUpdated();
        break;
      }
      case 'RESET_MATCH': {
        this.state = this.createInitialState();
        break;
      }
      default:
        throw new Error(`Unsupported action type: ${type}`);
    }

    return this.snapshot();
  }
}

module.exports = { MatchState };
