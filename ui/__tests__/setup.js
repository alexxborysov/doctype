import '@testing-library/jest-dom';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { expect, afterEach } from 'vitest';
import 'vitest-canvas-mock';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

Object.defineProperty(window, 'scrollTo', {
  value: () => null,
  writable: true,
});

const mockServiceWorker = {
  ready: new Promise((res) => {
    setTimeout(() => {
      res({
        active: {
          state: 'activated',
        },
      });
    }, 100);
  }),
};

Object.defineProperty(navigator, 'serviceWorker', {
  value: mockServiceWorker,
  writable: true,
});
