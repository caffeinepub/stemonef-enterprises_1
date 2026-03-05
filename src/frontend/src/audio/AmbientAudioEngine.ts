/**
 * AmbientAudioEngine — deployment-stable, browser-only audio layer.
 *
 * All audio files are optional. If they are absent or fail to load,
 * the engine silently disables itself and never blocks the application.
 *
 * Guard: nothing executes during SSR / build-time (typeof window check).
 */

const STORAGE_KEY = "stemonef_audio_enabled";

export type AudioTheme = "default" | "research" | "march9";

interface TrackSlot {
  src: string;
  element: HTMLAudioElement | null;
  loaded: boolean;
  failed: boolean;
}

// ── Internal state (module-level singleton) ────────────────────────────────

let _initialized = false;
let _enabled = false;
let _volume = 0.25;
let _currentTheme: AudioTheme = "default";
let _activeAudio: HTMLAudioElement | null = null;
let _fadingOut: HTMLAudioElement | null = null;

const _tracks: Record<AudioTheme, TrackSlot> = {
  default: {
    src: "/audio/default_ambient.mp3",
    element: null,
    loaded: false,
    failed: false,
  },
  research: {
    src: "/audio/research_ambient.mp3",
    element: null,
    loaded: false,
    failed: false,
  },
  march9: {
    src: "/audio/march9_theme.mp3",
    element: null,
    loaded: false,
    failed: false,
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────

function _isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function _isMarch9(): boolean {
  if (!_isBrowser()) return false;
  const now = new Date();
  return now.getMonth() === 2 && now.getDate() === 9; // month is 0-indexed
}

function _resolveThemeForContext(requested: AudioTheme): AudioTheme {
  if (_isMarch9()) return "march9";
  return requested;
}

/**
 * Load a track lazily. Resolves true if the audio became usable,
 * false if the file was missing or errored.
 */
function _loadTrack(theme: AudioTheme): Promise<boolean> {
  if (!_isBrowser()) return Promise.resolve(false);

  const slot = _tracks[theme];
  if (slot.failed) return Promise.resolve(false);
  if (slot.loaded && slot.element) return Promise.resolve(true);

  return new Promise((resolve) => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0;
    audio.preload = "auto";

    const onCanPlay = () => {
      slot.element = audio;
      slot.loaded = true;
      cleanup();
      resolve(true);
    };

    const onError = () => {
      // File absent or unplayable — mark as failed, do not throw
      slot.failed = true;
      slot.element = null;
      cleanup();
      resolve(false);
    };

    const cleanup = () => {
      audio.removeEventListener("canplaythrough", onCanPlay);
      audio.removeEventListener("error", onError);
    };

    audio.addEventListener("canplaythrough", onCanPlay, { once: true });
    audio.addEventListener("error", onError, { once: true });

    // Setting src after attaching listeners avoids race conditions
    audio.src = slot.src;
    audio.load();
  });
}

function _fadeVolume(
  audio: HTMLAudioElement,
  from: number,
  to: number,
  durationMs: number,
  onDone?: () => void,
): void {
  const steps = 40;
  const interval = durationMs / steps;
  const delta = (to - from) / steps;
  let current = from;
  let step = 0;

  audio.volume = Math.max(0, Math.min(1, from));

  const tick = setInterval(() => {
    step++;
    current += delta;
    audio.volume = Math.max(0, Math.min(1, current));
    if (step >= steps) {
      clearInterval(tick);
      audio.volume = Math.max(0, Math.min(1, to));
      onDone?.();
    }
  }, interval);
}

// ── Public API ─────────────────────────────────────────────────────────────

export const AudioEngine = {
  /**
   * Initialise the engine. Safe to call multiple times.
   * Must be called from browser context only (e.g. useEffect).
   */
  init(): void {
    if (!_isBrowser()) return;
    if (_initialized) return;
    _initialized = true;

    // Restore saved preference
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      _enabled = saved === "true";
    } catch {
      _enabled = false;
    }

    // Auto-start if user previously enabled audio
    if (_enabled) {
      // Defer to next tick to avoid blocking mount
      setTimeout(() => {
        AudioEngine.play().catch(() => {
          // Autoplay may still be blocked — stay silent
          _enabled = false;
        });
      }, 500);
    }
  },

  isEnabled(): boolean {
    return _enabled;
  },

  getVolume(): number {
    return _volume;
  },

  getCurrentTheme(): AudioTheme {
    return _currentTheme;
  },

  async play(): Promise<void> {
    if (!_isBrowser()) return;

    const theme = _resolveThemeForContext(_currentTheme);
    const available = await _loadTrack(theme);

    if (!available) {
      // Track missing — fall back to "default" if different
      if (theme !== "default") {
        const fallbackAvailable = await _loadTrack("default");
        if (!fallbackAvailable) return; // No audio at all — exit silently
        _currentTheme = "default";
      } else {
        return; // default also missing — exit silently
      }
    }

    const slot = _tracks[_resolveThemeForContext(_currentTheme)];
    if (!slot.element) return;

    const audio = slot.element;
    _activeAudio = audio;

    try {
      audio.volume = 0;
      await audio.play();
      _fadeVolume(audio, 0, _volume, 2000);
      _enabled = true;
      _persist();
    } catch {
      // Autoplay policy blocked — stay silent, don't crash
      _enabled = false;
    }
  },

  pause(): void {
    if (!_activeAudio) return;
    AudioEngine.fadeOut(2000, () => {
      _activeAudio?.pause();
    });
    _enabled = false;
    _persist();
  },

  fadeIn(durationMs = 2000): void {
    if (!_activeAudio) return;
    _fadeVolume(_activeAudio, _activeAudio.volume, _volume, durationMs);
  },

  fadeOut(durationMs = 2000, onDone?: () => void): void {
    if (!_activeAudio) return;
    const audio = _activeAudio;
    _fadeVolume(audio, audio.volume, 0, durationMs, onDone);
  },

  async crossFade(nextTheme: AudioTheme, durationMs = 2000): Promise<void> {
    if (!_isBrowser()) return;

    const resolved = _resolveThemeForContext(nextTheme);
    if (resolved === _resolveThemeForContext(_currentTheme) && _activeAudio)
      return;

    const available = await _loadTrack(resolved);
    if (!available) return; // new track missing — keep current

    const outgoing = _activeAudio;
    const incoming = _tracks[resolved].element;
    if (!incoming) return;

    _fadingOut = outgoing;
    _activeAudio = incoming;
    _currentTheme = nextTheme;

    if (outgoing) {
      _fadeVolume(outgoing, outgoing.volume, 0, durationMs, () => {
        outgoing.pause();
        outgoing.currentTime = 0;
        _fadingOut = null;
      });
    }

    incoming.volume = 0;
    try {
      await incoming.play();
      _fadeVolume(incoming, 0, _volume, durationMs);
    } catch {
      // Blocked — stay silent
    }
  },

  async setTheme(theme: AudioTheme): Promise<void> {
    if (_enabled) {
      await AudioEngine.crossFade(theme);
    } else {
      _currentTheme = theme;
    }
  },

  setVolume(v: number): void {
    _volume = Math.max(0, Math.min(1, v));
    if (_activeAudio && _enabled) {
      _activeAudio.volume = _volume;
    }
  },
};

function _persist(): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(_enabled));
  } catch {
    // localStorage unavailable — ignore
  }
}

export function getAudioPreference(): boolean {
  if (!_isBrowser()) return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setAudioPreference(enabled: boolean): void {
  if (!_isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY, String(enabled));
  } catch {
    // ignore
  }
}
