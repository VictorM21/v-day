/* Small shared helpers used by both pages. */
(function () {
    'use strict';

    // localStorage can throw (private mode, blocked cookies) - never let that break the page.
    const store = {
        get(key, fallback = null) {
            try {
                const v = localStorage.getItem(key);
                return v === null ? fallback : v;
            } catch (e) { return fallback; }
        },
        set(key, value) {
            try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
        },
        remove(key) {
            try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
        },
        getJSON(key, fallback) {
            try {
                const raw = localStorage.getItem(key);
                return raw === null ? fallback : JSON.parse(raw);
            } catch (e) { return fallback; }
        },
        setJSON(key, value) {
            try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
        }
    };

    // "2027-02-14" -> local midnight. new Date("2027-02-14") is UTC midnight, which is
    // still Feb 13 in the Americas, so dates from <input type="date"> must be parsed manually.
    function parseLocalDate(value) {
        const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
        return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
    }

    const reducedMotion = window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : { matches: false };

    // Replaces alert(): non-blocking, announced to screen readers.
    let toastEl, toastTimer;
    function toast(message, ms = 3000) {
        if (!toastEl) {
            toastEl = document.createElement('div');
            toastEl.className = 'toast';
            toastEl.setAttribute('role', 'status');
            toastEl.setAttribute('aria-live', 'polite');
            document.body.appendChild(toastEl);
        }
        toastEl.textContent = message;
        // force a reflow so repeated toasts re-trigger the transition
        void toastEl.offsetWidth;
        toastEl.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove('show'), ms);
    }

    window.VDay = { store, parseLocalDate, reducedMotion, toast };
})();
