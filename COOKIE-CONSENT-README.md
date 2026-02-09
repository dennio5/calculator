# Cookie Consent Banner - Implementation Guide

## Overview
This implementation provides GDPR/CCPA compliant cookie consent management for your streaming royalties calculator website. Ads will only load AFTER the user has given explicit consent.

## Files Modified/Added
- ✅ `index.html` - Added cookie consent banner HTML
- ✅ `styles.css` - Added cookie banner styling
- ✅ `cookie-consent.js` - NEW: Cookie consent logic and ad loading

## How It Works

### 1. User Flow
1. User visits the website for the first time
2. Cookie consent banner appears at the bottom of the page
3. User clicks "Accept Cookies"
4. Banner slides away and consent is saved in a cookie (expires in 365 days)
5. Advertisements are loaded dynamically
6. On subsequent visits, ads load automatically (no banner shown)

### 2. Cookie Storage
- Cookie name: `user_cookie_consent`
- Value: `true` (when accepted)
- Expiry: 365 days
- Path: `/`
- SameSite: `Lax`

## Google AdSense Integration

### Step 1: Get Your AdSense Publisher ID
1. Log in to your Google AdSense account
2. Go to "Ads" → "Overview"
3. Your publisher ID looks like: `ca-pub-XXXXXXXXXXXXXXXX`

### Step 2: Enable Ad Loading in cookie-consent.js

Open `cookie-consent.js` and find the `loadAdvertisements()` method (around line 67).

**Uncomment and replace** this section:

```javascript
// CURRENT (commented out):
/*
const adsenseScript = document.createElement('script');
adsenseScript.async = true;
adsenseScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX';
adsenseScript.crossOrigin = 'anonymous';
document.head.appendChild(adsenseScript);
*/

// CHANGE TO (with your publisher ID):
const adsenseScript = document.createElement('script');
adsenseScript.async = true;
adsenseScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456'; // Replace with YOUR ID
adsenseScript.crossOrigin = 'anonymous';
document.head.appendChild(adsenseScript);
```

### Step 3: Add Ad Units to Your Pages

Add ad placements where you want ads to appear in `index.html`:

```html
<!-- Example: Add this where you want an ad to display -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
```

Common placements:
- After the promo section (before footer)
- Between platform sections
- In the sidebar (if you add one)

### Step 4: Initialize Ad Display (Optional)

If you want to manually trigger ad display after consent, uncomment this in `cookie-consent.js`:

```javascript
displayAds() {
    // For Google AdSense:
    const adSlots = document.querySelectorAll('.adsbygoogle');
    adSlots.forEach(slot => {
        (adsbygoogle = window.adsbygoogle || []).push({});
    });
}
```

And call it in `loadAdvertisements()`:
```javascript
this.adsLoaded = true;
this.displayAds(); // Add this line
```

## Alternative Ad Networks

If you're using a different ad network (not AdSense), modify the `loadAdvertisements()` method:

```javascript
// Example for alternative ad network
const adScript = document.createElement('script');
adScript.src = 'https://your-ad-network.com/ads.js';
adScript.async = true;
document.head.appendChild(adScript);
```

## Testing the Implementation

### Test 1: First Visit (No Consent)
1. Clear your browser cookies
2. Visit the website
3. ✅ Cookie banner should appear at the bottom
4. ✅ No ads should load yet

### Test 2: Accept Cookies
1. Click "Accept Cookies" button
2. ✅ Banner should slide away smoothly
3. ✅ Check browser DevTools → Network tab: AdSense script should load
4. ✅ Check Application → Cookies: `user_cookie_consent=true` should be set

### Test 3: Return Visit (With Consent)
1. Refresh the page (or close and reopen)
2. ✅ Cookie banner should NOT appear
3. ✅ Ads should load automatically

### Test 4: Clear Consent
To reset and test again:
```javascript
// Run this in browser console
document.cookie = 'user_cookie_consent=; Max-Age=-99999999; path=/';
location.reload();
```

## Customization Options

### Change Cookie Expiry
In `cookie-consent.js`, line 9:
```javascript
this.CONSENT_EXPIRY_DAYS = 365; // Change to desired number of days
```

### Modify Banner Text
In `index.html`, find the cookie banner section:
```html
<p>We use cookies to improve your experience and serve personalized ads...</p>
```

### Change Banner Position
Currently: Fixed at bottom

To change to top:
```css
/* In styles.css */
.cookie-consent-banner {
    bottom: auto; /* Remove this */
    top: 0;       /* Add this */
    border-top: none;
    border-bottom: 2px solid var(--border);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}
```

## GDPR/CCPA Compliance Notes

✅ **What This Implementation Provides:**
- Explicit user consent before loading tracking cookies/ads
- Persistent consent storage (365 days)
- Clear privacy policy link
- Opt-in mechanism (not pre-checked)

⚠️ **Additional Compliance Steps You Should Consider:**
1. Update your Privacy Policy page with:
   - Cookie types used
   - Third-party services (Google AdSense)
   - Data retention periods
   - User rights (access, deletion)

2. For EU users, consider adding:
   - "Reject" or "Manage Preferences" button
   - Granular cookie categories (necessary, analytics, advertising)

3. For California (CCPA) users:
   - "Do Not Sell My Personal Information" link

## Troubleshooting

### Banner Doesn't Appear
- Check browser console for JavaScript errors
- Verify `cookie-consent.js` is loaded: View source → check script tag
- Clear cookies and cache

### Ads Don't Load After Consent
- Verify your AdSense publisher ID is correct
- Check browser console for blocked scripts
- Ensure ad blocker is disabled
- Wait a few minutes (AdSense can take time to approve/activate)

### Banner Appears Every Time
- Check if cookies are being saved: DevTools → Application → Cookies
- Verify cookie path is set to `/`
- Check if browser is blocking third-party cookies

## Support & Resources

- Google AdSense Help: https://support.google.com/adsense
- GDPR Guidelines: https://gdpr.eu/cookies/
- CCPA Information: https://oag.ca.gov/privacy/ccpa

## File Structure

```
your-website/
├── index.html              (Modified - added banner)
├── privacy-policy.html     (Existing)
├── script.js              (Existing - calculator logic)
├── cookie-consent.js      (NEW - consent management)
└── styles.css             (Modified - added banner styles)
```

---

**Need Help?** Check the comments in `cookie-consent.js` for detailed explanations of each function.
