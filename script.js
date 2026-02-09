// script.js
class StreamingRoyaltyCalculator {
    constructor() {
        // Fixed payout rates in USD
        this.PAYOUT_RATES = {
            spotify: 0.004,
            apple: 0.008,
            amazon: 0.006,
            youtube: 0.007,
            pandora: 0.0013,
            soundcloud: 0.003,
            tidal: 0.013,
            deezer: 0.006
        };

        this.PLATFORM_NAMES = {
            spotify: 'Spotify',
            apple: 'Apple Music',
            amazon: 'Amazon Music',
            youtube: 'YouTube Music',
            pandora: 'Pandora',
            soundcloud: 'SoundCloud',
            tidal: 'Tidal',
            deezer: 'Deezer'
        };

        this.CURRENCY_SYMBOLS = {
            USD: '$',
            EUR: '€',
            GBP: '£',
            CAD: 'C$',
            AUD: 'A$',
            JPY: '¥'
        };

        this.exchangeRates = { USD: 1 };
        this.currentCurrency = 'USD';
        this.debounceTimer = null;
        this.isCalculating = false;
        this.isBreakdownExpanded = false;
        this.isPlatformsExpanded = false;
        this.isMorePlatformsExpanded = false;

        this.init();
    }

    init() {
        this.renderPlatforms();
        this.bindEvents();
        this.fetchExchangeRates();
        this.calculate();
    }

    renderPlatforms() {
        const primaryContainer = document.getElementById('primary-platforms');
        const secondaryContainer = document.getElementById('secondary-platforms');
        primaryContainer.innerHTML = '';
        secondaryContainer.innerHTML = '';

        const platformIds = Object.keys(this.PAYOUT_RATES);
        
        platformIds.forEach((platformId, index) => {
            const card = document.createElement('div');
            card.className = 'platform-card';
            card.innerHTML = `
                <div class="platform-header">
                    <div class="platform-name">${this.PLATFORM_NAMES[platformId]}</div>
                    <div class="platform-rate">$${this.PAYOUT_RATES[platformId].toFixed(4)}/stream</div>
                </div>
                <input 
                    type="number" 
                    class="platform-input" 
                    id="${platformId}-streams" 
                    placeholder="0"
                    min="0"
                    step="1"
                >
            `;
            
            // First 4 platforms go to primary, rest to secondary
            if (index < 4) {
                primaryContainer.appendChild(card);
            } else {
                secondaryContainer.appendChild(card);
            }
        });
    }

    bindEvents() {
        // Debounced input listeners for streams
        document.querySelectorAll('.platform-input').forEach(input => {
            input.addEventListener('input', (e) => {
                this.validateInput(e.target);
                this.debouncedCalculate();
            });

            input.addEventListener('blur', (e) => {
                if (e.target.value === '') {
                    e.target.value = '0';
                }
            });
        });

        // Royalty share input
        document.getElementById('royalty-share').addEventListener('input', () => {
            this.debouncedCalculate();
        });

        // Currency selector
        document.getElementById('currency').addEventListener('change', (e) => {
            this.currentCurrency = e.target.value;
            this.fetchExchangeRates();
        });

        // Platforms toggle
        const platformsToggle = document.getElementById('platforms-toggle');
        const platformsList = document.getElementById('platforms-grid');
        
        platformsToggle.addEventListener('click', () => {
            this.isPlatformsExpanded = !this.isPlatformsExpanded;
            
            if (this.isPlatformsExpanded) {
                platformsList.classList.remove('collapsed');
                platformsList.classList.add('expanded');
                platformsToggle.classList.add('expanded');
            } else {
                platformsList.classList.remove('expanded');
                platformsList.classList.add('collapsed');
                platformsToggle.classList.remove('expanded');
            }
        });

        // Show more platforms toggle
        const showMoreBtn = document.getElementById('show-more-platforms');
        const secondaryPlatforms = document.getElementById('secondary-platforms');
        
        showMoreBtn.addEventListener('click', () => {
            this.isMorePlatformsExpanded = !this.isMorePlatformsExpanded;
            
            if (this.isMorePlatformsExpanded) {
                secondaryPlatforms.classList.remove('collapsed');
                secondaryPlatforms.classList.add('expanded');
                showMoreBtn.classList.add('expanded');
                showMoreBtn.querySelector('.show-more-text').textContent = 'Show fewer platforms';
            } else {
                secondaryPlatforms.classList.remove('expanded');
                secondaryPlatforms.classList.add('collapsed');
                showMoreBtn.classList.remove('expanded');
                showMoreBtn.querySelector('.show-more-text').textContent = 'Show more platforms';
            }
        });

        // Breakdown toggle
        const toggleBtn = document.getElementById('breakdown-toggle');
        const breakdown = document.getElementById('platform-breakdown');
        
        toggleBtn.addEventListener('click', () => {
            this.isBreakdownExpanded = !this.isBreakdownExpanded;
            
            if (this.isBreakdownExpanded) {
                breakdown.classList.remove('collapsed');
                breakdown.classList.add('expanded');
                toggleBtn.classList.add('expanded');
                toggleBtn.querySelector('.toggle-text').textContent = 'Hide Platform Breakdown';
            } else {
                breakdown.classList.remove('expanded');
                breakdown.classList.add('collapsed');
                toggleBtn.classList.remove('expanded');
                toggleBtn.querySelector('.toggle-text').textContent = 'Show Platform Breakdown';
            }
        });
    }

