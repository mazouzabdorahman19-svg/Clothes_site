document.addEventListener('DOMContentLoaded', () => {
    // --- Dark Mode Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const htmlElement = document.documentElement;

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    function toggleTheme() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    }

    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggleTheme();
        });
    }

    function updateThemeIcon(theme) {
        const iconName = theme === 'dark' ? 'sun' : 'moon';
        if (themeToggle) themeToggle.innerHTML = `<i data-feather="${iconName}"></i>`;
        if (mobileThemeToggle) mobileThemeToggle.innerHTML = `<i data-feather="${iconName}"></i> Toggle Theme`;
        if (typeof feather !== 'undefined') {
            feather.replace(); // Re-render the icon
        }
    }

    // --- Sticky Navbar ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const menuBtn = document.getElementById('menu-btn');
    const closeMenuBtn = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');

    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('active');
    });

    closeMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });

    // Close menu on link click
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });

    // --- Cart Sidebar Toggle ---
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    let cartCount = 0;
    const cartBadge = document.querySelector('.cart-badge');

    function toggleCart() {
        cartSidebar.classList.toggle('active');
        cartOverlay.classList.toggle('active');
    }

    cartBtn.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    // --- Product Modal Logic ---
    const modal = document.getElementById('product-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const qtyInput = document.getElementById('qty-input');
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');
    const modalAddToCart = document.getElementById('modal-add-to-cart');

    // Open Modal when clicking Add to Cart OR the product image
    document.querySelectorAll('.add-to-cart, .product-img-wrapper img').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const card = e.target.closest('.product-card');
            if (card) {
                // Populate modal data
                modalImg.src = card.querySelector('.product-img').src;
                modalTitle.textContent = card.querySelector('.product-name').textContent;
                modalPrice.textContent = card.querySelector('.product-price').textContent;
                
                // Reset Quantity
                qtyInput.value = 1;
                
                // Show Modal
                modal.classList.add('active');
            }
        });
    });

    // Close Modal
    function closeProductModal() {
        modal.classList.remove('active');
    }
    
    if(closeModalBtn) closeModalBtn.addEventListener('click', closeProductModal);
    if(modal) modal.addEventListener('click', (e) => {
        if (e.target === modal) closeProductModal();
    });

    // Quantity Handlers
    if(qtyMinus) qtyMinus.addEventListener('click', () => {
        let val = parseInt(qtyInput.value);
        if (val > 1) qtyInput.value = val - 1;
    });
    
    if(qtyPlus) qtyPlus.addEventListener('click', () => {
        let val = parseInt(qtyInput.value);
        if (val < 10) qtyInput.value = val + 1;
    });

    // Size & Color selection active states
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // Add to cart from modal
    if(modalAddToCart) modalAddToCart.addEventListener('click', () => {
        const qty = parseInt(qtyInput.value) || 1;
        const size = document.querySelector('.size-btn.active').textContent;
        const color = document.querySelector('.color-btn.active').getAttribute('data-color');
        const itemName = modalTitle.textContent;
        
        cartCount += qty;
        cartBadge.textContent = cartCount;
        
        // Simple animation on badge
        cartBadge.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartBadge.style.transform = 'scale(1)';
        }, 200);

        closeProductModal();
        showToast(`Added ${qty}x ${itemName} (${color}, Size: ${size}) to cart!`);
        
        // Update Cart Sidebar
        const cartItems = document.getElementById('cart-items');
        if(cartItems.querySelector('.empty-cart-msg')) cartItems.innerHTML = '';
        
        cartItems.innerHTML += `
            <div style="margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); display:flex; gap: 1rem; align-items: center;">
                <img src="${modalImg.src}" style="width: 70px; height: 90px; object-fit:cover; border-radius:4px;">
                <div style="flex:1;">
                    <strong style="font-family: var(--font-heading); font-size:1.1rem;">${itemName}</strong><br>
                    <small style="color: var(--text-muted);">${color} | Size: ${size}</small><br>
                    <strong style="display:block; margin-top:0.3rem;">${modalPrice.textContent} <span style="font-weight:400; font-size:0.8rem;">(x${qty})</span></strong>
                </div>
            </div>`;
            
        // Optional: calculate total price mock
        const priceStr = modalPrice.textContent.replace('$', '');
        const currentTotalStr = document.getElementById('cart-total-price').textContent.replace('$', '');
        const newTotal = (parseFloat(currentTotalStr) + (parseFloat(priceStr) * qty)).toFixed(2);
        document.getElementById('cart-total-price').textContent = '$' + newTotal;
    });

    // --- Product Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            products.forEach(product => {
                if (filterValue === 'all' || product.getAttribute('data-category') === filterValue) {
                    product.style.display = 'block';
                    // Trigger reflow for animation
                    setTimeout(() => {
                        product.style.opacity = '1';
                        product.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    product.style.opacity = '0';
                    product.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        product.style.display = 'none';
                    }, 300); // match transition duration
                }
            });
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    fadeElements.forEach(element => {
        appearOnScroll.observe(element);
    });

    // --- Smooth Scrolling for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                // Adjust for fixed header height
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
    // --- Toast Notification System ---
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);

    const style = document.createElement('style');
    style.textContent = `
        .toast-container {
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            pointer-events: none;
        }
        .toast {
            background: var(--btn-bg);
            color: var(--btn-text);
            padding: 1rem 2rem;
            border-radius: 30px;
            font-size: 0.95rem;
            font-family: var(--font-body);
            font-weight: 500;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            animation: toast-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            pointer-events: auto;
        }
        [data-theme="dark"] .toast {
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        @keyframes toast-in {
            from { opacity: 0; transform: translateY(30px) scale(0.9); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .toast.hide {
            animation: toast-out 0.3s ease-in forwards;
        }
        @keyframes toast-out {
            from { opacity: 1; transform: translateY(0) scale(1); }
            to { opacity: 0; transform: translateY(20px) scale(0.9); }
        }
    `;
    document.head.appendChild(style);

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // --- Interactive Elements ---
    
    // 1. Search Icon
    const searchBtn = document.getElementById('search-btn');
    const mobileSearchBtn = document.getElementById('mobile-search-btn');
    
    function triggerSearch(e) {
        e.preventDefault();
        showToast('Search functionality coming soon.', 'info');
        if (mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
        }
    }
    
    if(searchBtn) searchBtn.addEventListener('click', triggerSearch);
    if(mobileSearchBtn) mobileSearchBtn.addEventListener('click', triggerSearch);

    // 2. Category Cards (Scroll to products and filter)
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h3').textContent.toLowerCase().replace(' ', '-');
            const filterBtn = document.querySelector(`.filter-btn[data-filter="${title}"]`);
            if(filterBtn) {
                filterBtn.click();
                
                // Scroll to featured section
                const target = document.getElementById('featured');
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
                
                showToast(`Filtering by ${card.querySelector('h3').textContent}`);
            }
        });
    });

    // 3. Shop the Look buttons
    const outfitBtns = document.querySelectorAll('.outfit-content .btn-outline');
    outfitBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            cartCount++;
            cartBadge.textContent = cartCount;
            cartBadge.style.transform = 'scale(1.3)';
            setTimeout(() => cartBadge.style.transform = 'scale(1)', 200);
            showToast('Full outfit added to cart!');
            
            const cartItems = document.getElementById('cart-items');
            if(cartCount === 1) cartItems.innerHTML = '';
            cartItems.innerHTML += '<div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);"><strong>Full Outfit Look</strong></div>';
        });
    });

    // 4. Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if(newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Thank you for subscribing to VELARO!');
            newsletterForm.reset();
        });
    }

    // 5. Social Links & Footer Links
    document.querySelectorAll('.social-links a, .footer-col ul a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const text = link.textContent.trim();
            if(text) {
                showToast('Navigating to ' + text + '...');
            } else {
                showToast('Opening social media profile...');
            }
        });
    });

    // 6. Fix Logo click to scroll to top
    const logoLinks = document.querySelectorAll('.logo');
    logoLinks.forEach(logo => {
        if(logo.tagName === 'A' && logo.getAttribute('href') === '#') {
            logo.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    });

});
