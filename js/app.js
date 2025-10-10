class RaitaDashboard {
	constructor() {
		this.init();
	}

	init() {
		this.setupEventListeners();
		this.setupMobileMenu();
	}

	setupEventListeners() {
		// Market AI functionality
		const askButton = document.querySelector('.btn--ask');
		const marketInput = document.querySelector('.market-ai__input');
		const chips = document.querySelectorAll('.chip');
		const resultsContainer = document.querySelector('.market-ai__results');

		askButton.addEventListener('click', () => this.handleAsk(marketInput.value));
		marketInput.addEventListener('keypress', (e) => {
			if (e.key === 'Enter') this.handleAsk(marketInput.value);
		});

		chips.forEach(chip => {
			chip.addEventListener('click', () => {
				marketInput.value = chip.dataset.prompt;
				this.handleAsk(chip.dataset.prompt);
			});
		});

		// View Analysis buttons
		const viewAnalysisButtons = document.querySelectorAll('.btn--view-analysis');
		viewAnalysisButtons.forEach(button => {
			button.addEventListener('click', (e) => this.toggleMarketAnalysis(e));
		});

		// Analyze product buttons
		const analyzeButtons = document.querySelectorAll('.btn--analyze');
		analyzeButtons.forEach(button => {
			button.addEventListener('click', (e) => this.analyzeProduct(e));
		});

		// Logout button
		const logoutButton = document.querySelector('#btn-logout');
		logoutButton.addEventListener('click', () => this.handleLogout());

		// Keyboard navigation
		document.addEventListener('keydown', (e) => this.handleKeyboard(e));
	}

	handleAsk(prompt) {
		if (!prompt.trim()) return;

		const askButton = document.querySelector('.btn--ask');
		const marketInput = document.querySelector('.market-ai__input');
		const resultsContainer = document.querySelector('.market-ai__results');

		// Disable controls
		askButton.disabled = true;
		marketInput.disabled = true;
		askButton.innerHTML = '<div class="spinner"></div>';

		// Set busy state
		resultsContainer.setAttribute('aria-busy', 'true');

		// Simulate API call
		setTimeout(() => {
			this.createResultCard(prompt);

			// Re-enable controls
			askButton.disabled = false;
			marketInput.disabled = false;
			askButton.textContent = 'Ask';
			resultsContainer.setAttribute('aria-busy', 'false');

			// Clear input
			marketInput.value = '';
		}, 600);
	}

	createResultCard(prompt) {
		const resultsContainer = document.querySelector('.market-ai__results');
		const timestamp = new Date().toLocaleTimeString();

		const resultCard = document.createElement('div');
		resultCard.className = 'result-card';
		resultCard.innerHTML = `
      <div class="result-card__header">
        <strong>Query:</strong> "${prompt}"
      </div>
      <div class="result-card__content">
        <p>Based on current market data, here are the trending products matching your query:</p>
        <ul>
          <li>Product A - High demand (45% growth)</li>
          <li>Product B - Medium demand (22% growth)</li>
          <li>Product C - Emerging trend (18% growth)</li>
        </ul>
        <p class="muted">Analysis generated at ${timestamp}</p>
      </div>
    `;

		resultsContainer.appendChild(resultCard);
		resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
	}

	toggleMarketAnalysis(event) {
		const button = event.currentTarget;
		const chartContainer = button.nextElementSibling;
		const market = button.closest('.market-card').querySelector('.market-card__title').textContent;
		const isExpanded = button.getAttribute('aria-expanded') === 'true';

		button.setAttribute('aria-expanded', !isExpanded);

		if (!isExpanded) {
			chartContainer.hidden = false;
			this.initMarketChart(chartContainer.querySelector('.chart-canvas'), market);
		} else {
			chartContainer.hidden = true;
		}
	}

	initMarketChart(canvas, market) {
		// Only initialize if not already initialized
		if (canvas.chart) return;

		const ctx = canvas.getContext('2d');
		const data = this.generateMockChartData(market);

		canvas.chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: data.labels,
				datasets: [{
					label: 'Market Growth',
					data: data.values,
					borderColor: '#7c3aed',
					backgroundColor: 'rgba(124, 58, 237, 0.1)',
					borderWidth: 2,
					fill: true,
					tension: 0.4
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: false
					}
				},
				scales: {
					y: {
						beginAtZero: true,
						grid: {
							color: 'rgba(255, 255, 255, 0.1)'
						},
						ticks: {
							color: 'var(--muted)'
						}
					},
					x: {
						grid: {
							color: 'rgba(255, 255, 255, 0.1)'
						},
						ticks: {
							color: 'var(--muted)'
						}
					}
				}
			}
		});
	}

	generateMockChartData(market) {
		const baseData = {
			'Canada': [45, 52, 48, 60, 55, 65, 70],
			'Australia': [30, 35, 40, 38, 45, 50, 55],
			'Saudi Arabia': [25, 30, 35, 40, 45, 50, 60]
		};

		const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
		const values = baseData[market] || [30, 35, 40, 45, 50, 55, 60];

		return { labels, values };
	}

	analyzeProduct(event) {
		const button = event.currentTarget;
		const productCard = button.closest('.product-card');
		const productName = productCard.querySelector('.product-card__title').textContent;

		button.innerHTML = '<div class="spinner"></div>';
		button.disabled = true;

		// Simulate analysis
		setTimeout(() => {
			button.textContent = 'Analyzed';
			button.style.background = 'var(--accent)';
			button.style.color = 'var(--bg)';

			// Show notification
			this.showNotification(`Analysis complete for ${productName}`);
		}, 800);
	}

	showNotification(message) {
		const notification = document.createElement('div');
		notification.className = 'notification';
		notification.textContent = message;
		notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--accent);
      color: var(--bg);
      padding: var(--space-md) var(--space-lg);
      border-radius: var(--radius-md);
      z-index: 10000;
      font-weight: 500;
      box-shadow: var(--shadow-soft);
    `;

		document.body.appendChild(notification);

		setTimeout(() => {
			notification.remove();
		}, 3000);
	}

	setupMobileMenu() {
		const menuToggle = document.querySelector('.topbar__menu-toggle');
		const sidebar = document.querySelector('.sidebar');

		menuToggle.addEventListener('click', () => {
			const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

			menuToggle.setAttribute('aria-expanded', !isExpanded);
			sidebar.style.transform = isExpanded ? 'translateX(-100%)' : 'translateX(0)';

			// Focus trap when sidebar is open
			if (!isExpanded) {
				this.setupFocusTrap(sidebar);
			}
		});

		// Close sidebar when clicking outside on mobile
		document.addEventListener('click', (e) => {
			if (window.innerWidth < 768 &&
				!sidebar.contains(e.target) &&
				!menuToggle.contains(e.target) &&
				sidebar.style.transform === 'translateX(0px)') {
				sidebar.style.transform = 'translateX(-100%)';
				menuToggle.setAttribute('aria-expanded', 'false');
			}
		});
	}

	setupFocusTrap(element) {
		const focusableElements = element.querySelectorAll(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);

		if (focusableElements.length === 0) return;

		const firstElement = focusableElements[0];
		const lastElement = focusableElements[focusableElements.length - 1];

		const trapFocus = (e) => {
			if (e.key === 'Tab') {
				if (e.shiftKey) {
					if (document.activeElement === firstElement) {
						e.preventDefault();
						lastElement.focus();
					}
				} else {
					if (document.activeElement === lastElement) {
						e.preventDefault();
						firstElement.focus();
					}
				}
			}
		};

		element.addEventListener('keydown', trapFocus);
		firstElement.focus();

		// Cleanup function
		return () => element.removeEventListener('keydown', trapFocus);
	}

	handleKeyboard(event) {
		// ESC key closes mobile sidebar
		if (event.key === 'Escape' && window.innerWidth < 768) {
			const sidebar = document.querySelector('.sidebar');
			const menuToggle = document.querySelector('.topbar__menu-toggle');

			if (sidebar.style.transform === 'translateX(0px)') {
				sidebar.style.transform = 'translateX(-100%)';
				menuToggle.setAttribute('aria-expanded', 'false');
			}
		}
	}

	handleLogout() {
		if (confirm('Are you sure you want to logout?')) {
			// Simulate logout process
			this.showNotification('Logging out...');

			setTimeout(() => {
				window.location.href = '/login'; // Redirect to login page
			}, 1000);
		}
	}
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	new RaitaDashboard();
});

// Handle resize events with debounce
let resizeTimeout;
window.addEventListener('resize', () => {
	clearTimeout(resizeTimeout);
	resizeTimeout = setTimeout(() => {
		// Adjust font size for smaller screens
		if (window.innerWidth < 768) {
			document.documentElement.style.fontSize = '0.95rem';
		} else {
			document.documentElement.style.fontSize = '1rem';
		}
	}, 150);
});