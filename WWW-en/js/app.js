class RaitaApp {
    constructor() {
        this.content = null;
        this.pageTitle = null;
        this.sidebar = null;
        this.menuToggle = null;
        this.overlay = null;
        this.mainContainer = null;
        
        this.routes = {
            dashboard: "./html/dashboard.html",
            chat: "./html/agentchat.html",
            marketinsight: "./html/marketinsight.html",
            reports: "./html/reports.html",
            dropshipping: "./html/dropshipping.html",
            marketing: "./html/marketing.html",
            settings: "./html/settings.html",
        };
        
        // منتظر بمان تا DOM کاملاً لود شود
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        
        // گرفتن المنت‌ها
        this.content = document.getElementById("app-content");
        this.pageTitle = document.querySelector('.topbar__title h2');
        this.sidebar = document.querySelector('.sidebar');
        this.menuToggle = document.querySelector('.topbar__menu-toggle');
        this.mainContainer = document.querySelector('.main');
        
        // چک کردن المنت‌ها
        if (!this.sidebar) {
            console.error('Sidebar element not found!');
            return;
        }
        
        if (!this.menuToggle) {
            console.error('Menu toggle button not found!');
            return;
        }
        
        // ساخت overlay
        this.createOverlay();
        
        // تنظیم event listeners
        this.setupEventListeners();
        
        // لود صفحه اولیه
        this.loadPage();
    }

    createOverlay() {
        this.overlay = document.querySelector('.overlay');
        if (!this.overlay) {
            this.overlay = document.createElement('div');
            this.overlay.className = 'overlay';
            document.body.appendChild(this.overlay);
        }
    }

    setupEventListeners() {
        // کلیک روی دکمه همبرگر منو
        this.menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleSidebar();
        });
        
        // کلیک روی overlay
        this.overlay.addEventListener('click', () => {
            this.closeSidebar();
        });
        
        // کلیک روی لینک‌های sidebar
        document.addEventListener('click', (e) => {
            const link = e.target.closest('.sidebar__link');
            if (link) {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    window.location.hash = href.substring(1);
                    // بستن sidebar در موبایل
                    if (window.innerWidth < 768) {
                        this.closeSidebar();
                    }
                }
            }
        });
        
        // Hash change
        window.addEventListener('hashchange', () => {
            this.loadPage();
        });
        
        // ESC key برای بستن sidebar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSidebar();
            }
        });
        
        // Resize window
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    toggleSidebar() {
        const isOpen = this.sidebar.classList.contains('sidebar--open');
    
        if (isOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    openSidebar() {
        this.sidebar.classList.add('sidebar--open');
        this.menuToggle.setAttribute('aria-expanded', 'true');
        
        // در موبایل overlay نمایش بده
        if (window.innerWidth < 768) {
            this.overlay.classList.add('overlay--visible');
            document.body.style.overflow = 'hidden';
        } else {
            // در دسکتاپ main را جابجا کن
            this.mainContainer.classList.add('sidebar-open');
        }
    }

    closeSidebar() {
        this.sidebar.classList.remove('sidebar--open');
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.overlay.classList.remove('overlay--visible');
        this.mainContainer.classList.remove('sidebar-open');
        document.body.style.overflow = '';
    }

    handleResize() {
        const isOpen = this.sidebar.classList.contains('sidebar--open');
        
        if (window.innerWidth >= 768) {
            // دسکتاپ: حذف overlay
            this.overlay.classList.remove('overlay--visible');
            document.body.style.overflow = '';
            
            if (isOpen) {
                this.mainContainer.classList.add('sidebar-open');
            }
        } else {
            // موبایل: حذف کلاس sidebar-open از main
            this.mainContainer.classList.remove('sidebar-open');
            
            if (isOpen) {
                this.overlay.classList.add('overlay--visible');
                document.body.style.overflow = 'hidden';
            }
        }
    }

    async loadPage() {
        const hash = window.location.hash.replace("#", "") || "dashboard";
        const url = this.routes[hash] || this.routes["dashboard"];

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const htmlText = await response.text();

            // پاک کردن محتوای قبلی
            this.content.innerHTML = '';

            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, "text/html");
            
            // گرفتن محتوای body
            const bodyContent = doc.body.innerHTML;

            // قرار دادن محتوا در container
            this.content.innerHTML = bodyContent;

            // به روزرسانی عنوان صفحه
            const pageTitle = doc.querySelector("title")?.textContent || this.capitalize(hash);
            if (this.pageTitle) {
                this.pageTitle.textContent = pageTitle;
            }
            document.title = `Raita AI – ${pageTitle}`;

            this.updateActiveLink(hash);

            // لود اسکریپت‌های مربوطه بعد از لود محتوا
            this.loadPageScripts(hash);

        } catch (err) {
            console.error("Error loading page:", err);
            this.content.innerHTML = `
                <div style="padding: 40px; text-align: center;">
                    <h2 style="color: var(--danger);">⚠️ خطا در بارگذاری صفحه</h2>
                    <p style="color: var(--muted);">${err.message}</p>
                    <p style="color: var(--muted); font-size: 14px; margin-top: 10px;">URL: ${url}</p>
                    <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: var(--accent); color: white; border: none; border-radius: 8px; cursor: pointer;">
                        تلاش مجدد
                    </button>
                </div>
            `;
        }
    }

    // تابع جدید برای لود اسکریپت‌های مربوط به هر صفحه
    loadPageScripts(page) {
        // حذف اسکریپت‌های قبلی اگر نیاز باشد
        const existingScripts = document.querySelectorAll('script[data-dynamic]');
        existingScripts.forEach(script => script.remove());

        // لود اسکریپت مربوط به صفحه
        const scriptMap = {
            'chat': './js/agentchat.js',
            'dropshipping': './js/dropshipping.js',
            'marketing': './js/marketing.js',
            'reports': './js/reports.js',
            'settings': './js/settings.js'
        };

        if (scriptMap[page]) {
            const script = document.createElement('script');
            script.src = scriptMap[page];
            script.setAttribute('data-dynamic', 'true');
            script.onerror = () => console.error(`Failed to load script: ${scriptMap[page]}`);
            document.body.appendChild(script);
        }
    }

    handleExportButtons(hash) {
        const exportExcel = document.getElementById('Button-Export-As-Excel');
        const exportPDF = document.getElementById('Button-Export-As-PDF');
        const helpBtn = document.getElementById('Button-Help');
        const downloadBtn = document.getElementById('Button-Download"');
        const shareBtn = document.getElementById('Button-Share');
        const moreOptionBtn = document.getElementById('Button-More-Options');

        if (hash === 'marketing') {
            exportExcel?.classList.remove('hidden');
            exportPDF?.classList.remove('hidden');
            helpBtn?.classList.remove('hidden');
        } else {
            exportExcel?.classList.add('hidden');
            exportPDF?.classList.add('hidden');
            helpBtn?.classList.add('hidden');
        }

        if(hash === "chat"){
            downloadBtn?.classList.remove('hidden');
            shareBtn?.classList.remove('hidden');
            moreOptionBtn?.classList.remove('hidden');
        } else {
            downloadBtn?.classList.add('hidden');
            shareBtn?.classList.add('hidden');
            moreOptionBtn?.classList.add('hidden');
        }
    }

    updateActiveLink(active) {
        document.querySelectorAll(".sidebar__link").forEach(link => {
            const href = link.getAttribute("href");
            if (href) {
                const target = href.replace("#", "");
                const isActive = target === active;
                
                link.classList.toggle("active", isActive);
                link.parentElement.classList.toggle("sidebar__item--active", isActive);
                
                const icon = link.querySelector('.sidebar__icon');
                if (icon) {
                    const paths = icon.querySelectorAll('path');
                    paths.forEach(path => {
                        if (isActive) {
                            path.setAttribute('stroke', '#8237E8');
                            if (path.getAttribute('fill') && path.getAttribute('fill') !== 'none') {
                                path.setAttribute('fill', '#8237E8');
                            }
                        } else {
                            path.setAttribute('stroke', '#737373');
                            if (path.getAttribute('fill') && path.getAttribute('fill') !== 'none') {
                                path.setAttribute('fill', '#737373');
                            }
                        }
                    });
                }
            }
        });
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize app
new RaitaApp();