    validateInput(input) {
        const value = parseInt(input.value);
        if (value < 0 || isNaN(value)) {
            input.value = 0;
        }
    }

    debouncedCalculate() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.calculate();
        }, 150);
    }

    async fetchExchangeRates() {
        const exchangeInfo = document.getElementById('exchange-info');
        
        if (this.currentCurrency === 'USD') {
            this.exchangeRates = { USD: 1 };
            exchangeInfo.innerHTML = '<span class="loading">Rates: USD base</span>';
            this.calculate();
            return;
        }

        try {
            exchangeInfo.innerHTML = '<span class="loading">Updating exchange rates...</span>';
            
            // Using exchangerate-api.com (free tier)
            const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch exchange rates');
            }
            
            const data = await response.json();
            this.exchangeRates = data.rates;
            this.exchangeRates.USD = 1; // Ensure USD is 1
            
            const rate = this.exchangeRates[this.currentCurrency];
            const timestamp = new Date(data.date).toLocaleDateString();
            
            exchangeInfo.innerHTML = `
                <span>1 USD = ${rate.toFixed(4)} ${this.currentCurrency} (${timestamp})</span>
            `;
            
            this.calculate();
            
        } catch (error) {
            console.warn('Exchange rate fetch failed:', error);
            this.exchangeRates = { [this.currentCurrency]: 1 };
            exchangeInfo.innerHTML = '<span class="error">Exchange rate unavailable - showing approximate values</span>';
            this.calculate();
        }
    }

    calculate() {
        if (this.isCalculating) return;
        this.isCalculating = true;

        const royaltyShare = parseFloat(document.getElementById('royalty-share').value) / 100 || 1;
        const exchangeRate = this.exchangeRates[this.currentCurrency] || 1;
        const currencySymbol = this.CURRENCY_SYMBOLS[this.currentCurrency] || '$';

        let totalGrossUSD = 0;
        const platformResults = [];

        // Calculate for each platform
        Object.keys(this.PAYOUT_RATES).forEach(platformId => {
            const streams = parseInt(document.getElementById(`${platformId}-streams`).value) || 0;
            const payoutRate = this.PAYOUT_RATES[platformId];
            
            const grossUSD = streams * payoutRate;
            const netUSD = grossUSD * royaltyShare;
            
            // Convert to selected currency
            const grossConverted = grossUSD * exchangeRate;
            const netConverted = netUSD * exchangeRate;
            
            totalGrossUSD += grossUSD;

            if (streams > 0) {
                platformResults.push({
                    id: platformId,
                    name: this.PLATFORM_NAMES[platformId],
                    streams: streams,
                    gross: grossConverted,
                    net: netConverted
                });
            }
        });

        const totalNetUSD = totalGrossUSD * royaltyShare;
        const totalGrossConverted = totalGrossUSD * exchangeRate;
        const totalNetConverted = totalNetUSD * exchangeRate;

        this.displayResults(platformResults, totalGrossConverted, totalNetConverted, currencySymbol);
        this.isCalculating = false;
    }

    displayResults(platformResults, totalGross, totalNet, symbol) {
        // Update totals
        document.getElementById('total-gross').textContent = 
            `${symbol}${this.formatCurrency(totalGross)}`;
        document.getElementById('total-net').textContent = 
            `${symbol}${this.formatCurrency(totalNet)}`;

        // Update platform breakdown
        const breakdown = document.getElementById('platform-breakdown');
        breakdown.innerHTML = '';

        // Create container for platform results
        const resultsContainer = document.createElement('div');

        // Show all platforms, highlight those with earnings
        Object.keys(this.PAYOUT_RATES).forEach((platformId, index) => {
            const result = platformResults.find(r => r.id === platformId);
            const hasEarnings = result && result.streams > 0;
            
            const div = document.createElement('div');
            div.className = `platform-result ${hasEarnings ? 'has-earnings' : ''}`;
            
            div.innerHTML = `
                <h4>${this.PLATFORM_NAMES[platformId]}</h4>
                <div class="earnings">
                    ${hasEarnings ? `${symbol}${this.formatCurrency(result.net)}` : `${symbol}0.00`}
                </div>
                ${hasEarnings ? `<div class="streams-count">${this.formatNumber(result.streams)} streams</div>` : ''}
            `;
            
            resultsContainer.appendChild(div);

            // Animate entrance
            setTimeout(() => {
                div.classList.add('show');
            }, index * 50);
        });

        breakdown.appendChild(resultsContainer);
    }

    formatCurrency(amount) {
        return amount.toFixed(2);
    }

    formatNumber(num) {
        return num.toLocaleString();
    }
}

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new StreamingRoyaltyCalculator();
});
