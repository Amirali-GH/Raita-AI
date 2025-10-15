// Dropshipping Page JavaScript
class DropshippingHub {
    constructor() {
        this.searchInput = document.getElementById('product-search');
        this.originCountry = document.getElementById('origin-country');
        this.suppliersList = document.querySelector('.suppliers-list');
        this.resultsCount = document.querySelector('.results-count');
        
        this.suppliers = [];
        this.currentFilter = 'qatar';
        
        this.init();
    }

    init() {
        // Search functionality
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Filter by origin country
        if (this.originCountry) {
            this.originCountry.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.filterSuppliers();
            });
        }

        // Add to Sales Channel buttons
        this.initSalesChannelButtons();

        // Initialize supplier data
        this.loadSupplierData();
    }

    loadSupplierData() {
        // Mock supplier data - in real app, this would come from API
        this.suppliers = [
            {
                id: 1,
                name: 'Household Electric Smart Automatic Coffee Machine',
                price: 44.00,
                moq: 50,
                company: 'Shenzhen FutureTech Appliances',
                location: 'Shenzhen, China',
                country: 'china',
                verified: true,
                rating: '5.0/5.0 (11)',
                badge: 'gold'
            },
            {
                id: 2,
                name: 'Portable 20 Bar Electric Espresso Maker',
                price: 46.50,
                moq: 1,
                company: 'Shenzhen FutureTech Appliances',
                location: 'Yiwu, China',
                country: 'china',
                verified: false,
                rating: '3.0/5.0 (18)',
                badge: 'new'
            },
            {
                id: 3,
                name: 'High End Atmosphere Commercial Espresso Maker',
                price: 58.80,
                moq: 1000,
                company: 'Shenzhen FutureTech Appliances',
                location: 'Guangzhou, China',
                country: 'china',
                verified: true,
                rating: '4.4/5.0 (84)',
                badge: 'gold'
            }
        ];
    }

    handleSearch(query) {
        const trimmedQuery = query.trim().toLowerCase();
        
        if (trimmedQuery.length < 2) {
            this.updateResultsCount(this.suppliers.length);
            return;
        }

        // Filter suppliers based on search query
        const filtered = this.suppliers.filter(supplier => 
            supplier.name.toLowerCase().includes(trimmedQuery) ||
            supplier.company.toLowerCase().includes(trimmedQuery)
        );

        this.updateResultsCount(filtered.length, query);
    
    }

    filterSuppliers() {      
        // Show loading state
        if (this.suppliersList) {
            this.suppliersList.style.opacity = '0.5';
        }

        // Simulate API call
        setTimeout(() => {
            if (this.suppliersList) {
                this.suppliersList.style.opacity = '1';
            }
            
            this.showNotification(`Showing suppliers from ${this.getCountryName(this.currentFilter)}`);
        }, 500);
    }

    getCountryName(code) {
        const countries = {
            'qatar': 'Qatar',
            'china': 'China',
            'uae': 'UAE',
            'turkey': 'Turkey'
        };
        return countries[code] || code;
    }

    updateResultsCount(count, query = 'Smart Coffee Maker') {
        if (this.resultsCount) {
            this.resultsCount.innerHTML = `Showing <strong>${count} suppliers</strong> for "${query}"`;
        }
    }

    initSalesChannelButtons() {
        const buttons = document.querySelectorAll('.btn--add-sales-channel');
        
        buttons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                this.addToSalesChannel(index);
            });
        });
    }

    addToSalesChannel(supplierId) {
        const btn = document.querySelectorAll('.btn--add-sales-channel')[supplierId];
        
        if (!btn) return;

        // Show loading state
        const originalText = btn.textContent;
        btn.textContent = 'Adding...';
        btn.disabled = true;
        btn.style.opacity = '0.6';

        // Simulate adding to sales channel
        setTimeout(() => {
            btn.textContent = '✓ Added';
            btn.style.background = 'var(--success-dark)';
            btn.style.color = 'white';
            btn.style.borderColor = 'var(--success-dark)';
            btn.style.opacity = '1';
            
            this.showNotification('Supplier added to sales channel successfully!', 'success');

            // Reset after 2 seconds
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                btn.style.background = '';
                btn.style.color = '';
                btn.style.borderColor = '';
            }, 2000);
        }, 1000);
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
            background: type === 'success' ? '#04910C' : '#8237E8',
            color: 'white',
            borderRadius: '8px',
            zIndex: '10000',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            animation: 'slideInNotification 0.3s ease',
            fontFamily: 'var(--font-primary)',
            fontSize: '14px',
            fontWeight: '500'
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutNotification 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add notification animations
if (!document.getElementById('dropship-animations')) {
    const style = document.createElement('style');
    style.id = 'dropship-animations';
    style.textContent = `
        @keyframes slideInNotification {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutNotification {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize Dropshipping Hub when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new DropshippingHub();
});