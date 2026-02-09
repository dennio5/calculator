// cookie-consent.js - GDPR/CCPA Cookie Consent Manager
(function() {
    'use strict';
    
    const CONSENT_COOKIE_NAME = 'user_cookie_consent';
    const CONSENT_EXPIRY_DAYS = 365;
    let adsLoaded = false;

    // Cookie utility functions
    function setCookie(name, value, days) {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + (value || '') + expires + '; path=/; SameSite=Lax';
    }

    function getCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function hasUserConsented() {
        return getCookie(CONSENT_COOKIE_NAME) === 'true';
    }

    function showCookieBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            setTimeout(function() {
                banner.classList.remove('hidden');
                banner.classList.add('visible');
            }, 500);
        }
    }

    function hideCookieBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.add('hiding');
            setTimeout(function() {
                banner.classList.remove('visible', 'hiding');
                banner.classList.add('hidden');
            }, 300);
        }
    }

    function loadAdvertisements() {
        if (adsLoaded) {
            return;
        }

        console.log('Loading advertisements after user consent...');

        // GOOGLE ADSENSE INTEGRATION
        // Uncomment and replace with your actual AdSense publisher ID
        /*
        const adsenseScript = document.createElement('script');
        adsenseScript.async = true;
        adsenseScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX';
        adsenseScript.crossOrigin = 'anonymous';
        document.head.appendChild(adsenseScript);
        */

        adsLoaded = true;
    }

    function acceptCookies() {
        setCookie(CONSENT_COOKIE_NAME, 'true', CONSENT_EXPIRY_DAYS);
        hideCookieBanner();
        loadAdvertisements();
    }

    function init() {
        // Check if user has already given consent
        if (hasUserConsented()) {
            loadAdvertisements();
        } else {
            showCookieBanner();
        }

        // Bind accept button
        const acceptBtn = document.getElementById('accept-cookies-btn');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', acceptCookies);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
