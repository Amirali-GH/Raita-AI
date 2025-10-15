class ReportsPage {
    constructor() {
        this.exportButtons = document.querySelectorAll('.btn--export');
        this.swapButton = document.querySelector('.btn-swap');
        this.isMobile = window.innerWidth <= 767;
        this.charts = {};
        
        this.init();
        this.loadChartJS();
        this.setupResponsiveListeners();
    }

    loadChartJS() {
        // Check if Chart.js is already loaded
        if (typeof Chart !== 'undefined') {
            this.initCharts();
            return;
        }

        // Load Chart.js from CDN
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
        script.onload = () => {
            console.log('Chart.js loaded successfully');
            this.initCharts();
        };
        script.onerror = () => {
            console.error('Failed to load Chart.js');
            this.showChartError();
        };
        document.head.appendChild(script);
    }

    showChartError() {
        const chartContainers = document.querySelectorAll('.chart-container');
        chartContainers.forEach(container => {
            container.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; 
                            background: var(--surface); border-radius: 8px; padding: 20px; text-align: center;">
                    <p style="color: var(--muted); font-size: 14px;">
                        Unable to load charts. Please check your internet connection.
                    </p>
                </div>
            `;
        });
    }

    setupResponsiveListeners() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const wasMobile = this.isMobile;
                this.isMobile = window.innerWidth <= 767;
                
                if (wasMobile !== this.isMobile) {
                    this.handleResize();
                }
            }, 250);
        });
    }

    handleResize() {
        // Destroy and recreate charts on significant size changes
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        this.charts = {};
        
        // Reinitialize charts
        setTimeout(() => {
            if (typeof Chart !== 'undefined') {
                this.initCharts();
            }
        }, 100);
    }

    init() {
        // Export buttons
        if (this.exportButtons.length > 0) {
            this.exportButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const format = btn.textContent.includes('Excel') ? 'Excel' : 'PDF';
                    this.exportData(format);
                });
            });
        }

        // Swap button
        if (this.swapButton) {
            this.swapButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.swapCountries();
            });
        }
    }

    exportData(format) {
        this.showNotification(`Exporting report as ${format}...`, 'info');
        
        // Simulate export process
        setTimeout(() => {
            this.showNotification(`${format} file downloaded successfully!`, 'success');
        }, 1500);
    }

    swapCountries() {
        const selects = document.querySelectorAll('.reports-filter select');
        if (selects.length === 2) {
            const temp = selects[0].value;
            selects[0].value = selects[1].value;
            selects[1].value = temp;
            
            this.showNotification('Countries swapped successfully!', 'success');
        }
    }

    initCharts() {
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js is not loaded. Charts will not be displayed.');
            this.showChartError();
            return;
        }

        // Set default chart options
        Chart.defaults.responsive = true;
        Chart.defaults.maintainAspectRatio = false;
        Chart.defaults.font.family = "'Inter', sans-serif";
        
        this.createTradeValueChart();
        this.createPriceComparisonChart();
    }

    createTradeValueChart() {
        const canvas = document.getElementById('tradeValueChart');
        if (!canvas) {
            console.warn('Trade value chart canvas not found');
            return;
        }

        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart if it exists
        if (this.charts.tradeValue) {
            this.charts.tradeValue.destroy();
        }
        
        this.charts.tradeValue = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
                datasets: [{
                    label: 'Trade Value',
                    data: [3200, 1000, 1150, 800, 2000, 1300, 2800],
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: this.isMobile ? 3 : 4,
                    pointHoverRadius: this.isMobile ? 5 : 6,
                    pointBackgroundColor: '#3B82F6',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: '#1F2937',
                        padding: this.isMobile ? 8 : 12,
                        titleColor: '#F9FAFB',
                        bodyColor: '#F9FAFB',
                        borderColor: '#374151',
                        borderWidth: 1,
                        titleFont: {
                            size: this.isMobile ? 11 : 12
                        },
                        bodyFont: {
                            size: this.isMobile ? 11 : 12
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + (value / 1000) + 'k';
                            },
                            color: '#6B7280',
                            font: {
                                size: this.isMobile ? 10 : 12
                            }
                        },
                        grid: {
                            color: '#F3F4F6',
                            drawBorder: false
                        }
                    },
                    x: {
                        ticks: {
                            color: '#6B7280',
                            font: {
                                size: this.isMobile ? 10 : 12
                            }
                        },
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    createPriceComparisonChart() {
        const canvas = document.getElementById('priceComparisonChart');
        if (!canvas) {
            console.warn('Price comparison chart canvas not found');
            return;
        }

        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart if it exists
        if (this.charts.priceComparison) {
            this.charts.priceComparison.destroy();
        }
        
        this.charts.priceComparison = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2022', 'Q2', 'Q3', 'Q4', '2023', 'Q2', 'Q3', 'Q4', '2024', 'Q2', 'Q3', 'Q4', '2025'],
                datasets: [
                    {
                        label: "Brazil's Avg. Price",
                        data: [8000, 5500, 9500, 8000, 5000, 10000, 9000, 6000, 3000, 8000, 9500, 6000, 8500],
                        borderColor: '#8237E8',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        tension: 0.4,
                        pointRadius: this.isMobile ? 0 : 0,
                        pointHoverRadius: this.isMobile ? 5 : 6,
                        pointBackgroundColor: '#8237E8',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    },
                    {
                        label: "Germany's Market Avg. Price",
                        data: [7000, 4500, 11000, 7500, 4000, 9000, 10000, 5000, 2000, 7000, 10500, 5500, 7500],
                        borderColor: '#FF69B4',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        tension: 0.4,
                        pointRadius: this.isMobile ? 0 : 0,
                        pointHoverRadius: this.isMobile ? 5 : 6,
                        pointBackgroundColor: '#FF69B4',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: '#1F2937',
                        padding: this.isMobile ? 8 : 12,
                        titleColor: '#F9FAFB',
                        bodyColor: '#F9FAFB',
                        borderColor: '#374151',
                        borderWidth: 1,
                        titleFont: {
                            size: this.isMobile ? 11 : 12
                        },
                        bodyFont: {
                            size: this.isMobile ? 11 : 12
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return  + (value / 1000) + 'k';
                            },
                            color: '#6B7280',
                            font: {
                                size: this.isMobile ? 10 : 12
                            }
                        },
                        grid: {
                            color: '#F3F4F6',
                            drawBorder: false
                        }
                    },
                    x: {
                        ticks: {
                            color: '#6B7280',
                            font: {
                                size: this.isMobile ? 10 : 12
                            },
                            maxRotation: this.isMobile ? 45 : 0,
                            minRotation: this.isMobile ? 45 : 0
                        },
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        const colors = {
            success: '#04910C',
            warning: '#FFA500',
            info: '#8237E8',
            error: '#ED544E'
        };

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            background: colors[type] || colors.info,
            color: 'white',
            borderRadius: '8px',
            zIndex: '10000',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontFamily: 'var(--font-primary)',
            fontSize: '14px',
            fontWeight: '500',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease',
            maxWidth: 'calc(100vw - 40px)'
        });
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    destroy() {
        // Cleanup method to destroy all charts
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        this.charts = {};
    }
}

// Initialize Reports Page
let reportsPageInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    // Cleanup any existing instance
    if (reportsPageInstance) {
        reportsPageInstance.destroy();
    }
    
    reportsPageInstance = new ReportsPage();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (reportsPageInstance) {
        reportsPageInstance.destroy();
    }
});