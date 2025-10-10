class RaitaApp {
    constructor() {
        this.content = document.getElementById("app-content");
        this.pageTitle = document.querySelector('.topbar__title h2');
        this.routes = {
            dashboard: "../html/dashboard.html",
            chat: "../html/agentchat.html",
            marketinsight: "../html/marketinsight.html",
            reports: "../html/reports.html",
            dropshipping: "../html/dropshipping.html",
            marketing: "../html/marketing.html",
            settings: "../html/settings.html",
        };
        this.init();
    }

    init() {
        window.addEventListener("hashchange", () => this.loadPage());
        document.addEventListener("DOMContentLoaded", () => this.loadPage());
        
        // اضافه کردن event listener برای لینک‌های سایدبار
        document.addEventListener("click", (e) => {
            if (e.target.closest('.sidebar__link')) {
                e.preventDefault();
                const link = e.target.closest('.sidebar__link');
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    window.location.hash = href.substring(1);
                }
            }
        });
    }

    async loadPage() {
        const hash = window.location.hash.replace("#", "") || "dashboard";
        const url = this.routes[hash] || this.routes["dashboard"];

        try {
            // خواندن فایل HTML کامل
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Page not found: ${url}`);
            const htmlText = await response.text();

            // ساخت DOM مجزا برای استخراج محتوای body
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, "text/html");

            // گرفتن محتوای داخل <body>
            const bodyContent = doc.body.innerHTML;

            // جایگذاری در main.content
            this.content.innerHTML = bodyContent;

            // تغییر عنوان صفحه از <title> فایل مقصد
            const pageTitle = doc.querySelector("title")?.textContent || this.capitalize(hash);
            if (this.pageTitle) {
                this.pageTitle.textContent = pageTitle;
            }
            document.title = `Raita AI — ${pageTitle}`;

            // فعال کردن لینک سایدبار مرتبط
            this.updateActiveLink(hash);

        } catch (err) {
            console.error("Error loading page:", err);
            this.content.innerHTML = `<p class="error">⚠️ Failed to load page: ${err.message}</p>`;
        }
    }

    updateActiveLink(active) {
        document.querySelectorAll(".sidebar__link").forEach(link => {
            const href = link.getAttribute("href");
            if (href) {
                const target = href.replace("#", "");
                link.classList.toggle("active", target === active);
                link.parentElement.classList.toggle("sidebar__item--active", target === active);
            }
        });
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

new RaitaApp();