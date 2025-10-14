// Settings Page JavaScript
class SettingsManager {
    constructor() {
        this.navItems = document.querySelectorAll('.settings-nav-item');
        this.sections = document.querySelectorAll('.settings-section');
        this.profileForm = document.getElementById('profile-form');
        this.preferencesForm = document.getElementById('preferences-form');
        this.securityForm = document.getElementById('security-form');
        this.btnUploadPic = document.getElementById('btn-upload-pic');
        this.btnRemovePic = document.getElementById('btn-remove-pic');
        this.fileUpload = document.getElementById('file-upload');
        this.profilePic = document.getElementById('profile-pic');
        this.btnAddCard = document.getElementById('btn-add-card');
        this.btnSetup2FA = document.getElementById('btn-setup-2fa');
        
        this.init();
    }

    init() {
        // Navigation between sections
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                if (section === 'logout') {
                    this.handleLogout();
                } else {
                    this.switchSection(section);
                }
            });
        });

        // Profile form submission
        if (this.profileForm) {
            this.profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProfile();
            });
        }

        // Preferences form submission
        if (this.preferencesForm) {
            this.preferencesForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.savePreferences();
            });
        }

        // Security form submission
        if (this.securityForm) {
            this.securityForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updatePassword();
            });
        }

        // Profile picture upload
        if (this.btnUploadPic) {
            this.btnUploadPic.addEventListener('click', () => {
                this.fileUpload.click();
            });
        }

        if (this.fileUpload) {
            this.fileUpload.addEventListener('change', (e) => {
                this.handleFileUpload(e);
            });
        }

        // Profile picture remove
        if (this.btnRemovePic) {
            this.btnRemovePic.addEventListener('click', () => {
                this.removeProfilePicture();
            });
        }

        // Add payment card
        if (this.btnAddCard) {
            this.btnAddCard.addEventListener('click', () => {
                this.addPaymentCard();
            });
        }

        // Setup 2FA
        if (this.btnSetup2FA) {
            this.btnSetup2FA.addEventListener('click', () => {
                this.setup2FA();
            });
        }

        // Payment card actions
        this.initPaymentCardActions();
    }

    switchSection(sectionName) {
        // Update navigation
        this.navItems.forEach(item => {
            item.classList.remove('settings-nav-item--active');
            if (item.dataset.section === sectionName) {
                item.classList.add('settings-nav-item--active');
            }
        });

        // Update sections
        this.sections.forEach(section => {
            section.classList.remove('settings-section--active');
            if (section.id === `${sectionName}-section`) {
                section.classList.add('settings-section--active');
            }
        });
    }

    saveProfile() {
        const fullName = document.getElementById('full-name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const company = document.getElementById('company').value;

        // Show loading state
        const btn = this.profileForm.querySelector('.btn--save');
        const originalText = btn.textContent;
        btn.textContent = 'Saving...';
        btn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
            
            this.showNotification('Profile updated successfully!', 'success');
            
            console.log('Profile saved:', {
                fullName,
                email,
                phone,
                company
            });
        }, 1500);
    }

    savePreferences() {
        const language = document.getElementById('language').value;
        const timezone = document.getElementById('timezone').value;
        const currency = document.getElementById('currency').value;
        const dateFormat = document.getElementById('date-format').value;

        const btn = this.preferencesForm.querySelector('.btn--save');
        const originalText = btn.textContent;
        btn.textContent = 'Saving...';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
            
            this.showNotification('Preferences saved successfully!', 'success');
            
            console.log('Preferences saved:', {
                language,
                timezone,
                currency,
                dateFormat
            });
        }, 1500);
    }

    updatePassword() {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showNotification('Please fill in all password fields', 'warning');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showNotification('New passwords do not match', 'warning');
            return;
        }

        if (newPassword.length < 8) {
            this.showNotification('Password must be at least 8 characters', 'warning');
            return;
        }

        const btn = this.securityForm.querySelector('.btn--save');
        const originalText = btn.textContent;
        btn.textContent = 'Updating...';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
            
            // Clear form
            document.getElementById('current-password').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';
            
            this.showNotification('Password updated successfully!', 'success');
        }, 1500);
    }

    handleFileUpload(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                this.profilePic.src = event.target.result;
                this.showNotification('Profile picture uploaded successfully!', 'success');
            };
            reader.readAsDataURL(file);
        } else {
            this.showNotification('Please select a valid image file', 'warning');
        }
    }

    removeProfilePicture() {
        if (confirm('Are you sure you want to remove your profile picture?')) {
            this.profilePic.src = 'assets/images/default-avatar.jpg';
            this.fileUpload.value = '';
            this.showNotification('Profile picture removed', 'success');
        }
    }

    addPaymentCard() {
        this.showNotification('Payment card form would open here', 'info');
        // In a real application, this would open a modal or redirect to payment form
        console.log('Opening payment card form...');
    }

    setup2FA() {
        const checkbox = document.getElementById('enable-2fa');
        
        if (!checkbox.checked) {
            this.showNotification('Please enable 2FA first', 'warning');
            return;
        }

        this.showNotification('2FA setup wizard would open here', 'info');
        console.log('Opening 2FA setup...');
    }

    initPaymentCardActions() {
        const paymentCards = document.querySelectorAll('.payment-card');
        
        paymentCards.forEach(card => {
            const editBtn = card.querySelector('.btn--text:not(.btn--danger)');
            const removeBtn = card.querySelector('.btn--danger');
            
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    const cardTitle = card.querySelector('.payment-card-title').textContent;
                    this.showNotification(`Editing ${cardTitle}`, 'info');
                    console.log('Edit card:', cardTitle);
                });
            }
            
            if (removeBtn) {
                removeBtn.addEventListener('click', () => {
                    const cardTitle = card.querySelector('.payment-card-title').textContent;
                    if (confirm(`Are you sure you want to remove ${cardTitle}?`)) {
                        card.style.animation = 'fadeOut 0.3s ease';
                        setTimeout(() => {
                            card.remove();
                            this.showNotification('Payment method removed', 'success');
                        }, 300);
                    }
                });
            }
        });
    }

    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            this.showNotification('Logging out...', 'info');
            
            setTimeout(() => {
                // Redirect to login or home page
                window.location.hash = 'dashboard';
                this.showNotification('Logged out successfully', 'success');
            }, 1000);
        }
    }

    showNotification(message, type = 'info') {
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
            animation: 'slideInNotif 0.3s ease',
            fontFamily: 'var(--font-primary)',
            fontSize: '14px',
            fontWeight: '500'
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutNotif 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add animations
if (!document.getElementById('settings-animations')) {
    const style = document.createElement('style');
    style.id = 'settings-animations';
    style.textContent = `
        @keyframes slideInNotif {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutNotif {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(-20px);
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize Settings Manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SettingsManager();
});