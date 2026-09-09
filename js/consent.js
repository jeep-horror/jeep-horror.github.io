/**
 * Google Consent Mode v2 & Analytics Setup for JEEP HORROR
 */
window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}

// Default Consent Mode v2 (Denied until consented)
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied'
});

// GA4 Measurement ID (Replace G-XXXXXXXXXX with real ID when provided)
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

if (GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
}

document.addEventListener('DOMContentLoaded', () => {
  const consentBanner = document.getElementById('consent-banner');
  const acceptBtn = document.getElementById('consent-accept');
  const declineBtn = document.getElementById('consent-decline');

  const consentChoice = localStorage.getItem('jeep_horror_cookie_consent');

  if (!consentChoice && consentBanner) {
    consentBanner.style.display = 'block';
  } else if (consentChoice === 'granted') {
    gtag('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted'
    });
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('jeep_horror_cookie_consent', 'granted');
      gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted'
      });
      if (consentBanner) consentBanner.style.display = 'none';
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('jeep_horror_cookie_consent', 'denied');
      if (consentBanner) consentBanner.style.display = 'none';
    });
  }
});
