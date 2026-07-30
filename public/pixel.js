/* ==========================================================================
   META PIXEL — "THE NEXT CHAPTER" BY RANIA BARGHOUT
   --------------------------------------------------------------------------
   Loads the Meta (Facebook) Pixel and maps the guest/sponsor journey onto
   standard Meta events, so ad campaigns can optimise for real conversions.

   Funnel:
     ViewContent      → visitor is browsing a show (Between the Lines / No2ta)
     InitiateCheckout → visitor reached the application form (entered funnel)
     Lead             → application/inquiry successfully submitted (conversion)
     SubmitApplication→ fired alongside Lead (Meta's application-specific event)
     Contact          → visitor clicked the email address

   PRIVACY: no personally identifiable information (name, email, phone) is ever
   sent as an event parameter — only non-identifying context such as which form
   was submitted. The admin dashboard is intentionally NOT tracked.
   ========================================================================== */
(function () {
  'use strict';

  var PIXEL_ID = '1477957434364263';

  // Guard against a double include (would double-count every event).
  if (window.__tncPixelLoaded) return;
  window.__tncPixelLoaded = true;

  /* --- Base pixel (official Meta snippet) --- */
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
    n.queue = []; t = b.createElement(e); t.async = !0; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s)
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', PIXEL_ID);
  fbq('track', 'PageView');

  /* --- Safe tracking helper (exposed for app.js form handlers) --- */
  function track(event, params) {
    try {
      if (typeof fbq !== 'function') return;
      fbq('track', event, params || {});
    } catch (err) {
      // Never let analytics break the page.
      console.warn('[pixel] track failed:', event, err);
    }
  }
  window.tncTrack = track;

  /* --- Page-level funnel events --- */
  var path = (window.location.pathname || '').toLowerCase();
  var isApply = path.indexOf('apply') !== -1;
  var isBtl = path.indexOf('btl') !== -1 || path.indexOf('landing') !== -1;
  var isNo2ta = path.indexOf('no2ta') !== -1;

  if (isApply) {
    // Entering the application funnel — the closest analogue to "checkout"
    // on a site that takes applications rather than payments.
    track('InitiateCheckout', {
      content_name: 'Guest / Sponsor Application',
      content_category: 'application'
    });
  } else if (isBtl) {
    track('ViewContent', {
      content_name: 'Between the Lines',
      content_type: 'podcast',
      content_category: 'show'
    });
  } else if (isNo2ta) {
    track('ViewContent', {
      content_name: 'No2ta 3al Sater',
      content_type: 'podcast',
      content_category: 'show'
    });
  }

  /* --- Delegated interaction events --- */
  document.addEventListener('click', function (e) {
    var link = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!link) return;
    var href = link.getAttribute('href') || '';

    // Email click → Contact
    if (href.indexOf('mailto:') === 0) {
      track('Contact', { content_category: 'email' });
    }
  }, { passive: true });
})();
