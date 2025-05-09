import { cleanupOutdatedCaches } from 'workbox-precaching/cleanupOutdatedCaches';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

export function precacheAndServeAssets() {
  const origin = self.location.origin;

  registerRoute(
    function pagesCache({ request }) {
      return request.url.startsWith(origin) && !request.url.includes('.');
    },
    new NetworkFirst({
      cacheName: 'html',
    })
  );

  registerRoute(
    function assetsCache({ request }) {
      const jsAsset = request.destination === 'script' && request.url.includes('assets');
      const mediaAndStyling =
        request.url.startsWith(origin) &&
        (['style', 'font', 'image'].includes(request.destination) ||
          request.url.endsWith('.svg') ||
          request.url.includes('manifest'));

      return jsAsset || mediaAndStyling;
    },
    new StaleWhileRevalidate({
      cacheName: 'assets',
    })
  );

  cleanupOutdatedCaches();
}
