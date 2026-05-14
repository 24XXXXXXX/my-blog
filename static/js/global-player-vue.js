/**
 * Singleton APlayer
 * - one APlayer instance survives PJAX transitions
 * - no Vue dependency
 */
(function () {
  'use strict';

  if (window.__REIMU_SINGLETON_PLAYER_BOOTSTRAPPED__) {
    console.log('[SingletonPlayer] 已经初始化过，跳过');
    return;
  }
  window.__REIMU_SINGLETON_PLAYER_BOOTSTRAPPED__ = true;

  const cfg = window.REIMU_SINGLETON_PLAYER_CONFIG || {};
  const stateKey = String(cfg.stateKey || 'REIMU_SINGLETON_PLAYER_STATE_V1');
  const placeholderId = 'reimu-singleton-player-placeholder';
  const mobileMediaQuery = window.matchMedia('(max-width: 959px)');

  function safeParse(text) {
    try { return JSON.parse(text); } catch { return null; }
  }

  function readState() {
    try {
      const raw = localStorage.getItem(stateKey);
      const parsed = raw ? safeParse(raw) : null;
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  function writeState(partial) {
    const next = { ...readState(), ...partial, updatedAt: Date.now() };
    try { localStorage.setItem(stateKey, JSON.stringify(next)); } catch {}
    return next;
  }

  function setNavigationGuard(active, meta) {
    window.__REIMU_SINGLETON_NAVIGATING__ = !!active;
    window.__REIMU_SINGLETON_NAV_META__ = active ? { ...meta, startedAt: Date.now() } : null;
  }

  function isNavigationGuardActive() {
    return !!window.__REIMU_SINGLETON_NAVIGATING__;
  }

  function rememberPlaybackIntent(player, reason) {
    if (!player || !player.audio) return false;
    const wasPlaying = !player.audio.paused;
    window.__REIMU_PLAYER_WAS_PLAYING__ = wasPlaying;
    writeState({ paused: !wasPlaying });
    console.log('[SingletonPlayer] 记录播放意图:', wasPlaying, 'reason:', reason);
    return wasPlaying;
  }

  function syncPlaybackIntent(player, reason) {
    if (!player || !player.audio) return;
    const shouldResume = !player.audio.paused;
    window.__REIMU_PLAYER_WAS_PLAYING__ = shouldResume;
    console.log('[SingletonPlayer] 同步播放意图:', shouldResume, 'reason:', reason);
  }

  function tryResumeFromIntent(reason) {
    const player = window.__REIMU_SINGLETON_PLAYER_INSTANCE__;
    if (!player || !player.audio || !player.audio.paused) return;
    const state = readState();
    const shouldResume = window.__REIMU_PLAYER_WAS_PLAYING__ === true || state.paused === false;
    if (!shouldResume) return;
    console.log('[SingletonPlayer] 尝试恢复播放, reason:', reason);
    const playPromise = player.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch((error) => console.warn('[SingletonPlayer] play failed:', error));
    }
  }

  function normalizeUrl(urlText) {
    if (!urlText) return '';
    try {
      const u = new URL(urlText, location.href);
      u.hash = '';
      return u.href;
    } catch {
      return String(urlText);
    }
  }

  function findIndexBySrc(audios, src) {
    const target = normalizeUrl(src);
    if (!target) return -1;
    for (let i = 0; i < audios.length; i++) {
      const candidate = normalizeUrl(audios[i]?.url || audios[i]?.src || '');
      if (candidate === target) return i;
    }
    return -1;
  }

  function buildMetingUrl() {
    const template = String(cfg.metingApi || '');
    if (!template) return '';
    return template
      .replace(':server', encodeURIComponent(String(cfg?.meting?.server || 'netease')))
      .replace(':type', encodeURIComponent(String(cfg?.meting?.type || 'playlist')))
      .replace(':id', encodeURIComponent(String(cfg?.meting?.id || '')))
      .replace(':auth', '')
      .replace(':r', encodeURIComponent(String(Date.now())));
  }

  async function loadPlaylist() {
    const localAudios = Array.isArray(cfg?.player?.audio) ? cfg.player.audio : [];
    if (localAudios.length > 0) return localAudios;

    const url = buildMetingUrl();
    if (!url) return [];
    const response = await fetch(url, { credentials: 'omit' });
    if (!response.ok) throw new Error(`meting api failed: ${response.status}`);
    const list = await response.json();
    if (!Array.isArray(list)) return [];
    return list.map((item) => ({
      name: item?.name || '',
      artist: item?.artist || '',
      url: item?.url || '',
      cover: item?.pic || '',
      lrc: item?.lrc || '',
    }));
  }

  function persistPlayerState(player) {
    if (!player || !player.audio) return;
    const paused = !!player.audio.paused;
    syncPlaybackIntent(player, 'persist');
    if (paused && isNavigationGuardActive()) {
      writeState({
        currentTime: Number(player.audio.currentTime || 0),
        currentIndex: Number(player.list?.index || 0),
        currentSrc: String(player.audio.currentSrc || player.audio.src || ''),
        volume: Number(player.volume ? player.volume() : cfg?.player?.volume || 0.7),
      });
      return;
    }

    writeState({
      paused,
      currentTime: Number(player.audio.currentTime || 0),
      currentIndex: Number(player.list?.index || 0),
      currentSrc: String(player.audio.currentSrc || player.audio.src || ''),
      volume: Number(player.volume ? player.volume() : cfg?.player?.volume || 0.7),
    });
  }

  function bindPersistence(player) {
    if (!player || !player.audio) return;
    let last = 0;
    let initialized = false;
    setTimeout(() => { initialized = true; }, 400);

    const save = (reason) => {
      if (!initialized) return;
      syncPlaybackIntent(player, reason || 'event');
      persistPlayerState(player);
    };

    player.audio.addEventListener('play', () => save('play'));
    player.audio.addEventListener('pause', () => save('pause'));
    player.audio.addEventListener('seeked', () => save('seeked'));
    player.audio.addEventListener('volumechange', () => save('volumechange'));
    player.audio.addEventListener('timeupdate', () => {
      if (!initialized) return;
      const now = Date.now();
      if (now - last < 1500) return;
      last = now;
      save('timeupdate');
    });

    if (typeof player.on === 'function') {
      player.on('listswitch', () => save('listswitch'));
    }

    window.addEventListener('beforeunload', () => persistPlayerState(player));
    window.addEventListener('pagehide', () => persistPlayerState(player));
  }

  function restorePlayerState(player, audios) {
    if (!player || !player.audio) return;
    const state = readState();

    try {
      const volume = Number(state.volume);
      if (Number.isFinite(volume)) player.volume(volume, true);
    } catch {}

    try {
      const bySrc = findIndexBySrc(audios, state.currentSrc);
      const byIndex = Number(state.currentIndex || 0);
      const targetIndex = bySrc >= 0 ? bySrc : byIndex;
      if (Number.isFinite(targetIndex) && targetIndex >= 0 && player.list.index !== targetIndex) {
        player.list.switch(targetIndex);
      }
    } catch {}

    const apply = () => {
      const currentTime = Number(state.currentTime || 0);
      if (Number.isFinite(currentTime) && currentTime > 0) {
        try { player.seek(currentTime); } catch {}
      }
      if (state.paused === false) {
        window.__REIMU_PLAYER_WAS_PLAYING__ = true;
        tryResumeFromIntent('initial-restore');
      }
    };

    if (player.audio.readyState >= 2) {
      setTimeout(apply, 60);
      return;
    }

    const timer = setTimeout(apply, 1200);
    player.audio.addEventListener('canplay', () => {
      clearTimeout(timer);
      setTimeout(apply, 60);
    }, { once: true });
  }

  function ensureHost() {
    let host = document.getElementById('reimu-singleton-player-host');
    if (!host) {
      host = document.createElement('div');
      host.id = 'reimu-singleton-player-host';
      host.style.width = '100%';
      host.style.minHeight = '0';
    }
    return host;
  }

  function ensurePlaceholder() {
    let placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
      placeholder = document.createElement('div');
      placeholder.id = placeholderId;
      placeholder.style.width = '100%';
      placeholder.style.minHeight = '0';
      placeholder.style.pointerEvents = 'none';
    }
    return placeholder;
  }

  function isMobileViewport() {
    return !!mobileMediaQuery.matches;
  }

  function removePlaceholder() {
    const placeholder = document.getElementById(placeholderId);
    if (placeholder && placeholder.parentNode) {
      placeholder.parentNode.removeChild(placeholder);
    }
  }

  function mountHostToThemePosition() {
    const anchor = document.querySelector(String(cfg?.anchor?.selector || '.sidebar-wrapper'));
    if (!anchor || !anchor.parentNode) return false;
    const host = ensureHost();
    removePlaceholder();

    if (host.parentNode !== anchor.parentNode || host.nextSibling !== anchor) {
      anchor.parentNode.insertBefore(host, anchor);
    }

    host.style.position = '';
    host.style.left = '';
    host.style.top = '';
    host.style.width = '';
    host.style.zIndex = '';
    return true;
  }

  function mountHostToBodyForMobile() {
    const host = ensureHost();
    removePlaceholder();

    if (host.parentNode !== document.body) {
      document.body.appendChild(host);
    }

    host.style.position = '';
    host.style.left = '';
    host.style.top = '';
    host.style.width = '';
    host.style.zIndex = '';
    return true;
  }

  function mountHostForViewport() {
    if (isMobileViewport()) {
      return mountHostToBodyForMobile();
    }
    return mountHostToThemePosition();
  }

  function detachHostToBody() {
    const host = ensureHost();
    if (host.parentNode === document.body) return;
    const rect = host.getBoundingClientRect();
    const placeholder = ensurePlaceholder();
    placeholder.style.height = `${Math.max(0, Math.round(rect.height))}px`;
    if (host.parentNode) {
      host.parentNode.insertBefore(placeholder, host);
    }
    host.style.position = 'fixed';
    host.style.left = `${Math.round(rect.left)}px`;
    host.style.top = `${Math.round(rect.top)}px`;
    host.style.width = `${Math.round(rect.width)}px`;
    host.style.zIndex = '9999';
    document.body.appendChild(host);
  }

  function cleanupLegacyThemePlayer() {
    document.querySelectorAll('#sidebar meting-js, #sidebar #aplayer').forEach((element) => {
      if (element.id !== 'reimu-singleton-player-host') {
        element.remove();
      }
    });
  }

  function showResumeHint() {
    const player = window.__REIMU_SINGLETON_PLAYER_INSTANCE__;
    const state = readState();
    if (!player || !player.audio || !player.audio.paused || state.paused !== false) return;
    if (document.getElementById('reimu-player-resume-hint')) return;

    const hint = document.createElement('div');
    hint.id = 'reimu-player-resume-hint';
    hint.textContent = '点击页面恢复播放';
    hint.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);color:#fff;padding:10px 20px;border-radius:20px;font-size:14px;z-index:10000;cursor:pointer;transition:opacity 0.3s;';
    hint.onclick = () => {
      tryResumeFromIntent('hint-click');
      hint.remove();
      setNavigationGuard(false);
    };
    document.body.appendChild(hint);

    setTimeout(() => {
      if (!hint.parentNode) return;
      hint.style.opacity = '0';
      setTimeout(() => hint.remove(), 300);
    }, 5000);
  }

  function isEventInsidePlayer(event) {
    const target = event && event.target instanceof Element ? event.target : null;
    if (!target) return false;
    return !!target.closest('#reimu-singleton-player-host, .aplayer');
  }

  function shouldHandleGestureResume() {
    const player = window.__REIMU_SINGLETON_PLAYER_INSTANCE__;
    const state = readState();
    if (!player || !player.audio || !player.audio.paused) return false;
    if (state.paused !== false && window.__REIMU_PLAYER_WAS_PLAYING__ !== true) return false;
    return isNavigationGuardActive() || !!document.getElementById('reimu-player-resume-hint');
  }

  function bindNavigationLifecycle() {
    window.addEventListener('pjax:send', () => {
      const player = window.__REIMU_SINGLETON_PLAYER_INSTANCE__;
      const wasPlaying = rememberPlaybackIntent(player, 'pjax:send');
      setNavigationGuard(true, { reason: 'pjax:send', wasPlaying });
      if (player) persistPlayerState(player);
      if (!isMobileViewport()) {
        detachHostToBody();
      }
    });

    window.addEventListener('pjax:complete', () => {
      let attempts = 0;
      const timer = setInterval(() => {
        attempts += 1;
        if (mountHostForViewport() || attempts >= 20) {
          clearInterval(timer);
        }
      }, 50);
      cleanupLegacyThemePlayer();
      setTimeout(() => {
        tryResumeFromIntent('pjax:complete');
        setNavigationGuard(false);
        showResumeHint();
      }, 100);
    });

    window.addEventListener('popstate', () => {
      const player = window.__REIMU_SINGLETON_PLAYER_INSTANCE__;
      const wasPlaying = rememberPlaybackIntent(player, 'popstate');
      setNavigationGuard(true, { reason: 'popstate', wasPlaying });
      if (player) persistPlayerState(player);
    });

    window.addEventListener('pageshow', (event) => {
      if (!event.persisted) return;
      setTimeout(() => {
        tryResumeFromIntent('pageshow');
        setNavigationGuard(false);
        showResumeHint();
      }, 60);
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible') return;
      setTimeout(() => {
        tryResumeFromIntent('visibilitychange');
        showResumeHint();
      }, 0);
    });

    const unlockAutoplay = (event) => {
      if (event?.type === 'click' && isEventInsidePlayer(event)) return;
      if (!shouldHandleGestureResume()) return;
      tryResumeFromIntent('user-gesture');
      setNavigationGuard(false);
      const hint = document.getElementById('reimu-player-resume-hint');
      if (hint) hint.remove();
    };

    document.addEventListener('click', unlockAutoplay);
    document.addEventListener('keydown', unlockAutoplay);
    mobileMediaQuery.addEventListener('change', () => {
      mountHostForViewport();
    });
  }

  async function bootstrap() {
    if (window.__REIMU_SINGLETON_PLAYER_INSTANCE__) {
      mountHostForViewport();
      cleanupLegacyThemePlayer();
      return;
    }

    mountHostForViewport();
    cleanupLegacyThemePlayer();
    bindNavigationLifecycle();

    const host = ensureHost();
    host.textContent = '';
    const mountEl = document.createElement('div');
    mountEl.id = 'reimu-singleton-aplayer';
    host.appendChild(mountEl);

    const audios = await loadPlaylist();
    const player = new APlayer({
      container: mountEl,
      theme: cfg?.player?.theme || 'var(--color-link)',
      audio: audios,
      fixed: isMobileViewport(),
      autoplay: false,
      loop: cfg?.player?.loop || 'all',
      order: cfg?.player?.order || 'list',
      preload: cfg?.player?.preload || 'auto',
      volume: Number(cfg?.player?.volume || 0.7),
      mutex: cfg?.player?.mutex !== false,
      listFolded: cfg?.player?.listFolded !== false,
      lrcType: Number(cfg?.player?.lrcType || 0),
    });

    window.__REIMU_SINGLETON_PLAYER_INSTANCE__ = player;
    window.ap = player;

    bindPersistence(player);
    restorePlayerState(player, audios);
  }

  bootstrap().catch((error) => console.error('[SingletonPlayer] bootstrap failed:', error));
})();
