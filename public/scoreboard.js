(() => {
  const config = window.__SCOREBOARD_CONFIG__ || {
    width: 768,
    height: 128,
    periodLabel: "Q",
  };
  document.documentElement.style.setProperty("--width", `${config.width}px`);
  document.documentElement.style.setProperty("--height", `${config.height}px`);
  document.title = config.title || "Scoreboard";
  // document.getElementById('resolution').textContent = `${config.width}×${config.height}`;

  document.getElementById("fullscreen").onclick = () =>
  document.documentElement.requestFullscreen().catch(alert);
  document.getElementById("refresh").onclick = () => loadState().catch(alert);

  const els = {
    app: document.getElementById("app"),
    homeTeam: document.getElementById("home-team"),
    awayTeam: document.getElementById("away-team"),
    homeScore: document.getElementById("home-score"),
    awayScore: document.getElementById("away-score"),
    clock: document.getElementById("clock"),
    period: document.getElementById("period"),
    status: document.getElementById("status"),
    homeLogo: document.getElementById("home-logo"),
    awayLogo: document.getElementById("away-logo"),
  };

  let currentState = null;
  let clientBasePerf = performance.now();
  let animationHandle = null;
  let connected = false;
  let goalAnimationTimer = null;
  let entranceHasPlayed = false;

  // Halftime carousel state
  let halftimeActive = false;
  let halftimeSlideIndex = 0;
  let halftimeTimer = null;
  let halftimeProgressTimer = null;
  const HALFTIME_SLIDE_DURATION = 6000; // ms per slide

  function hexToLuminance(hex) {
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16) / 255;
    const g = parseInt(c.substring(2, 4), 16) / 255;
    const b = parseInt(c.substring(4, 6), 16) / 255;
    const toLinear = (v) => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  }

  function getContrastText(hex) {
    if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) return '#ffffff';
    return hexToLuminance(hex) > 0.35 ? '#1a1a2e' : '#ffffff';
  }

  function applyTeamColors(state) {
    const root = els.app;
    if (state.homeColor) {
      root.style.setProperty('--team-home-color', state.homeColor);
      root.style.setProperty('--team-home-text', getContrastText(state.homeColor));
    } else {
      root.style.removeProperty('--team-home-color');
      root.style.removeProperty('--team-home-text');
    }
    if (state.awayColor) {
      root.style.setProperty('--team-away-color', state.awayColor);
      root.style.setProperty('--team-away-text', getContrastText(state.awayColor));
    } else {
      root.style.removeProperty('--team-away-color');
      root.style.removeProperty('--team-away-text');
    }
  }

  function setConnected(next) {
    connected = next;
    els.app.classList.toggle("disconnected", !connected);
  }

  function setLogo(element, url) {
    if (!url) {
      element.innerHTML =
        '<span style="font-size:14px;color:#8b98b3;font-weight:800">LOGO</span>';
      return;
    }
    element.innerHTML = "";
    const img = document.createElement("img");
    img.src = url;
    img.alt = "logo";
    img.onerror = () => {
      element.innerHTML =
        '<span style="font-size:14px;color:#8b98b3;font-weight:800">LOGO</span>';
    };
    element.appendChild(img);
  }

  function formatClock(ms) {
    const safe = Math.max(0, Math.floor(ms));
    const totalSeconds = Math.floor(safe / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const tenths = Math.floor((safe % 1000) / 100);
    /*
    if (safe < 10000) {
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${tenths}`;
    }
      */
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function getVisibleElapsedMs() {
    if (!currentState) return 0;
    const { clock, serverNow } = currentState;
    if (!clock.isRunning || !clock.lastStartServerTs) return clock.elapsedMs;

    const elapsedClient = performance.now() - clientBasePerf;
    const approxServerNow = serverNow + elapsedClient;
    return (
      clock.elapsedMs + Math.max(0, approxServerNow - clock.lastStartServerTs)
    );
  }

  function renderClock() {
    if (!currentState) return;
    const visible = getVisibleElapsedMs();
    els.clock.textContent = formatClock(visible);

    if (
      currentState.clock.periodDurationMs &&
      visible >= currentState.clock.periodDurationMs
    ) {
      els.clock.style.color = "#ff4c6b";
      els.clock.style.textShadow = "0 0 20px rgba(255,76,107,0.4), 0 1px 6px rgba(0,0,0,0.7)";
    } else {
      els.clock.style.color = "#ffffff";
      els.clock.style.textShadow = "0 0 20px rgba(0,229,255,0.35), 0 1px 6px rgba(0,0,0,0.7)";
    }

    animationHandle = requestAnimationFrame(renderClock);
  }

  function renderState() {
    if (!currentState) return;
    els.homeTeam.textContent = currentState.homeTeam;
    els.awayTeam.textContent = currentState.awayTeam;
    els.homeScore.textContent = String(currentState.homeScore);
    els.awayScore.textContent = String(currentState.awayScore);
    els.period.textContent = `${config.periodLabel || "Q"}${currentState.period}`;
    els.status.textContent = currentState.status;
    els.status.className = `badge status-${String(currentState.status || "").toLowerCase()}`;
    setLogo(els.homeLogo, currentState.homeLogoUrl);
    setLogo(els.awayLogo, currentState.awayLogoUrl);
    applyTeamColors(currentState);

    if (animationHandle) cancelAnimationFrame(animationHandle);
    clientBasePerf = performance.now();
    renderClock();
  }

  function applySnapshot(snapshot) {
    currentState = snapshot;
    renderState();
    checkHalftimeStatus();
  }

  /* ── Scoreboard Entrance Animation (broadcast style) ── */
  function playEntranceAnimation() {
    const app = els.app;
    // Reset to hidden state
    app.classList.remove("sb-animate");
    app.classList.add("sb-enter");
    // Force reflow so the hidden state applies before we animate
    void app.offsetWidth;
    // Swap to animated state — CSS transitions handle the staggered reveal
    app.classList.add("sb-animate");
    app.classList.remove("sb-enter");
    entranceHasPlayed = true;
  }

  // Expose globally so it can be triggered from control panel or console
  window.playScoreboardEntrance = playEntranceAnimation;

  /* ── Goal Celebration Overlay (inside #app bar) ── */

  function hexToRgb(hex) {
    if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) return null;
    const c = hex.replace('#', '');
    return `${parseInt(c.substring(0, 2), 16)}, ${parseInt(c.substring(2, 4), 16)}, ${parseInt(c.substring(4, 6), 16)}`;
  }

  const GOAL_WORD = "GOOOOL!";
  const LETTER_STAGGER_MS = 70;

  function buildGoalLetters(titleEl) {
    titleEl.innerHTML = '';
    const letters = GOAL_WORD.split('');
    letters.forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'goal-letter' + (i === letters.length - 1 ? ' goal-letter-final' : '');
      span.textContent = char;
      span.style.animationDelay = `${0.2 + i * (LETTER_STAGGER_MS / 1000)}s`;
      titleEl.appendChild(span);
    });
    const totalLetterTime = 0.2 + letters.length * (LETTER_STAGGER_MS / 1000) + 0.18;
    return totalLetterTime;
  }

  function showGoalOverlay(team) {
    const overlay = document.getElementById("goal-overlay");
    if (!overlay) return;

    // Cancel any running animation
    if (goalAnimationTimer) {
      clearTimeout(goalAnimationTimer);
      goalAnimationTimer = null;
    }

    // Reset all classes for clean restart
    overlay.classList.remove("active", "exiting", "home", "away");
    overlay.setAttribute("aria-hidden", "true");

    // Set team color as CSS variable
    const teamColor = team === "home"
      ? (currentState?.homeColor || '')
      : (currentState?.awayColor || '');
    const fallbackColor = '#00e5ff';
    const color = teamColor || fallbackColor;
    const colorRgb = hexToRgb(color) || '0, 229, 255';
    overlay.style.setProperty('--goal-color', color);
    overlay.style.setProperty('--goal-color-rgb', colorRgb);

    // Contrast-aware team name bar text
    const teamNameColor = teamColor ? getContrastText(teamColor) : '#ffffff';

    // Set team class
    overlay.classList.add(team);

    // Set team name
    const teamName = team === "home"
      ? (currentState?.homeTeam || "LOCAL")
      : (currentState?.awayTeam || "VISITA");
    const nameEl = overlay.querySelector(".goal-team-name");
    if (nameEl) {
      nameEl.textContent = teamName;
      nameEl.style.color = teamNameColor;
    }

    // Build letter-by-letter title
    const titleEl = overlay.querySelector(".goal-title");
    let totalLetterTime = 0.8;
    if (titleEl) {
      totalLetterTime = buildGoalLetters(titleEl);
    }

    // Set dynamic delays for name bar and score based on letter timing
    overlay.style.setProperty('--goal-name-delay', `${totalLetterTime + 0.05}s`);
    overlay.style.setProperty('--goal-score-delay', `${totalLetterTime - 0.15}s`);

    // Set score flash
    const scoreEl = overlay.querySelector(".goal-score-flash");
    if (scoreEl) {
      const newScore = team === "home"
        ? (currentState?.homeScore ?? 0)
        : (currentState?.awayScore ?? 0);
      scoreEl.textContent = String(newScore);
    }

    // Set team logo
    const logoUrl = team === "home"
      ? currentState?.homeLogoUrl
      : currentState?.awayLogoUrl;
    const logoFrame = overlay.querySelector(".goal-logo-frame");
    if (logoFrame) {
      const existingImg = logoFrame.querySelector("img");
      const placeholder = logoFrame.querySelector(".goal-logo-placeholder");
      if (logoUrl) {
        if (existingImg) {
          existingImg.src = logoUrl;
          existingImg.alt = teamName;
          existingImg.style.display = "";
        } else {
          const img = document.createElement("img");
          img.src = logoUrl;
          img.alt = teamName;
          img.referrerPolicy = "no-referrer";
          img.onerror = () => {
            img.style.display = "none";
            if (placeholder) placeholder.style.display = "";
          };
          logoFrame.insertBefore(img, logoFrame.firstChild);
        }
        if (placeholder) placeholder.style.display = "none";
      } else {
        if (existingImg) existingImg.style.display = "none";
        if (placeholder) placeholder.style.display = "";
      }
    }

    // Force reflow so CSS animations restart cleanly
    void overlay.offsetWidth;

    // Show overlay
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");

    // Auto-dismiss: letters + hold + exit
    const holdTime = 3200;
    goalAnimationTimer = setTimeout(() => {
      overlay.classList.add("exiting");
      goalAnimationTimer = setTimeout(() => {
        overlay.classList.remove("active", "exiting", "home", "away");
        overlay.setAttribute("aria-hidden", "true");
        goalAnimationTimer = null;
      }, 450);
    }, holdTime);
  }

  /* ── Halftime Ads Carousel ── */

  function buildHalftimeSlides(banners) {
    const carousel = document.querySelector('.halftime-carousel');
    if (!carousel) return;
    carousel.innerHTML = '';

    if (!banners || banners.length === 0) {
      carousel.innerHTML = `
        <div class="halftime-empty">
          <div class="halftime-empty-icon">&#9917;</div>
          <div class="halftime-empty-text">Entretiempo</div>
        </div>`;
      return;
    }

    // Preload every banner image so crossfades never show a blank frame
    banners.forEach((b) => {
      if (b && b.image) {
        const pre = new Image();
        pre.decoding = 'async';
        pre.src = b.image;
      }
    });

    banners.forEach((banner, i) => {
      const slide = document.createElement('div');
      slide.className = 'halftime-slide' + (i === 0 ? ' slide-active' : '');
      slide.style.setProperty('--slide-bg', banner.backgroundColor || '#0d1137');

      if (banner.image) {
        // Image mode — full-bleed sponsor artwork (object-fit: cover)
        const imgWrap = document.createElement('div');
        imgWrap.className = 'halftime-slide-image';
        const img = document.createElement('img');
        img.src = banner.image;
        img.alt = banner.sponsorName || banner.title || 'sponsor';
        img.decoding = 'async';
        img.loading = 'eager';
        img.draggable = false;
        img.onerror = () => {
          imgWrap.innerHTML = '';
          const ph = document.createElement('span');
          ph.className = 'halftime-slide-image-placeholder';
          ph.textContent = banner.sponsorName || banner.title || 'AD';
          imgWrap.appendChild(ph);
        };
        imgWrap.appendChild(img);
        slide.appendChild(imgWrap);
      } else {
        // Text card mode — shown only when no image was provided
        const textWrap = document.createElement('div');
        textWrap.className = 'halftime-slide-text';

        if (banner.title) {
          const title = document.createElement('div');
          title.className = 'halftime-slide-title';
          title.textContent = banner.title;
          textWrap.appendChild(title);
        }
        if (banner.subtitle) {
          const sub = document.createElement('div');
          sub.className = 'halftime-slide-subtitle';
          sub.textContent = banner.subtitle;
          textWrap.appendChild(sub);
        }
        if (banner.sponsorName) {
          const sponsor = document.createElement('div');
          sponsor.className = 'halftime-slide-sponsor';
          sponsor.textContent = banner.sponsorName;
          textWrap.appendChild(sponsor);
        }
        slide.appendChild(textWrap);
      }

      carousel.appendChild(slide);
    });
  }

  function startHalftimeCarousel() {
    const slides = document.querySelectorAll('.halftime-slide');
    const progress = document.querySelector('.halftime-progress');

    halftimeSlideIndex = 0;

    // Single banner: static full-screen, no rotation, no progress bar
    if (slides.length <= 1) {
      if (progress) progress.style.display = 'none';
      return;
    }
    if (progress) progress.style.display = '';

    startProgressBar();
    halftimeTimer = setInterval(() => {
      advanceHalftimeSlide(slides);
    }, HALFTIME_SLIDE_DURATION);
  }

  function advanceHalftimeSlide(slides) {
    if (!slides || slides.length <= 1) return;

    const currentIndex = halftimeSlideIndex;
    const nextIndex = (currentIndex + 1) % slides.length;
    const current = slides[currentIndex];
    const next = slides[nextIndex];

    // Pure crossfade: incoming fades in above outgoing, then we drop outgoing.
    // CSS transition is 0.9s — align the cleanup with that.
    if (next) next.classList.add('slide-active');
    if (current && current !== next) {
      setTimeout(() => current.classList.remove('slide-active'), 900);
    }

    halftimeSlideIndex = nextIndex;
    resetProgressBar();
  }

  function startProgressBar() {
    const bar = document.querySelector('.halftime-progress-bar');
    if (!bar) return;
    bar.style.setProperty('--slide-duration', `${HALFTIME_SLIDE_DURATION}ms`);
    bar.style.width = '0%';
    void bar.offsetWidth;
    bar.classList.add('animating');
  }

  function resetProgressBar() {
    const bar = document.querySelector('.halftime-progress-bar');
    if (!bar) return;
    bar.classList.remove('animating');
    bar.style.width = '0%';
    void bar.offsetWidth;
    bar.classList.add('animating');
  }

  function stopHalftimeCarousel() {
    if (halftimeTimer) {
      clearInterval(halftimeTimer);
      halftimeTimer = null;
    }
    const bar = document.querySelector('.halftime-progress-bar');
    if (bar) {
      bar.classList.remove('animating');
      bar.style.width = '0%';
    }
    halftimeSlideIndex = 0;
  }

  function showHalftime(banners) {
    if (halftimeActive) return;
    halftimeActive = true;

    const overlay = document.getElementById('halftime-overlay');
    if (!overlay) return;

    buildHalftimeSlides(banners);

    overlay.classList.remove('exiting');
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');

    // Start carousel after entrance animation
    setTimeout(() => startHalftimeCarousel(), 600);
  }

  function hideHalftime() {
    if (!halftimeActive) return;
    halftimeActive = false;

    stopHalftimeCarousel();

    const overlay = document.getElementById('halftime-overlay');
    if (!overlay) return;

    overlay.classList.add('exiting');
    setTimeout(() => {
      overlay.classList.remove('active', 'exiting');
      overlay.setAttribute('aria-hidden', 'true');
    }, 500);
  }

  function checkHalftimeStatus() {
    if (!currentState) return;
    const isBreak = currentState.status === 'BREAK';
    const hasBanners = currentState.banners && currentState.banners.length > 0;

    if (isBreak && hasBanners && !halftimeActive) {
      showHalftime(currentState.banners);
    } else if ((!isBreak || !hasBanners) && halftimeActive) {
      hideHalftime();
    }
  }

  async function bootstrap() {
    // Set scoreboard to hidden state before data loads
    els.app.classList.add("sb-enter");

    const response = await fetch("/api/state");
    const data = await response.json();
    applySnapshot(data);

    // Play entrance animation after data is rendered
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        playEntranceAnimation();
      });
    });
  }

  function connectSocket() {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const socket = new WebSocket(`${protocol}//${window.location.host}`);

    socket.addEventListener("open", () => setConnected(true));
    socket.addEventListener("close", () => {
      setConnected(false);
      setTimeout(connectSocket, 1500);
    });
    socket.addEventListener("error", () => setConnected(false));
    socket.addEventListener("message", (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "MATCH_STATE" || message.payload?.clock) {
          applySnapshot(message.payload);
        }
        // Trigger goal animation on goal events
        if (message.type === "GOAL_HOME") {
          showGoalOverlay("home");
        } else if (message.type === "GOAL_AWAY") {
          showGoalOverlay("away");
        }
        // Live rebuild of halftime carousel when banners change while active
        if (message.type === "BANNERS_UPDATED" && halftimeActive && message.payload?.banners) {
          stopHalftimeCarousel();
          buildHalftimeSlides(message.payload.banners);
          setTimeout(() => startHalftimeCarousel(), 100);
        }
      } catch (error) {
        console.error("Invalid socket message", error);
      }
    });
  }

  // Replay entrance button
  document.getElementById("replay-entrance").onclick = () => playEntranceAnimation();

  bootstrap().catch(console.error);
  connectSocket();
})();
