class ReportsPage {
    constructor() {
        this.exportButtons = document.querySelectorAll('.btn--export');
        this.swapButton = document.querySelector('.btn-swap');
        
        this.init();
        this.initCharts();
    }

    init() {
        // Export buttons
        if (this.exportButtons.length > 0) {
            this.exportButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const format = btn.textContent.includes('Excel') ? 'Excel' : 'PDF';
                    this.exportData(format);
                });
            });
        }

        // Swap button
        if (this.swapButton) {
            this.swapButton.addEventListener('click', () => {
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
        // Check if Chart.js is available
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js is not loaded. Charts will not be displayed.');
            return;
        }

        this.createTradeValueChart();
        this.createPriceComparisonChart();
    }

    createTradeValueChart() {
        const canvas = document.getElementById('tradeValueChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        new Chart(ctx, {
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
                    pointRadius: 4,
                    pointHoverRadius: 6,
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
                        padding: 12,
                        titleColor: '#F9FAFB',
                        bodyColor: '#F9FAFB',
                        borderColor: '#374151',
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value / 1000 + 'k';
                            },
                            color: '#6B7280',
                            font: {
                                size: 12
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
                                size: 12
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
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        new Chart(ctx, {
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
                        pointRadius: 0,
                        pointHoverRadius: 6,
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
                        pointRadius: 0,
                        pointHoverRadius: 6,
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
                        padding: 12,
                        titleColor: '#F9FAFB',
                        bodyColor: '#F9FAFB',
                        borderColor: '#374151',
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value / 1000 + 'k';
                            },
                            color: '#6B7280',
                            font: {
                                size: 12
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
                                size: 12
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

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            background: type === 'success' ? '#04910C' : type === 'warning' ? '#FFA500' : '#8237E8',
            color: 'white',
            borderRadius: '8px',
            zIndex: '10000',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            animation: 'slideIn 0.3s ease',
            fontFamily: 'var(--font-primary)',
            fontSize: '14px',
            fontWeight: '500'
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize Reports Page
document.addEventListener('DOMContentLoaded', () => {
    new ReportsPage();
});