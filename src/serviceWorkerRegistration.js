// Based on the Create React App service worker registration template.
// Enables offline caching and faster reloads on repeat visits.

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4]\d|[01]?\d\d?)){3}$/
    )
);

export function register(config) {
  if (process.env.NODE_ENV !== 'production') return;

  if (!('serviceWorker' in navigator)) return;

  const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
  if (publicUrl.origin !== window.location.origin) return;

  window.addEventListener('load', () => {
    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

    if (isLocalhost) {
      // On localhost, check the SW exists and is valid.
      checkValidServiceWorker(swUrl, config);

      navigator.serviceWorker.ready.then(() => {
        // eslint-disable-next-line no-console
        console.log('Service worker is ready.');
      });
    } else {
      registerValidSW(swUrl, config);
    }
  });
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      // If there's already a waiting worker, activate it immediately.
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }

      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;

        installingWorker.onstatechange = () => {
          if (installingWorker.state !== 'installed') return;

          if (navigator.serviceWorker.controller) {
            // New content is available.
            if (registration.waiting) {
              registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
            if (config && config.onUpdate) config.onUpdate(registration);
          } else {
            // Content is cached for offline use.
            if (config && config.onSuccess) config.onSuccess(registration);
          }
        };
      };

      // Reload once when the new SW takes control.
      let hasRefreshed = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (hasRefreshed) return;
        hasRefreshed = true;
        window.location.reload();
      });
    })
    .catch(() => {
      // eslint-disable-next-line no-console
      console.log('Service worker registration failed.');
    });
}

function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, { headers: { 'Service-Worker': 'script' } })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Reload.
        navigator.serviceWorker.ready
          .then((registration) => registration.unregister())
          .then(() => window.location.reload());
      } else {
        // Service worker found.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      // eslint-disable-next-line no-console
      console.log('No internet connection found. App is running in offline mode.');
    });
}

export function unregister() {
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.ready
    .then((registration) => registration.unregister())
    .catch(() => {});
}
