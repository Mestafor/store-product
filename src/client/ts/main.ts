/*
 * Author - Alex Miagotin
 * Version: 0.0.1
 */

import './polyfills';
import App from './app';
import helpers from './helpers';

const app = new App();

/**
 * On document click
 */
document.addEventListener<'click'>('click', (e: MouseEvent) => {
  app.onDocumentClick(e);

  // Your code here
});

/**
 * On document loaded
 */
document.addEventListener('readystatechange', e => {
  if (document.readyState !== 'complete') return;
  app.onDocumentReady();

  // Your code
});

/**
 * On scroll
 */
let timeout: number | undefined = undefined;
document.addEventListener<'scroll'>(
  'scroll',
  helpers.throttle(() => {
    app.onScroll();

    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      document.body.classList.remove('prevent-page-hover');
    });

    // Your code
  }, 0)
);

/**
 * On window load
 */
window.addEventListener<'load'>('load', () => {
  app.onWindowLoad();

  // Your code
});

/**
 * On window resize
 */
let t;
window.addEventListener<'resize'>('resize', () => {
  clearTimeout(t);
  document.body.classList.add('--resizing');

  app.onWindowResize();

  t = setTimeout(() => {
    document.body.classList.remove('--resizing');
  }, 400);
});

