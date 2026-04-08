/**
 * Singleton Vue player
 * - logic: one APlayer instance survives PJAX transitions
 * - layout/style: mount above `.sidebar-wrapper` to match theme placement
 */
(function () {
  'use strict';

  if (window.__REIMU_SINGLETON_PLAYER_BOOTSTRAPPED__) return;
  window.__REIMU_SINGLETON_PLAYER_BOOTSTRAPPED__ = true;

  const cfg = window.REIMU_SINGLETON_PLAYER_CONFIG || {};
  const stateKey = String(cfg.stateKey || 'REIMU_SINGLETON_PLAYER_STATE_V1');
  const placeholderId = 'reimu-singleton-player-placeholder';

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
      if (candidate && candidate === target) return i;
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
    const resp = await fetch(url, { credentials: 'omit' });
    if (!resp.ok) throw new Error(`meting api failed: ${resp.status}`);
    const list = await resp.json();
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
    writeState({
      paused: !!player.audio.paused,
      currentTime: Number(player.audio.currentTime || 0),
      currentIndex: Number(player.list?.index || 0),
      currentSrc: String(player.audio.currentSrc || player.audio.src || ''),
      volume: Number(player.volume ? player.volume() : cfg?.player?.volume || 0.7),
    });
  }

  function bindPersistence(player) {
    if (!player || !player.audio) return;
    let last = 0;
    const save = () => persistPlayerState(player);
    player.audio.addEventListener('play', save);
    player.audio.addEventListener('pause', save);
    player.audio.addEventListener('seeked', save);
    player.audio.addEventListener('volumechange', save);
    player.audio.addEventListener('timeupdate', () => {
      const now = Date.now();
      if (now - last < 1500) return;
      last = now;
      save();
    });
    if (typeof player.on === 'function') {
      player.on('listswitch', save);
    }
    window.addEventListener('beforeunload', save);
    window.addEventListener('pagehide', save);
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
      const t = Number(state.currentTime || 0);
      if (Number.isFinite(t) && t > 0) {
        try { player.seek(t); } catch {}
      }
      if (state.paused === false) {
        try { player.play(); } catch {}
      } else {
        try { player.pause(); } catch {}
      }
    };

    if (player.audio.readyState >= 2) {
      setTimeout(apply, 60);
    } else {
      const timer = setTimeout(apply, 1200);
      player.audio.addEventListener('canplay', () => {
        clearTimeout(timer);
        setTimeout(apply, 60);
      }, { once: true });
    }
  }

  function ensureSingletonContainer() {
    let host = document.getElementById('reimu-singleton-player-host');
    if (!host) {
      host = document.createElement('div');
      host.id = 'reimu-singleton-player-host';
      host.style.minHeight = '0';
      host.style.width = '100%';
    }
    return host;
  }

  function ensurePlaceholder() {
    let el = document.getElementById(placeholderId);
    if (!el) {
      el = document.createElement('div');
      el.id = placeholderId;
      el.style.width = '100%';
      el.style.minHeight = '0';
      el.style.pointerEvents = 'none';
    }
    return el;
  }

  function removePlaceholder() {
    const el = document.getElementById(placeholderId);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function mountHostToThemePosition() {
    const selector = String(cfg?.anchor?.selector || '.sidebar-wrapper');
    const anchor = document.querySelector(selector);
    if (!anchor) return false;
    const container = anchor.parentNode;
    if (!container) return false;
    const host = ensureSingletonContainer();
    removePlaceholder();
    if (host.parentNode !== container) {
      container.insertBefore(host, anchor);
    } else if (host.nextSibling !== anchor) {
      container.insertBefore(host, anchor);
    }
    // Back to normal document flow (prevents corner flash after remount).
    host.style.position = '';
    host.style.left = '';
    host.style.top = '';
    host.style.width = '';
    host.style.zIndex = '';
    return true;
  }

  function detachHostToBody() {
    const host = ensureSingletonContainer();
    if (host.parentNode === document.body) return;
    const rect = host.getBoundingClientRect();
    const placeholder = ensurePlaceholder();
    placeholder.style.height = `${Math.max(0, Math.round(rect.height))}px`;
    if (host.parentNode) {
      host.parentNode.insertBefore(placeholder, host);
    }
    // Freeze visual position during transition to avoid jumping.
    host.style.position = 'fixed';
    host.style.left = `${Math.round(rect.left)}px`;
    host.style.top = `${Math.round(rect.top)}px`;
    host.style.width = `${Math.round(rect.width)}px`;
    host.style.zIndex = '9999';
    document.body.appendChild(host);
  }

  function cleanupLegacyThemePlayer() {
    // keep theme layout while removing theme-driven player nodes when singleton mode is enabled
    document.querySelectorAll('#sidebar meting-js, #sidebar #aplayer').forEach((el) => {
      if (el.id !== 'reimu-singleton-player-host') el.remove();
    });
  }

  function bindPjaxRelocation() {
    window.addEventListener('pjax:send', () => {
      if (window.__REIMU_SINGLETON_PLAYER_INSTANCE__) {
        persistPlayerState(window.__REIMU_SINGLETON_PLAYER_INSTANCE__);
      }
      detachHostToBody();
    });
    window.addEventListener('pjax:complete', () => {
      // sidebar may render async during pjax complete; retry briefly
      let attempts = 0;
      const timer = setInterval(() => {
        attempts += 1;
        const ok = mountHostToThemePosition();
        if (ok || attempts >= 20) {
          clearInterval(timer);
        }
      }, 50);
      cleanupLegacyThemePlayer();
    });
  }

  function ensureVueLoaded() {
    if (window.Vue && window.Vue.createApp) return Promise.resolve();
    const src = String(cfg.vueCdn || 'https://unpkg.com/vue@3.5.17/dist/vue.global.prod.js');
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.defer = true;
      s.onload = () => resolve();
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function bootstrap() {
    if (window.__REIMU_SINGLETON_PLAYER_INSTANCE__) {
      mountHostToThemePosition();
      cleanupLegacyThemePlayer();
      return;
    }

    await ensureVueLoaded();
    const { createApp, h, onMounted, ref } = window.Vue;

    mountHostToThemePosition();
    cleanupLegacyThemePlayer();
    bindPjaxRelocation();

    const host = ensureSingletonContainer();
    const appRoot = document.createElement('div');
    appRoot.id = 'reimu-singleton-player-app';
    host.appendChild(appRoot);

    const app = createApp({
      setup() {
        const ready = ref(false);

        onMounted(async () => {
          try {
            const audios = await loadPlaylist();
            const mountEl = document.createElement('div');
            mountEl.id = 'reimu-singleton-aplayer';
            appRoot.appendChild(mountEl);

            const player = new APlayer({
              container: mountEl,
              theme: cfg?.player?.theme || 'var(--color-link)',
              audio: audios,
              fixed: false,
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
            ready.value = true;
          } catch (e) {
            console.error('[SingletonPlayer] bootstrap failed:', e);
          }
        });

        return () => h('div', null, [ready.value ? null : h('div', { style: 'display:none' }, 'loading')]);
      },
    });

    app.mount(appRoot);
  }

  bootstrap().catch((e) => console.error('[SingletonPlayer] unexpected error:', e));
})();
