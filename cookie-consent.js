// cookie-consent.js - GDPR/CCPA Cookie Consent Manager

class CookieConsentManager {
    constructor() {
        this.CONSENT_COOKIE_NAME = 'user_cookie_consent';
        this.CONSENT_EXPIRY_DAYS = 365;
        this.adsLoaded = false;
        
        this.init();
    }

    init() {
        // Check if user has already given consent
        if (this.hasUserConsented()) {
            // User has consented - load ads immediately
            this.loadAdvertisements();
        } else {
            // Show cookie banner
            this.showCookieBanner();
        }

        // Bind event listeners
        this.bindEvents();
    }

    bindEvents() {
        const acceptBtn = document.getElementById('accept-cookies-btn');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                this.acceptCookies();
            });
        }
    }

    hasUserConsented() {
        return this.getCookie(this.CONSENT_COOKIE_NAME) === 'true';
    }

    showCookieBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            // Small delay for smooth appearance
            setTimeout(() => {
                banner.classList.remove('hidden');
                banner.classList.add('visible');
            }, 500);
        }
    }

    hideCookieBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.add('hiding');
            setTimeout(() => {
                banner.classList.remove('visible', 'hiding');
                banner.classList.add('hidden');
            }, 300);
        }
    }

    acceptCookies() {
        // Set consent cookie
        this.setCookie(this.CONSENT_COOKIE_NAME, 'true', this.CONSENT_EXPIRY_DAYS);
        
        // Hide the banner
        this.hideCookieBanner();
        
        // Load advertisements
        this.loadAdvertisements();
    }

    loadAdvertisements() {
        if (this.adsLoaded) {
            return; // Already loaded
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

        // ALTERNATIVE: Other ad networks
        // Example for other ad networks:
        /*
        const adScript = document.createElement('script');
        adScript.src = 'https://your-ad-network.com/ads.js';
        adScript.async = true;
        document.head.appendChild(adScript);
        */

        this.adsLoaded = true;

        // You can also trigger ad display on specific elements
        // this.displayAds();
    }

    displayAds() {
        // Example: Initialize ad slots after consent
        // This is where you would initialize specific ad units
        
        // For Google AdSense:
        /*
        const adSlots = document.querySelectorAll('.adsbygoogle');
        adSlots.forEach(slot => {
            (adsbygoogle = window.adsbygoogle || []).push({});
        });
        */
    }

    // Cookie utility functions
    setCookie(name, value, days) {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + (value || '') + expires + '; path=/; SameSite=Lax';
    }

    getCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    eraseCookie(name) {
        document.cookie = name + '=; Max-Age=-99999999; path=/';
    }
}

// Initialize the consent manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CookieConsentManager();
});
