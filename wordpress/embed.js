/**
 * ==============================================================================
 * PERALIYA '26 - FULL VIEWPORT JS CONTROLLER
 * Paste into: Elementor Custom Code, Footer script, or <script> tag
 * ==============================================================================
 */

(function () {
  var iframe = document.getElementById('peraliya-frame');
  var loader = document.getElementById('peraliya-loader');
  var wrapper = document.getElementById('peraliya-fullscreen-wrapper');

  // Remove preloader once website is loaded
  if (iframe && loader) {
    iframe.addEventListener('load', function () {
      setTimeout(function () {
        loader.classList.add('loaded');
      }, 250);
    });

    // Backup fail-safe (in case iframe load event is delayed)
    setTimeout(function () {
      if (loader && !loader.classList.contains('loaded')) {
        loader.classList.add('loaded');
      }
    }, 3000);
  }

  // Dynamic viewport height adjustments for iOS Safari and mobile Chrome address bars
  function syncViewport() {
    if (wrapper && !document.body.classList.contains('elementor-editor-active')) {
      wrapper.style.height = window.innerHeight + 'px';
    }
  }

  window.addEventListener('resize', syncViewport);
  window.addEventListener('orientationchange', syncViewport);
  syncViewport();
})();
