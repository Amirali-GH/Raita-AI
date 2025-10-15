// settings.js - Enhanced interactive functionality for Settings page

class SettingsManager {
    constructor() {
        this.navItems = null;
        this.sections = null;
        this.profileForm = null;
        this.preferencesForm = null;
        this.securityForm = null;
        this.btnUploadPic = null;
        this.btnRemovePic = null;
        this.fileUpload = null;
        this.profilePic = null;
        this.btnAddCard = null;
        this.btnSetup2FA = null;
        
        // Data storage (simulating backend)
        this.userData = {
            fullName: 'AmirAli Ghadiri',
            email: 'amiralighadiri1383@gmail.com',
            phone: '(+98) 913-375-4366',
            company: '',
            language: 'en',
            timezone: 'utc',
            currency: 'usd',
            dateFormat: 'mdy',
            notifications: {
                orders: true,
                marketing: true,
                reports: false
            }
        };
        
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupElements());
        } else {
            this.setupElements();
        }
    }

    setupElements() {
        // Get elements
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

        // Setup event listeners
        this.setupEventListeners();
        this.loadUserData();
    }

    setupEventListeners() {
        // Navigation between sections
        if (this.navItems) {
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
        }

        // Profile form submission
        if (this.profileForm) {
            this.profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProfile();
            });

            // Real-time validation
            const inputs = this.profileForm.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        }

        // Preferences form submission
        if (this.preferencesForm) {
            this.preferencesForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.savePreferences();
            });

            // Live preview of preferences
            const selects = this.preferencesForm.querySelectorAll('select');
            selects.forEach(select => {
                select.addEventListener('change', () => {
                    this.showToast(`Preview: ${select.options[select.selectedIndex].text}`, 'info');
                });
            });

            // Notification checkboxes
            const checkboxes = this.preferencesForm.querySelectorAll('.form-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    this.updateNotificationPreference(e.target);
                });
            });
        }

        // Security form submission
        if (this.securityForm) {
            this.securityForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updatePassword();
            });

            // Password strength indicator
            const newPassword = document.getElementById('new-password');
            if (newPassword) {
                newPassword.addEventListener('input', (e) => {
                    this.showPasswordStrength(e.target.value);
                });
            }

            // Real-time password match validation
            const confirmPassword = document.getElementById('confirm-password');
            if (confirmPassword && newPassword) {
                confirmPassword.addEventListener('input', () => {
                    this.validatePasswordMatch(newPassword.value, confirmPassword.value);
                });
            }
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
                this.showAddCardDialog();
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

        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
    }

    loadUserData() {
        // Load profile data
        const fullNameInput = document.getElementById('full-name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const companyInput = document.getElementById('company');

        if (fullNameInput) fullNameInput.value = this.userData.fullName;
        if (emailInput) emailInput.value = this.userData.email;
        if (phoneInput) phoneInput.value = this.userData.phone;
        if (companyInput) companyInput.value = this.userData.company;

        // Load preferences
        const languageSelect = document.getElementById('language');
        const timezoneSelect = document.getElementById('timezone');
        const currencySelect = document.getElementById('currency');
        const dateFormatSelect = document.getElementById('date-format');

        if (languageSelect) languageSelect.value = this.userData.language;
        if (timezoneSelect) timezoneSelect.value = this.userData.timezone;
        if (currencySelect) currencySelect.value = this.userData.currency;
        if (dateFormatSelect) dateFormatSelect.value = this.userData.dateFormat;

        // Load notification preferences
        const notifyOrders = document.getElementById('notify-orders');
        const notifyMarketing = document.getElementById('notify-marketing');
        const notifyReports = document.getElementById('notify-reports');

        if (notifyOrders) notifyOrders.checked = this.userData.notifications.orders;
        if (notifyMarketing) notifyMarketing.checked = this.userData.notifications.marketing;
        if (notifyReports) notifyReports.checked = this.userData.notifications.reports;
    }

    switchSection(sectionName) {
        // Update navigation with animation
        this.navItems.forEach(item => {
            item.classList.remove('settings-nav-item--active');
            if (item.dataset.section === sectionName) {
                item.classList.add('settings-nav-item--active');
            }
        });

        // Update sections with fade animation
        this.sections.forEach(section => {
            section.classList.remove('settings-section--active');
            if (section.id === `${sectionName}-section`) {
                section.classList.add('settings-section--active');
            }
        });

        // Scroll to top on mobile
        if (window.innerWidth < 768) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Analytics tracking (demo)
        console.log(`Section changed to: ${sectionName}`);
    }

    validateField(input) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (input.id) {
            case 'full-name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'phone':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(input, errorMessage);
        } else {
            this.clearFieldError(input);
        }

        return isValid;
    }

    showFieldError(input, message) {
        input.style.borderColor = 'var(--danger)';
        
        // Remove existing error message
        const existingError = input.parentElement.querySelector('.field-error');
        if (existingError) existingError.remove();
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: var(--danger);
            font-size: 12px;
            margin-top: 4px;
            animation: fadeIn 0.2s ease;
        `;
        input.parentElement.appendChild(errorDiv);
    }

    clearFieldError(input) {
        input.style.borderColor = '';
        const errorDiv = input.parentElement.querySelector('.field-error');
        if (errorDiv) errorDiv.remove();
    }

    saveProfile() {
        const fullName = document.getElementById('full-name');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const company = document.getElementById('company');

        // Validate all fields
        const isValid = [fullName, email, phone].every(input => this.validateField(input));
        
        if (!isValid) {
            this.showToast('Please fix the errors before saving', 'warning');
            return;
        }

        // Update user data
        this.userData.fullName = fullName.value;
        this.userData.email = email.value;
        this.userData.phone = phone.value;
        this.userData.company = company.value;

        // Show loading state
        const btn = this.profileForm.querySelector('.btn--save');
        const originalText = btn.textContent;
        btn.innerHTML = '<span class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></span> Saving...';
        btn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
            
            this.showToast('Profile updated successfully!', 'success');
            this.updateSidebarProfile();
            
            console.log('Profile saved:', this.userData);
        }, 1500);
    }

    updateSidebarProfile() {
        // Update profile info in sidebar if exists
        const sidebarName = document.querySelector('.profile__name');
        const sidebarEmail = document.querySelector('.profile__email');
        
        if (sidebarName) sidebarName.textContent = this.userData.fullName;
        if (sidebarEmail) sidebarEmail.textContent = this.userData.email;
    }

    savePreferences() {
        const language = document.getElementById('language').value;
        const timezone = document.getElementById('timezone').value;
        const currency = document.getElementById('currency').value;
        const dateFormat = document.getElementById('date-format').value;

        // Update user data
        this.userData.language = language;
        this.userData.timezone = timezone;
        this.userData.currency = currency;
        this.userData.dateFormat = dateFormat;

        const btn = this.preferencesForm.querySelector('.btn--save');
        const originalText = btn.textContent;
        btn.innerHTML = '<span class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></span> Saving...';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
            
            this.showToast('Preferences saved successfully!', 'success');
            
            console.log('Preferences saved:', {
                language,
                timezone,
                currency,
                dateFormat,
                notifications: this.userData.notifications
            });
        }, 1500);
    }

    updateNotificationPreference(checkbox) {
        const notificationType = checkbox.id.replace('notify-', '');
        this.userData.notifications[notificationType] = checkbox.checked;
        
        const status = checkbox.checked ? 'enabled' : 'disabled';
        this.showToast(`${notificationType.charAt(0).toUpperCase() + notificationType.slice(1)} notifications ${status}`, 'info');
    }

    updatePassword() {
        const currentPassword = document.getElementById('current-password');
        const newPassword = document.getElementById('new-password');
        const confirmPassword = document.getElementById('confirm-password');

        // Validation
        if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
            this.showToast('Please fill in all password fields', 'warning');
            return;
        }

        if (newPassword.value !== confirmPassword.value) {
            this.showToast('New passwords do not match', 'warning');
            this.showFieldError(confirmPassword, 'Passwords do not match');
            return;
        }

        if (newPassword.value.length < 8) {
            this.showToast('Password must be at least 8 characters', 'warning');
            this.showFieldError(newPassword, 'Password too short');
            return;
        }

        const strength = this.calculatePasswordStrength(newPassword.value);
        if (strength < 50) {
            this.showToast('Please use a stronger password', 'warning');
            return;
        }

        const btn = this.securityForm.querySelector('.btn--save');
        const originalText = btn.textContent;
        btn.innerHTML = '<span class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></span> Updating...';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
            
            // Clear form
            currentPassword.value = '';
            newPassword.value = '';
            confirmPassword.value = '';
            
            // Remove strength indicator
            const strengthIndicator = document.querySelector('.password-strength');
            if (strengthIndicator) strengthIndicator.remove();
            
            this.showToast('Password updated successfully!', 'success');
        }, 1500);
    }

    calculatePasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength += 25;
        if (password.length >= 12) strength += 25;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20;
        if (/\d/.test(password)) strength += 15;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 15;
        
        return strength;
    }

    showPasswordStrength(password) {
        if (!password) {
            const existingIndicator = document.querySelector('.password-strength');
            if (existingIndicator) existingIndicator.remove();
            return;
        }

        const strength = this.calculatePasswordStrength(password);
        let strengthText = 'Weak';
        let strengthColor = '#ED544E';
        
        if (strength >= 75) {
            strengthText = 'Strong';
            strengthColor = '#04910C';
        } else if (strength >= 50) {
            strengthText = 'Medium';
            strengthColor = '#FFA500';
        }

        const newPasswordInput = document.getElementById('new-password');
        let indicator = newPasswordInput.parentElement.querySelector('.password-strength');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'password-strength';
            newPasswordInput.parentElement.appendChild(indicator);
        }

        indicator.innerHTML = `
            <div style="margin-top: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <span style="font-size: 12px; color: var(--muted);">Password Strength:</span>
                    <span style="font-size: 12px; font-weight: 600; color: ${strengthColor};">${strengthText}</span>
                </div>
                <div style="width: 100%; height: 4px; background: var(--border-light); border-radius: 2px; overflow: hidden;">
                    <div style="width: ${strength}%; height: 100%; background: ${strengthColor}; transition: all 0.3s ease;"></div>
                </div>
            </div>
        `;
    }

    validatePasswordMatch(password, confirm) {
        const confirmInput = document.getElementById('confirm-password');
        
        if (confirm && password !== confirm) {
            this.showFieldError(confirmInput, 'Passwords do not match');
        } else if (confirm) {
            this.clearFieldError(confirmInput);
        }
    }

    handleFileUpload(e) {
        const file = e.target.files[0];
        
        if (!file) return;
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showToast('Please select a valid image file', 'warning');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showToast('Image size must be less than 5MB', 'warning');
            return;
        }

        // Show loading state
        const btn = this.btnUploadPic;
        const originalText = btn.textContent;
        btn.textContent = 'Uploading...';
        btn.disabled = true;

        const reader = new FileReader();
        reader.onload = (event) => {
            setTimeout(() => {
                this.profilePic.src = event.target.result;
                btn.textContent = originalText;
                btn.disabled = false;
                
                // Update sidebar avatar
                const sidebarAvatar = document.querySelector('.profile__avatar');
                if (sidebarAvatar) sidebarAvatar.src = event.target.result;
                
                this.showToast('Profile picture uploaded successfully!', 'success');
            }, 1000);
        };
        reader.readAsDataURL(file);
    }

    removeProfilePicture() {
        this.showConfirmDialog(
            'Remove Profile Picture',
            'Are you sure you want to remove your profile picture?',
            () => {
                this.profilePic.src = 'assets/images/default-avatar.jpg';
                this.fileUpload.value = '';
                
                const sidebarAvatar = document.querySelector('.profile__avatar');
                if (sidebarAvatar) sidebarAvatar.src = 'assets/images/default-avatar.jpg';
                
                this.showToast('Profile picture removed', 'success');
            }
        );
    }

    showAddCardDialog() {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.2s ease;
        `;

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'card-modal';
        modal.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 24px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            animation: slideUp 0.3s ease;
        `;

        modal.innerHTML = `
            <h3 style="margin: 0 0 20px 0; color: var(--text);">Add Payment Method</h3>
            <form id="add-card-form">
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; font-size: 14px; color: var(--text);">Card Number</label>
                    <input type="text" placeholder="1234 5678 9012 3456" maxlength="19" style="width: 100%; padding: 12px; border: 1px solid var(--border-light); border-radius: 8px; font-size: 14px;" />
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; font-size: 14px; color: var(--text);">Expiry Date</label>
                        <input type="text" placeholder="MM/YY" maxlength="5" style="width: 100%; padding: 12px; border: 1px solid var(--border-light); border-radius: 8px; font-size: 14px;" />
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; font-size: 14px; color: var(--text);">CVV</label>
                        <input type="text" placeholder="123" maxlength="3" style="width: 100%; padding: 12px; border: 1px solid var(--border-light); border-radius: 8px; font-size: 14px;" />
                    </div>
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; font-size: 14px; color: var(--text);">Cardholder Name</label>
                    <input type="text" placeholder="John Doe" style="width: 100%; padding: 12px; border: 1px solid var(--border-light); border-radius: 8px; font-size: 14px;" />
                </div>
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button type="button" class="btn--secondary" id="cancel-card-btn" style="padding: 10px 20px;">Cancel</button>
                    <button type="submit" class="btn--primary" style="padding: 10px 20px;">Add Card</button>
                </div>
            </form>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Event listeners
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        const cancelBtn = modal.querySelector('#cancel-card-btn');
        cancelBtn.addEventListener('click', () => overlay.remove());

        const form = modal.querySelector('#add-card-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            overlay.remove();
            this.addPaymentCard();
        });
    }

    addPaymentCard() {
        const cardsList = document.querySelector('.payment-cards-list');
        
        const newCard = document.createElement('div');
        newCard.className = 'payment-card';
        newCard.style.animation = 'slideInCard 0.3s ease';
        newCard.innerHTML = `
            <div class="payment-card-icon">
                <svg width="48" height="32" viewBox="0 0 48 32" fill="none">
                    <rect width="48" height="32" rx="4" fill="#0066B2" />
                    <path d="M20 10H18L16 22H18L20 10Z" fill="white" />
                    <path d="M30 10L28 22H30L32 10H30Z" fill="white" />
                </svg>
            </div>
            <div class="payment-card-info">
                <h4 class="payment-card-title">Visa ending in 1234</h4>
                <p class="payment-card-subtitle">Expires 12/2026</p>
            </div>
            <div class="payment-card-actions">
                <button class="btn--text">Edit</button>
                <button class="btn--text btn--danger">Remove</button>
            </div>
        `;
        
        cardsList.appendChild(newCard);
        this.initPaymentCardActions();
        this.showToast('Payment card added successfully!', 'success');
    }

    setup2FA() {
        const checkbox = document.getElementById('enable-2fa');
        
        if (!checkbox.checked) {
            this.showToast('Please enable 2FA first', 'warning');
            checkbox.focus();
            return;
        }

        // Show 2FA setup modal
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.2s ease;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 32px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            animation: slideUp 0.3s ease;
        `;

        modal.innerHTML = `
            <h3 style="margin: 0 0 16px 0; color: var(--text);">Setup Two-Factor Authentication</h3>
            <p style="color: var(--muted); margin-bottom: 24px; font-size: 14px;">Scan this QR code with your authenticator app</p>
            <div style="width: 200px; height: 200px; background: var(--surface); margin: 0 auto 24px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <svg width="160" height="160" viewBox="0 0 100 100" fill="none">
                    <rect width="100" height="100" fill="white"/>
                    <rect x="10" y="10" width="30" height="30" fill="black"/>
                    <rect x="60" y="10" width="30" height="30" fill="black"/>
                    <rect x="10" y="60" width="30" height="30" fill="black"/>
                    <rect x="50" y="50" width="10" height="10" fill="black"/>
                </svg>
            </div>
            <p style="color: var(--muted); font-size: 13px; margin-bottom: 8px;">Or enter this code manually:</p>
            <code style="background: var(--surface); padding: 8px 16px; border-radius: 6px; font-family: monospace; display: inline-block; margin-bottom: 24px;">ABCD EFGH IJKL MNOP</code>
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button class="btn--secondary" style="padding: 10px 20px;">Cancel</button>
                <button class="btn--primary" style="padding: 10px 20px;">Verify & Enable</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        const cancelBtn = modal.querySelector('.btn--secondary');
        const verifyBtn = modal.querySelector('.btn--primary');

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        cancelBtn.addEventListener('click', () => overlay.remove());
        
        verifyBtn.addEventListener('click', () => {
            overlay.remove();
            this.showToast('2FA enabled successfully!', 'success');
        });
    }

    initPaymentCardActions() {
        const paymentCards = document.querySelectorAll('.payment-card');
        
        paymentCards.forEach(card => {
            const editBtn = card.querySelector('.btn--text:not(.btn--danger)');
            const removeBtn = card.querySelector('.btn--danger');
            
            if (editBtn && !editBtn.hasAttribute('data-listener')) {
                editBtn.setAttribute('data-listener', 'true');
                editBtn.addEventListener('click', () => {
                    const cardTitle = card.querySelector('.payment-card-title').textContent;
                    this.showToast(`Editing ${cardTitle}`, 'info');
                });
            }
            
            if (removeBtn && !removeBtn.hasAttribute('data-listener')) {
                removeBtn.setAttribute('data-listener', 'true');
                removeBtn.addEventListener('click', () => {
                    const cardTitle = card.querySelector('.payment-card-title').textContent;
                    this.showConfirmDialog(
                        'Remove Payment Method',
                        `Are you sure you want to remove ${cardTitle}?`,
                        () => {
                            card.style.animation = 'fadeOut 0.3s ease';
                            setTimeout(() => {
                                card.remove();
                                this.showToast('Payment method removed', 'success');
                            }, 300);
                        }
                    );
                });
            }
        });
    }

    handleLogout() {
        this.showConfirmDialog(
            'Logout',
            'Are you sure you want to logout?',
            () => {
                this.showToast('Logging out...', 'info');
                
                setTimeout(() => {
                    window.location.hash = 'dashboard';
                    this.showToast('Logged out successfully', 'success');
                }, 1000);
            }
        );
    }

    showConfirmDialog(title, message, onConfirm) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.2s ease;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 24px;
            max-width: 400px;
            width: 90%;
            animation: slideUp 0.3s ease;
        `;

        modal.innerHTML = `
            <h3 style="margin: 0 0 12px 0; color: var(--text);">${title}</h3>
            <p style="color: var(--muted); margin-bottom: 24px; font-size: 14px;">${message}</p>
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                <button class="btn--secondary" style="padding: 10px 20px;">Cancel</button>
                <button class="btn--primary" style="padding: 10px 20px; background: var(--danger);">Confirm</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        const cancelBtn = modal.querySelector('.btn--secondary');
        const confirmBtn = modal.querySelector('.btn--primary');

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        cancelBtn.addEventListener('click', () => overlay.remove());
        
        confirmBtn.addEventListener('click', () => {
            overlay.remove();
            if (onConfirm) onConfirm();
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S to save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                const activeSection = document.querySelector('.settings-section--active');
                if (activeSection) {
                    const saveBtn = activeSection.querySelector('.btn--save');
                    if (saveBtn) saveBtn.click();
                }
            }

            // Escape to close modals
            if (e.key === 'Escape') {
                const modal = document.querySelector('.modal-overlay');
                if (modal) modal.remove();
            }
        });
    }

    showToast(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();

        const colors = {
            success: '#04910C',
            warning: '#FFA500',
            info: '#8237E8',
            error: '#ED544E'
        };

        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        
        // Adjust position for mobile
        const isMobile = window.innerWidth < 768;
        const position = isMobile ? 'bottom: 80px; left: 50%; transform: translateX(-50%); right: auto;' : 'bottom: 24px; right: 24px;';
        
        toast.style.cssText = `
            position: fixed;
            ${position}
            background: ${colors[type] || colors.info};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            font-family: var(--font-primary);
            font-size: 14px;
            font-weight: 500;
            animation: slideInUp 0.3s ease;
            max-width: ${isMobile ? '90%' : '320px'};
            text-align: center;
        `;
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutDown 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Add CSS animations
if (!document.getElementById('settings-animations')) {
    const style = document.createElement('style');
    style.id = 'settings-animations';
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
        
        @keyframes slideUp {
            from {
                transform: translateY(50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes slideInCard {
            from {
                transform: translateX(-20px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize Settings Manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SettingsManager();
    });
} else {
    new SettingsManager();
}