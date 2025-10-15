// marketinsight.js - Interactive functionality for Market Insights page

class MarketInsightsApp {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.currentCategory = 'all';
        this.searchQuery = '';
        this.selectedRows = new Set();
        
        // Mock data for demonstration
        this.products = this.generateMockData(50);
        
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('market-insight-search-input');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchQuery = e.target.value.toLowerCase();
                    this.currentPage = 1;
                    this.renderTable();
                }, 300);
            });
        }

        // Search button
        const searchBtn = document.querySelector('.btn-search');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performSearch();
            });
        }

        // Category tabs
        const categoryTabs = document.querySelectorAll('.category-tab');
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.handleCategoryChange(e.target);
            });
        });

        // Filter button
        const filterBtn = document.querySelector('.btn--filter');
        if (filterBtn) {
            filterBtn.addEventListener('click', () => {
                this.showFilterDialog();
            });
        }

        // Export button
        const exportBtn = document.querySelector('.btn--export');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportData();
            });
        }

        // Pagination controls
        const pageSelect = document.querySelector('.pagination-select');
        if (pageSelect) {
            pageSelect.addEventListener('change', (e) => {
                this.currentPage = parseInt(e.target.value);
                this.renderTable();
            });
        }

        const prevBtn = document.querySelector('.btn-prev');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.updatePagination();
                    this.renderTable();
                }
            });
        }

        const nextBtn = document.querySelector('.btn-next');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(this.getFilteredProducts().length / this.itemsPerPage);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.updatePagination();
                    this.renderTable();
                }
            });
        }

        // Select all checkbox
        const selectAllCheckbox = document.querySelector('.checkbox-all');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                this.handleSelectAll(e.target.checked);
            });
        }

        // Add to dropshipping buttons
        this.setupDropshippingButtons();

        // Row checkboxes
        this.setupRowCheckboxes();
    }

    setupDropshippingButtons() {
        const buttons = document.querySelectorAll('.btn--add-dropshipping');
        buttons.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleAddToDropshipping(btn, index);
            });
        });
    }

    setupRowCheckboxes() {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        checkboxes.forEach((checkbox, index) => {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.selectedRows.add(index);
                } else {
                    this.selectedRows.delete(index);
                }
                this.updateSelectAllCheckbox();
            });
        });
    }

    handleCategoryChange(tab) {
        // Remove active class from all tabs
        document.querySelectorAll('.category-tab').forEach(t => {
            t.classList.remove('category-tab--active');
        });
        
        // Add active class to clicked tab
        tab.classList.add('category-tab--active');
        
        // Update current category
        this.currentCategory = tab.textContent.toLowerCase();
        this.currentPage = 1;
        
        // Filter and render
        this.renderTable();
        
        // Visual feedback
        this.showToast(`Filtered by: ${tab.textContent}`);
    }

    handleAddToDropshipping(button, index) {
        if (button.classList.contains('added')) {
            button.classList.remove('added');
            button.textContent = 'Add to Dropshipping';
            this.showToast('Removed from dropshipping list', 'info');
        } else {
            button.classList.add('added');
            button.textContent = '✓ Added';
            
            // Visual feedback
            const row = button.closest('tr');
            row.style.backgroundColor = 'rgba(130, 55, 232, 0.05)';
            setTimeout(() => {
                row.style.backgroundColor = '';
            }, 1000);
            
            this.showToast('Added to dropshipping list successfully!', 'success');
        }
    }

    handleSelectAll(checked) {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        checkboxes.forEach((checkbox, index) => {
            checkbox.checked = checked;
            if (checked) {
                this.selectedRows.add(index);
            } else {
                this.selectedRows.delete(index);
            }
        });
        
        if (checked) {
            this.showToast(`Selected all ${checkboxes.length} items`, 'info');
        }
    }

    updateSelectAllCheckbox() {
        const selectAllCheckbox = document.querySelector('.checkbox-all');
        const checkboxes = document.querySelectorAll('.row-checkbox');
        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
        
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = checkedCount === checkboxes.length && checkboxes.length > 0;
            selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
        }
    }

    performSearch() {
        const searchInput = document.getElementById('market-insight-search-input');
        if (searchInput) {
            this.searchQuery = searchInput.value.toLowerCase();
            this.currentPage = 1;
            this.renderTable();
            this.showToast(`Searching for: "${searchInput.value}"`, 'info');
        }
    }

    getFilteredProducts() {
        let filtered = [...this.products];
        
        // Filter by category
        if (this.currentCategory !== 'all categories') {
            filtered = filtered.filter(p => 
                p.category.toLowerCase() === this.currentCategory
            );
        }
        
        // Filter by search query
        if (this.searchQuery) {
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(this.searchQuery) ||
                p.id.toLowerCase().includes(this.searchQuery) ||
                p.origin.toLowerCase().includes(this.searchQuery) ||
                p.destination.toLowerCase().includes(this.searchQuery)
            );
        }
        
        return filtered;
    }

    renderTable() {
        const tbody = document.querySelector('.market-insights-table tbody');
        if (!tbody) return;
        
        const filtered = this.getFilteredProducts();
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pageData = filtered.slice(start, end);
        
        if (pageData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="table-empty">
                        <div style="padding: 40px;">
                            <h3>No products found</h3>
                            <p>Try adjusting your search or filter criteria</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = pageData.map((product, index) => `
            <tr class="table-row">
                <td>
                    <input type="checkbox" class="row-checkbox" aria-label="Select product" />
                </td>
                <td class="td-product">
                    <div class="product-info">
                        <img src="${product.image}" alt="${product.name}" class="product-thumbnail" />
                        <div class="product-details">
                            <span class="product-id">${product.id}</span>
                            <span class="product-name">${product.name}</span>
                        </div>
                    </div>
                </td>
                <td class="td-origin">
                    <div class="country-flag">
                        <span class="flag">${product.originFlag}</span>
                        <span>${product.origin}</span>
                    </div>
                </td>
                <td class="td-destination">
                    <div class="country-flag">
                        <span class="flag">${product.destinationFlag}</span>
                        <span>${product.destination}</span>
                    </div>
                </td>
                <td class="td-buy-price">$${product.buyPrice.toFixed(2)}</td>
                <td class="td-sell-price">$${product.sellPrice.toFixed(2)}</td>
                <td class="td-profit">
                    <span class="profit-badge profit-badge--${product.profitLevel}">${product.profit}%</span>
                </td>
                <td class="td-action">
                    <button class="btn btn--add-dropshipping">Add to Dropshipping</button>
                </td>
            </tr>
        `).join('');
        
        // Re-setup event listeners for new elements
        this.setupDropshippingButtons();
        this.setupRowCheckboxes();
        this.updatePagination();
    }

    updatePagination() {
        const filtered = this.getFilteredProducts();
        const totalPages = Math.ceil(filtered.length / this.itemsPerPage);
        
        // Update info
        const paginationInfo = document.querySelector('.pagination-info');
        if (paginationInfo) {
            const start = (this.currentPage - 1) * this.itemsPerPage + 1;
            const end = Math.min(this.currentPage * this.itemsPerPage, filtered.length);
            paginationInfo.textContent = `${start} - ${end} of ${filtered.length} Products`;
        }
        
        // Update select
        const pageSelect = document.querySelector('.pagination-select');
        if (pageSelect) {
            pageSelect.innerHTML = '';
            for (let i = 1; i <= totalPages; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                option.selected = i === this.currentPage;
                pageSelect.appendChild(option);
            }
        }
        
        // Update buttons
        const prevBtn = document.querySelector('.btn-prev');
        const nextBtn = document.querySelector('.btn-next');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentPage === totalPages;
        }
    }

    showFilterDialog() {
        // Create a simple filter dialog
        const filterOptions = `
            <div style="padding: 20px;">
                <h3 style="margin-bottom: 16px;">Filter Options</h3>
                <div style="margin-bottom: 12px;">
                    <label style="display: block; margin-bottom: 4px;">Price Range:</label>
                    <input type="range" min="0" max="200" style="width: 100%;" />
                </div>
                <div style="margin-bottom: 12px;">
                    <label style="display: block; margin-bottom: 4px;">Profit Margin:</label>
                    <select style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #E0E0E0;">
                        <option>All</option>
                        <option>High (>100%)</option>
                        <option>Medium (50-100%)</option>
                        <option>Low (<50%)</option>
                    </select>
                </div>
            </div>
        `;
        
        this.showToast('Filter dialog opened (demo)', 'info');
        console.log('Filter functionality - ready for implementation');
    }

    exportData() {
        const filtered = this.getFilteredProducts();
        const csvContent = this.convertToCSV(filtered);
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `market-insights-${Date.now()}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        this.showToast('Exported successfully!', 'success');
    }

    convertToCSV(data) {
        const headers = ['ID', 'Product', 'Origin', 'Destination', 'Buy Price', 'Sell Price', 'Profit %'];
        const rows = data.map(p => [
            p.id,
            p.name,
            p.origin,
            p.destination,
            p.buyPrice,
            p.sellPrice,
            p.profit
        ]);
        
        return [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
    }

    showToast(message, type = 'success') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: ${type === 'success' ? '#04910C' : type === 'info' ? '#8237E8' : '#525866'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            font-family: var(--font-primary);
            font-size: 14px;
            animation: slideInUp 0.3s ease;
            max-width: 320px;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutDown 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    generateMockData(count) {
        const products = [
            { name: 'Beigi Coffe (Navy)', image: 'assets/images/shoe-navy.jpg', category: 'fashion & apparel' },
            { name: 'Story Honzo (Cream)', image: 'assets/images/shoe-cream.jpg', category: 'fashion & apparel' },
            { name: 'Wireless Earbuds Pro', image: 'assets/images/shoe-navy.jpg', category: 'electronics' },
            { name: 'Smart Watch Series 5', image: 'assets/images/shoe-cream.jpg', category: 'electronics' },
            { name: 'Yoga Mat Premium', image: 'assets/images/shoe-navy.jpg', category: 'health & wellness' },
            { name: 'LED Desk Lamp', image: 'assets/images/shoe-cream.jpg', category: 'home & lifestyle' },
            { name: 'Backpack Travel Edition', image: 'assets/images/shoe-navy.jpg', category: 'fashion & apparel' },
            { name: 'Coffee Maker Deluxe', image: 'assets/images/shoe-cream.jpg', category: 'home & lifestyle' },
        ];
        
        const countries = [
            { name: 'China', flag: '🇨🇳' },
            { name: 'Italy', flag: '🇮🇹' },
            { name: 'France', flag: '🇫🇷' },
            { name: 'Germany', flag: '🇩🇪' },
            { name: 'Japan', flag: '🇯🇵' },
        ];
        
        const destinations = [
            { name: 'Qatar', flag: '🇶🇦' },
            { name: 'UAE', flag: '🇦🇪' },
            { name: 'USA', flag: '🇺🇸' },
            { name: 'UK', flag: '🇬🇧' },
            { name: 'Canada', flag: '🇨🇦' },
        ];
        
        const result = [];
        
        for (let i = 0; i < count; i++) {
            const product = products[i % products.length];
            const origin = countries[Math.floor(Math.random() * countries.length)];
            const destination = destinations[Math.floor(Math.random() * destinations.length)];
            const buyPrice = Math.random() * 100 + 20;
            const sellPrice = buyPrice * (1 + Math.random() * 2);
            const profit = Math.round(((sellPrice - buyPrice) / buyPrice) * 100);
            
            let profitLevel = 'low';
            if (profit > 100) profitLevel = 'high';
            else if (profit > 50) profitLevel = 'medium';
            
            result.push({
                id: `0${21230 + i}`,
                name: `${product.name} ${i > 7 ? 'v' + Math.ceil(i/8) : ''}`,
                image: product.image,
                category: product.category,
                origin: origin.name,
                originFlag: origin.flag,
                destination: destination.name,
                destinationFlag: destination.flag,
                buyPrice: parseFloat(buyPrice.toFixed(2)),
                sellPrice: parseFloat(sellPrice.toFixed(2)),
                profit,
                profitLevel
            });
        }
        
        return result;
    }
}

// Add CSS animations for toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100%);
            opacity: 0;
        }
    }
    
    /* Smooth scroll */
    .market-insights-table-wrapper {
        scroll-behavior: smooth;
    }
    
    /* Row hover effect enhancement */
    .table-row {
        transition: all 0.2s ease;
    }
    
    .table-row:hover {
        transform: translateX(2px);
    }
`;
document.head.appendChild(style);

// Initialize the app when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new MarketInsightsApp();
    });
} else {
    new MarketInsightsApp();
}