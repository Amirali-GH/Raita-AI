// Marketing Page JavaScript
class MarketingHub {
    constructor() {
        this.targetMarket = document.getElementById('target-market');
        this.btnCloseStudio = document.querySelector('.btn-close-studio');
        this.aiContentStudio = document.querySelector('.ai-content-studio');
        this.btnGenerate = document.querySelector('.btn-generate-ai');
        this.aiStudioInput = document.querySelector('.ai-studio-input');
        
        this.init();
    }

    init() {
        // Target market change
        if (this.targetMarket) {
            this.targetMarket.addEventListener('change', (e) => {
                this.updatePlatformContent(e.target.value);
            });
        }

        // Close AI Studio
        if (this.btnCloseStudio) {
            this.btnCloseStudio.addEventListener('click', () => {
                this.toggleAIStudio();
            });
        }

        // Generate AI content
        if (this.btnGenerate) {
            this.btnGenerate.addEventListener('click', () => {
                this.generateContent();
            });
        }

        // View Seller Guide buttons
        this.initGuideButtons();

        // Export buttons
        this.initExportButtons();
    }

    updatePlatformContent(market) {
        console.log('Updating content for market:', market);
        
        // Here you would update the platform recommendations
        // based on the selected target market
        const platformCards = document.querySelectorAll('.platform-card');
        
        platformCards.forEach(card => {
            card.style.opacity = '0.5';
            setTimeout(() => {
                card.style.opacity = '1';
            }, 300);
        });

        // Show notification
        this.showNotification(`Updated recommendations for ${this.getMarketName(market)}`);
    }

    getMarketName(value) {
        const markets = {
            'uae': 'United Arab Emirates',
            'qatar': 'Qatar',
            'saudi': 'Saudi Arabia',
            'egypt': 'Egypt'
        };
        return markets[value] || value;
    }

    toggleAIStudio() {
        if (this.aiContentStudio) {
            this.aiContentStudio.style.display = 
                this.aiContentStudio.style.display === 'none' ? 'block' : 'none';
        }
    }

    generateContent() {
        if (!this.aiStudioInput || !this.btnGenerate) return;

        const prompt = this.aiStudioInput.value.trim();
        
        if (!prompt) {
            this.showNotification('Please enter a message to generate content', 'warning');
            return;
        }

        // Show loading state
        const originalText = this.btnGenerate.textContent;
        this.btnGenerate.textContent = 'Generating...';
        this.btnGenerate.disabled = true;

        // Simulate AI generation
        setTimeout(() => {
            this.updateInstagramPost(prompt);
            this.btnGenerate.textContent = originalText;
            this.btnGenerate.disabled = false;
            this.aiStudioInput.value = '';
            this.showNotification('New content generated successfully!');
        }, 2000);
    }

    updateInstagramPost(prompt) {
        const caption = document.querySelector('.instagram-post-caption p');
        if (caption) {
            // Simple caption generation based on prompt
            const newCaption = `✨ ${prompt}\n\nDiscover amazing products and deals! 🛍️\nShop now and transform your lifestyle! 💫\n\n#Shopping #Deals #MiddleEast`;
            caption.textContent = newCaption;
        }
    }

    initGuideButtons() {
        const guideButtons = document.querySelectorAll('.btn--view-guide');
        
        guideButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.platform-card');
                const platformName = card.querySelector('.platform-card__title').textContent;
                
                this.showSellerGuide(platformName);
            });
        });
    }

    showSellerGuide(platformName) {
        // Here you would open a modal or navigate to seller guide
        this.showNotification(`Opening seller guide for ${platformName}...`);
        console.log('Show guide for:', platformName);
    }

    initExportButtons() {
        const exportButtons = document.querySelectorAll('.btn--export');
        
        exportButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const format = btn.textContent.includes('Excel') ? 'Excel' : 'PDF';
                this.exportData(format);
            });
        });
    }

    exportData(format) {
        this.showNotification(`Exporting data as ${format}...`);
        
        // Simulate export process
        setTimeout(() => {
            this.showNotification(`${format} file downloaded successfully!`, 'success');
        }, 1500);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        // Style notification
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
            animation: 'slideIn 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
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

// Initialize Marketing Hub when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new MarketingHub();
});