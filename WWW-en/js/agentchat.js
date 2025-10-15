// Agent Chat Page JavaScript
// Check if AgentChat is already defined to prevent redeclaration
if (typeof AgentChat === 'undefined') {
    class AgentChat {
        constructor() {
            this.chatMessages = document.getElementById('chat-messages');
            this.chatInput = document.getElementById('chat-input');
            this.btnSend = document.getElementById('btn-send');
            this.btnNewChat = document.getElementById('btn-new-chat');
            this.sidebarToggle = document.getElementById('chat-sidebar-toggle');
            this.btnCloseSidebar = document.getElementById('btn-close-sidebar');
            this.sidebar = document.querySelector('.chat-sidebar');
            this.sidebarOverlay = document.getElementById('chat-sidebar-overlay');
            
            this.init();
        }

        init() {
            // Send message on button click
            if (this.btnSend) {
                this.btnSend.addEventListener('click', () => this.sendMessage());
            }

            // Send message on Enter key
            if (this.chatInput) {
                this.chatInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        this.sendMessage();
                    }
                });
            }

            // New chat button
            if (this.btnNewChat) {
                this.btnNewChat.addEventListener('click', () => this.createNewChat());
            }

            // Sidebar toggle for mobile
            if (this.sidebarToggle) {
                this.sidebarToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleSidebar();
                });
            }

            // Close sidebar button
            if (this.btnCloseSidebar) {
                this.btnCloseSidebar.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.closeSidebar();
                });
            }

            // Close sidebar on overlay click
            if (this.sidebarOverlay) {
                this.sidebarOverlay.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.closeSidebar();
                });
            }

            // Close sidebar on ESC key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.sidebar && this.sidebar.classList.contains('chat-sidebar--open')) {
                    this.closeSidebar();
                }
            });

            // Chat history items
            this.initChatHistory();

            // Auto scroll to bottom on load
            this.scrollToBottom();

            // Handle window resize
            window.addEventListener('resize', () => this.handleResize());
        }

        toggleSidebar() {
            if (this.sidebar && this.sidebarOverlay && this.sidebarToggle) {
                const isOpen = this.sidebar.classList.contains('chat-sidebar--open');
                
                if (isOpen) {
                    this.closeSidebar();
                } else {
                    this.openSidebar();
                }
            }
        }

        openSidebar() {
            if (this.sidebar && this.sidebarOverlay && this.sidebarToggle) {
                this.sidebar.classList.add('chat-sidebar--open');
                this.sidebarOverlay.classList.add('chat-sidebar-overlay--visible');
                this.sidebarToggle.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
            }
        }

        closeSidebar() {
            if (this.sidebar && this.sidebarOverlay && this.sidebarToggle) {
                this.sidebar.classList.remove('chat-sidebar--open');
                this.sidebarOverlay.classList.remove('chat-sidebar-overlay--visible');
                this.sidebarToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        }

        handleResize() {
            // Close sidebar on desktop view
            if (window.innerWidth > 1024 && this.sidebar) {
                this.closeSidebar();
            }
        }

        sendMessage() {
            const message = this.chatInput.value.trim();
            
            if (!message) return;

            // Add user message
            this.addUserMessage(message);

            // Clear input
            this.chatInput.value = '';

            // Simulate AI response after delay
            setTimeout(() => {
                this.addAIResponse(message);
            }, 1000);
        }

        addUserMessage(message) {
            const messageEl = document.createElement('div');
            messageEl.className = 'chat-message chat-message--user';
            messageEl.innerHTML = `
                <div class="message-content">
                    <p>${this.escapeHtml(message)}</p>
                </div>
            `;
            
            this.chatMessages.appendChild(messageEl);
            this.scrollToBottom();
        }

        addAIResponse(userMessage) {
            const messageEl = document.createElement('div');
            messageEl.className = 'chat-message chat-message--ai';
            
            // Simple response logic based on keywords
            let response = this.generateResponse(userMessage);
            
            messageEl.innerHTML = `
                <div class="message-avatar">
                    <img src="assets/images/favicon.ico" alt="AI" />
                </div>
                <div class="message-content">
                    <h4 class="message-title">${response.title}</h4>
                    <p class="message-text">${response.text}</p>
                </div>
            `;
            
            this.chatMessages.appendChild(messageEl);
            this.scrollToBottom();
        }

        generateResponse(message) {
            const lowerMessage = message.toLowerCase();
            
            if (lowerMessage.includes('product') || lowerMessage.includes('supplier')) {
                return {
                    title: 'Product Search Results',
                    text: 'I found several relevant suppliers and products matching your criteria. Let me show you the top options with competitive pricing and reliable shipping.'
                };
            } else if (lowerMessage.includes('market') || lowerMessage.includes('trend')) {
                return {
                    title: 'Market Analysis',
                    text: 'Based on current market trends, I can provide insights into consumer behavior, pricing strategies, and emerging opportunities in your target region.'
                };
            } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
                return {
                    title: 'Pricing Information',
                    text: 'I\'ve analyzed the pricing data across multiple suppliers. Here\'s a breakdown of costs including shipping, taxes, and potential profit margins.'
                };
            } else {
                return {
                    title: 'AI Response',
                    text: 'I understand your query. Let me help you find the best solution for your business needs. Could you provide more specific details?'
                };
            }
        }

        createNewChat() {
            if (confirm('Start a new chat? Current conversation will be saved to history.')) {
                // Clear current messages (keep first demo message)
                const demoMessages = this.chatMessages.querySelectorAll('.chat-message');
                if (demoMessages.length > 2) {
                    const messagesToRemove = Array.from(demoMessages).slice(2);
                    messagesToRemove.forEach(msg => msg.remove());
                }
                
                this.chatInput.value = '';
                this.chatInput.focus();
            }
        }

        initChatHistory() {
            const historyItems = document.querySelectorAll('.chat-history-item');
            
            historyItems.forEach(item => {
                item.addEventListener('click', () => {
                    // Remove active class from all items
                    historyItems.forEach(i => i.classList.remove('chat-history-item--active'));
                    
                    // Add active class to clicked item
                    item.classList.add('chat-history-item--active');
                    
                    // Close sidebar on mobile after selection
                    if (window.innerWidth <= 1024) {
                        this.closeSidebar();
                    }
                });
            });
        }

        scrollToBottom() {
            if (this.chatMessages) {
                setTimeout(() => {
                    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
                }, 100);
            }
        }

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    }

    // Make AgentChat available globally
    window.AgentChat = AgentChat;
}

// Initialize Agent Chat when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('chat-messages')) {
            new window.AgentChat();
        }
    });
} else {
    if (document.getElementById('chat-messages')) {
        new window.AgentChat();
    }
}