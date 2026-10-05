/**
 * Google Consent Mode v2 & Google Analytics 4 (GA4) Setup for JEEP HORROR
 * Measurement ID: G-DFVEVZ85KS
 */
window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}

// Check stored consent choice before setting defaults
const storedConsent = typeof localStorage !== 'undefined' ? localStorage.getItem('jeep_horror_cookie_consent') : null;
const isGranted = storedConsent === 'granted';

// Google Consent Mode v2 Default Settings
gtag('consent', 'default', {
  ad_storage: isGranted ? 'granted' : 'denied',
  ad_user_data: isGranted ? 'granted' : 'denied',
  ad_personalization: isGranted ? 'granted' : 'denied',
  analytics_storage: isGranted ? 'granted' : 'denied'
});

// GA4 Measurement ID
const GA_MEASUREMENT_ID = 'G-DFVEVZ85KS';

if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: true,
    anonymize_ip: true
  });
}

// Track custom user events safely
window.trackJeepEvent = function(eventName, eventParams) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, eventParams || {});
  }
};

document.addEventListener('DOMContentLoaded', () => {
  let consentBanner = document.getElementById('consent-banner');
  let acceptBtn = document.getElementById('consent-accept');
  let declineBtn = document.getElementById('consent-decline');

  // If banner doesn't exist in the HTML (e.g. blog pages), auto-create it
  if (!consentBanner && !storedConsent) {
    const isEn = window.location.pathname.startsWith('/en') || document.documentElement.lang === 'en';
    consentBanner = document.createElement('div');
    consentBanner.id = 'consent-banner';
    consentBanner.className = 'consent-banner';
    consentBanner.innerHTML = `
      <p style="font-size:0.85rem; color:#e2e8f0; margin-bottom:0.5rem;">
        ${isEn
          ? 'We use cookies and telemetry to analyze traffic and enhance your gameplay experience in accordance with Google privacy policies.'
          : 'Gumagamit kami ng cookies upang mapabuti ang karanasan sa paglalaro at analytics alinsunod sa Google privacy guidelines.'}
      </p>
      <div class="consent-actions">
        <button id="consent-accept" class="btn-ctrl" style="background:var(--accent-pink, #ff2a6d); border-color:var(--accent-pink, #ff2a6d); color:#fff; font-size:0.8rem;">
          ${isEn ? 'Accept All' : 'Tanggapin Lahat'}
        </button>
        <button id="consent-decline" class="btn-ctrl" style="font-size:0.8rem;">
          ${isEn ? 'Decline' : 'Tanggihan'}
        </button>
      </div>
    `;
    document.body.appendChild(consentBanner);
    acceptBtn = document.getElementById('consent-accept');
    declineBtn = document.getElementById('consent-decline');
  }

  // Display banner if no choice has been saved
  if (!storedConsent && consentBanner) {
    consentBanner.style.display = 'block';
  }

  // Bind accept action
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      try {
        localStorage.setItem('jeep_horror_cookie_consent', 'granted');
      } catch (e) {}
      gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted'
      });
      if (consentBanner) consentBanner.style.display = 'none';
      window.trackJeepEvent('cookie_consent', { consent_status: 'granted' });
    });
  }

  // Bind decline action
  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      try {
        localStorage.setItem('jeep_horror_cookie_consent', 'denied');
      } catch (e) {}
      gtag('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied'
      });
      if (consentBanner) consentBanner.style.display = 'none';
      window.trackJeepEvent('cookie_consent', { consent_status: 'denied' });
    });
  }

  // Auto-track key outbound link clicks (itch.io, Steam, Patreon, etc.)
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');
    if (!anchor || !anchor.href) return;
    const url = anchor.href;

    if (url.includes('itch.io')) {
      window.trackJeepEvent('click_itch_io', { link_url: url });
    } else if (url.includes('steampowered.com')) {
      window.trackJeepEvent('click_steam_wishlist', { link_url: url });
    } else if (url.includes('patreon.com')) {
      window.trackJeepEvent('click_patreon', { link_url: url });
    } else if (url.includes('discord.gg')) {
      window.trackJeepEvent('click_discord', { link_url: url });
    }
  });

  // Auto-track Game Play Start click
  const startGameBtn = document.getElementById('start-game-btn');
  if (startGameBtn) {
    startGameBtn.addEventListener('click', () => {
      window.trackJeepEvent('play_game_start', { platform: 'web_godot' });
    });
  }
});
