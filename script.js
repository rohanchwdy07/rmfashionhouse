/* =========================================
   RM FASHION HOUSE
   MAIN JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       ELEMENTS
    ========================================== */

    const body = document.body;
    const pageLoader = document.getElementById("pageLoader");
    const navbar = document.getElementById("navbar");

    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");
    const mobileClose = document.getElementById("mobileClose");

    const searchTrigger = document.querySelector(".search-trigger");
    const searchOverlay = document.getElementById("searchOverlay");
    const searchClose = document.getElementById("searchClose");
    const searchInput = document.getElementById("searchInput");
    const searchSubmit = document.getElementById("searchSubmit");

    const wishlistCount = document.querySelector(".wishlist-count");
    const cartCount = document.querySelector(".cart-count");

    const cartTrigger = document.querySelector(".cart-trigger");
    const cartDrawer = document.getElementById("cartDrawer");
    const cartClose = document.getElementById("cartClose");
    const cartBackdrop = document.querySelector(".cart-backdrop");

    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    const quickViewModal = document.getElementById("quickViewModal");
    const modalClose = document.getElementById("modalClose");
    const modalBackdrop = document.querySelector(".modal-backdrop");

    const modalProductImage = document.getElementById("modalProductImage");
    const modalProductName = document.getElementById("modalProductName");
    const modalProductDescription = document.getElementById("modalProductDescription");
    const modalProductPrice = document.getElementById("modalProductPrice");

    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    const newsletterForm = document.getElementById("newsletterForm");

    const currentYear = document.getElementById("currentYear");


    /* =========================================
       STATE
    ========================================== */

    let cart = [];
    let wishlist = [];
    let toastTimeout;

    let selectedProduct = null;


    /* =========================================
       PAGE LOADER
    ========================================== */

    window.addEventListener("load", () => {

        setTimeout(() => {

            if (pageLoader) {
                pageLoader.classList.add("loaded");
            }

            body.classList.add("page-ready");

        }, 700);

    });


    /* =========================================
       NAVBAR SCROLL
    ========================================== */

    let lastScroll = 0;

    window.addEventListener("scroll", () => {

        const currentScroll = window.scrollY;

        if (navbar) {

            if (currentScroll > 60) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }

            if (currentScroll > lastScroll && currentScroll > 180) {
                navbar.classList.add("nav-hidden");
            } else {
                navbar.classList.remove("nav-hidden");
            }

        }

        lastScroll = currentScroll;

    }, { passive: true });


    /* =========================================
       MOBILE MENU
    ========================================== */

    function openMobileMenu() {

        if (!mobileMenu) return;

        mobileMenu.classList.add("active");
        body.classList.add("menu-open");

    }


    function closeMobileMenu() {

        if (!mobileMenu) return;

        mobileMenu.classList.remove("active");
        body.classList.remove("menu-open");

    }


    if (menuToggle) {
        menuToggle.addEventListener("click", openMobileMenu);
    }


    if (mobileClose) {
        mobileClose.addEventListener("click", closeMobileMenu);
    }


    document.querySelectorAll(".mobile-nav a").forEach(link => {

        link.addEventListener("click", () => {
            closeMobileMenu();
        });

    });


    /* =========================================
       SEARCH OVERLAY
    ========================================== */

    function openSearch() {

        if (!searchOverlay) return;

        searchOverlay.classList.add("active");
        body.classList.add("search-open");

        setTimeout(() => {

            if (searchInput) {
                searchInput.focus();
            }

        }, 250);

    }


    function closeSearch() {

        if (!searchOverlay) return;

        searchOverlay.classList.remove("active");
        body.classList.remove("search-open");

    }


    if (searchTrigger) {
        searchTrigger.addEventListener("click", openSearch);
    }


    if (searchClose) {
        searchClose.addEventListener("click", closeSearch);
    }


    /* =========================================
       SEARCH FUNCTION
    ========================================== */

    function performSearch() {

        const query = searchInput?.value.trim().toLowerCase();

        if (!query) {
            showToast("Type something to search");
            return;
        }

        const products = document.querySelectorAll(".shop-product");

        let found = false;

        products.forEach(product => {

            const text = product.textContent.toLowerCase();

            if (text.includes(query)) {

                product.style.display = "";
                product.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                product.classList.add("search-highlight");

                setTimeout(() => {
                    product.classList.remove("search-highlight");
                }, 1800);

                found = true;

            }

        });


        closeSearch();


        if (found) {

            showToast(`Showing results for "${query}"`);

        } else {

            showToast(`No products found for "${query}"`);

        }

    }


    if (searchSubmit) {
        searchSubmit.addEventListener("click", performSearch);
    }


    if (searchInput) {

        searchInput.addEventListener("keydown", event => {

            if (event.key === "Enter") {
                performSearch();
            }

        });

    }


    document.querySelectorAll(".search-suggestions button").forEach(button => {

        button.addEventListener("click", () => {

            if (searchInput) {
                searchInput.value = button.textContent.trim();
                performSearch();
            }

        });

    });


    /* =========================================
       SMOOTH SCROLL
    ========================================== */

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", event => {

            const href = anchor.getAttribute("href");

            if (!href || href === "#") return;

            const target = document.querySelector(href);

            if (!target) return;

            event.preventDefault();

            const navbarHeight = navbar
                ? navbar.offsetHeight
                : 80;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

        });

    });


    /* =========================================
       ACTIVE NAVIGATION
    ========================================== */

    const navLinks = document.querySelectorAll(".desktop-nav .nav-link");

    const sections = document.querySelectorAll(
        "main section[id]"
    );


    const navObserver = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const id = entry.target.getAttribute("id");

                navLinks.forEach(link => {

                    link.classList.remove("active");

                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("active");
                    }

                });

            });

        },
        {
            rootMargin: "-35% 0px -55% 0px"
        }
    );


    sections.forEach(section => {
        navObserver.observe(section);
    });


    /* =========================================
       PRODUCT FILTERS
    ========================================== */

    const filterButtons =
        document.querySelectorAll(".filter-btn");

    const shopProducts =
        document.querySelectorAll(".shop-product");


    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            const filter =
                button.dataset.filter;

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");


            shopProducts.forEach(product => {

                const category =
                    product.dataset.category;

                if (
                    filter === "all" ||
                    category === filter
                ) {

                    product.classList.remove("filtered-out");

                    setTimeout(() => {
                        product.style.display = "";
                    }, 20);

                } else {

                    product.classList.add("filtered-out");

                    setTimeout(() => {
                        product.style.display = "none";
                    }, 250);

                }

            });

        });

    });


    /* =========================================
       WISHLIST
    ========================================== */

    const wishlistButtons =
        document.querySelectorAll(
            ".wishlist-btn"
        );


    wishlistButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();
            event.stopPropagation();

            const productCard =
                button.closest(".product-card");

            if (!productCard) return;

            const name =
                productCard.querySelector("h3")?.textContent.trim();

            const price =
                productCard.querySelector(".price")?.textContent.trim();

            const image =
                productCard.querySelector("img")?.src;


            const existingIndex =
                wishlist.findIndex(
                    item => item.name === name
                );


            if (existingIndex > -1) {

                wishlist.splice(existingIndex, 1);

                button.classList.remove("active");

                const icon =
                    button.querySelector("i");

                if (icon) {
                    icon.className =
                        "fa-regular fa-heart";
                }

                showToast("Removed from wishlist");

            } else {

                wishlist.push({
                    name,
                    price,
                    image
                });

                button.classList.add("active");

                const icon =
                    button.querySelector("i");

                if (icon) {
                    icon.className =
                        "fa-solid fa-heart";
                }

                showToast("Added to wishlist");

            }


            updateWishlistCount();

        });

    });


    function updateWishlistCount() {

        if (wishlistCount) {
            wishlistCount.textContent =
                wishlist.length;
        }

    }


    /* =========================================
       QUICK ADD
    ========================================== */

    const quickAddButtons =
        document.querySelectorAll(".quick-add");


    quickAddButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            const product =
                button.closest(".product-card");

            if (!product) return;

            addProductFromCard(product);

        });

    });


    function addProductFromCard(product) {

        const name =
            product.querySelector("h3")?.textContent.trim();

        const priceText =
            product.querySelector(".price")?.textContent.trim();

        const image =
            product.querySelector("img")?.src;


        const price =
            parseFloat(
                priceText?.replace("$", "")
            ) || 0;


        addToCart({
            name,
            price,
            image,
            quantity: 1
        });

    }


    /* =========================================
       SHOP ADD CART
    ========================================== */

    const addCartButtons =
        document.querySelectorAll(".add-cart");


    addCartButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            const product =
                button.closest(".shop-product");

            if (!product) return;

            const name =
                product.querySelector("h3")?.textContent.trim();

            const priceText =
                product.querySelector("strong")?.textContent.trim();

            const image =
                product.querySelector("img")?.src;


            const price =
                parseFloat(
                    priceText?.replace("$", "")
                ) || 0;


            addToCart({
                name,
                price,
                image,
                quantity: 1
            });

        });

    });


    /* =========================================
       CART SYSTEM
    ========================================== */

    function addToCart(product) {

        const existing =
            cart.find(item =>
                item.name === product.name
            );


        if (existing) {

            existing.quantity += 1;

        } else {

            cart.push(product);

        }


        updateCart();

        showToast(
            `${product.name} added to your bag`
        );


        if (cartDrawer) {
            openCart();
        }

    }


    function updateCart() {

        const totalQuantity =
            cart.reduce(
                (total, item) =>
                    total + item.quantity,
                0
            );


        if (cartCount) {
            cartCount.textContent =
                totalQuantity;
        }


        if (!cartItems) return;


        if (cart.length === 0) {

            cartItems.innerHTML = `
                <div class="empty-cart">

                    <i class="fa-solid fa-bag-shopping"></i>

                    <h3>Your bag is empty</h3>

                    <p>
                        Discover something worth wearing.
                    </p>

                    <a href="#shop"
                       class="btn btn-dark cart-shop-btn">
                        SHOP NOW
                    </a>

                </div>
            `;

        } else {

            cartItems.innerHTML = cart.map(
                (item, index) => `

                <div class="cart-item">

                    <div class="cart-item-image">

                        <img
                            src="${item.image}"
                            alt="${escapeHTML(item.name)}"
                        >

                    </div>


                    <div class="cart-item-details">

                        <h4>
                            ${escapeHTML(item.name)}
                        </h4>

                        <span>
                            $${item.price.toFixed(2)}
                        </span>


                        <div class="quantity-controls">

                            <button
                                class="quantity-btn"
                                data-index="${index}"
                                data-action="decrease">
                                −
                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                class="quantity-btn"
                                data-index="${index}"
                                data-action="increase">
                                +
                            </button>

                        </div>

                    </div>


                    <button
                        class="remove-cart-item"
                        data-index="${index}"
                        aria-label="Remove item">

                        <i class="fa-solid fa-xmark"></i>

                    </button>

                </div>

            `).join("");

        }


        const subtotal =
            cart.reduce(
                (total, item) =>
                    total +
                    item.price *
                    item.quantity,
                0
            );


        if (cartTotal) {

            cartTotal.textContent =
                `$${subtotal.toFixed(2)}`;

        }


        bindCartControls();

    }


    function bindCartControls() {

        document
            .querySelectorAll(".quantity-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(button.dataset.index);

                        const action =
                            button.dataset.action;

                        if (!cart[index]) return;


                        if (action === "increase") {

                            cart[index].quantity += 1;

                        }


                        if (action === "decrease") {

                            cart[index].quantity -= 1;

                            if (
                                cart[index].quantity <= 0
                            ) {

                                cart.splice(index, 1);

                            }

                        }


                        updateCart();

                    }
                );

            });


        document
            .querySelectorAll(".remove-cart-item")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(button.dataset.index);

                        cart.splice(index, 1);

                        updateCart();

                        showToast(
                            "Item removed from your bag"
                        );

                    }
                );

            });


        document
            .querySelectorAll(".cart-shop-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => closeCart()
                );

            });

    }


    /* =========================================
       CART OPEN / CLOSE
    ========================================== */

    function openCart() {

        if (!cartDrawer) return;

        cartDrawer.classList.add("active");
        body.classList.add("cart-open");

    }


    function closeCart() {

        if (!cartDrawer) return;

        cartDrawer.classList.remove("active");
        body.classList.remove("cart-open");

    }


    if (cartTrigger) {
        cartTrigger.addEventListener(
            "click",
            openCart
        );
    }


    if (cartClose) {
        cartClose.addEventListener(
            "click",
            closeCart
        );
    }


    if (cartBackdrop) {
        cartBackdrop.addEventListener(
            "click",
            closeCart
        );
    }


    /* =========================================
       QUICK VIEW
    ========================================== */

    const quickViewButtons =
        document.querySelectorAll(".quick-view");


    quickViewButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            const product =
                button.closest(".shop-product");

            if (!product) return;


            const image =
                product.querySelector("img")?.src;

            const name =
                product.querySelector("h3")?.textContent.trim();

            const price =
                product.querySelector("strong")?.textContent.trim();

            const description =
                product.querySelector("p")?.textContent.trim();


            selectedProduct = {
                name,
                price,
                image,
                description
            };


            if (modalProductImage) {
                modalProductImage.src = image;
            }


            if (modalProductName) {
                modalProductName.textContent = name;
            }


            if (modalProductPrice) {
                modalProductPrice.textContent = price;
            }


            if (modalProductDescription) {
                modalProductDescription.textContent =
                    `${description}. Carefully selected materials and a refined silhouette make this piece an RM essential.`;
            }


            openQuickView();

        });

    });


    function openQuickView() {

        if (!quickViewModal) return;

        quickViewModal.classList.add("active");
        body.classList.add("modal-open");

    }


    function closeQuickView() {

        if (!quickViewModal) return;

        quickViewModal.classList.remove("active");
        body.classList.remove("modal-open");

        selectedProduct = null;

    }


    if (modalClose) {
        modalClose.addEventListener(
            "click",
            closeQuickView
        );
    }


    if (modalBackdrop) {
        modalBackdrop.addEventListener(
            "click",
            closeQuickView
        );
    }


    /* =========================================
       SIZE SELECTOR
    ========================================== */

    document.querySelectorAll(".sizes button").forEach(button => {

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".sizes button")
                .forEach(size => {
                    size.classList.remove("active");
                });

            button.classList.add("active");

        });

    });


    /* =========================================
       MODAL ADD TO CART
    ========================================== */

    const modalAddCart =
        document.querySelector(".modal-add-cart");


    if (modalAddCart) {

        modalAddCart.addEventListener("click", () => {

            if (!selectedProduct) return;


            const price =
                parseFloat(
                    selectedProduct.price
                        .replace("$", "")
                ) || 0;


            addToCart({
                name: selectedProduct.name,
                price,
                image: selectedProduct.image,
                quantity: 1
            });


            closeQuickView();

        });

    }


    /* =========================================
       NEWSLETTER
    ========================================== */

    if (newsletterForm) {

        newsletterForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const emailInput =
                    newsletterForm.querySelector(
                        'input[type="email"]'
                    );

                const email =
                    emailInput?.value.trim();


                if (!email) {

                    showToast(
                        "Please enter your email"
                    );

                    return;

                }


                showToast(
                    "Welcome to the RM Journal"
                );


                newsletterForm.reset();

            }
        );

    }


    /* =========================================
       TOAST
    ========================================== */

    function showToast(message) {

        if (!toast) return;

        clearTimeout(toastTimeout);

        if (toastMessage) {
            toastMessage.textContent = message;
        }

        toast.classList.add("show");


        toastTimeout = setTimeout(() => {

            toast.classList.remove("show");

        }, 2800);

    }


    /* =========================================
       ESCAPE HTML
    ========================================== */

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =========================================
       REVEAL ANIMATIONS
    ========================================== */

    const revealElements =
        document.querySelectorAll(
            ".product-card, " +
            ".shop-product, " +
            ".collection-card, " +
            ".essential-item, " +
            ".lookbook-item, " +
            ".about-content, " +
            ".editor-copy, " +
            ".editor-image"
        );


    revealElements.forEach(element => {
        element.classList.add("reveal");
    });


    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("revealed");

                    revealObserver.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -50px 0px"
            }
        );


    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    /* =========================================
       STAGGER PRODUCT ANIMATION
    ========================================== */

    document
        .querySelectorAll(".product-card")
        .forEach((card, index) => {

            card.style.setProperty(
                "--delay",
                `${index * 80}ms`
            );

        });


    document
        .querySelectorAll(".shop-product")
        .forEach((product, index) => {

            product.style.setProperty(
                "--delay",
                `${index * 70}ms`
            );

        });


    /* =========================================
       IMAGE HOVER EFFECT
    ========================================== */

    const imageContainers =
        document.querySelectorAll(
            ".product-image, " +
            ".shop-image, " +
            ".collection-card, " +
            ".lookbook-item"
        );


    imageContainers.forEach(container => {

        container.addEventListener(
            "mouseenter",
            () => {
                container.classList.add("image-hovered");
            }
        );

        container.addEventListener(
            "mouseleave",
            () => {
                container.classList.remove("image-hovered");
            }
        );

    });


    /* =========================================
       CUSTOM CURSOR
    ========================================== */

    const cursorDot =
        document.querySelector(".cursor-dot");

    const cursorOutline =
        document.querySelector(".cursor-outline");


    if (
        cursorDot &&
        cursorOutline &&
        window.matchMedia("(pointer: fine)").matches
    ) {

        let mouseX = 0;
        let mouseY = 0;

        let outlineX = 0;
        let outlineY = 0;


        window.addEventListener(
            "mousemove",
            event => {

                mouseX = event.clientX;
                mouseY = event.clientY;

                cursorDot.style.left =
                    `${mouseX}px`;

                cursorDot.style.top =
                    `${mouseY}px`;

            },
            { passive: true }
        );


        function animateCursor() {

            outlineX +=
                (mouseX - outlineX) * 0.15;

            outlineY +=
                (mouseY - outlineY) * 0.15;


            cursorOutline.style.left =
                `${outlineX}px`;

            cursorOutline.style.top =
                `${outlineY}px`;


            requestAnimationFrame(
                animateCursor
            );

        }


        animateCursor();


        const interactiveElements =
            document.querySelectorAll(
                "a, button, input, " +
                ".product-card, " +
                ".shop-product, " +
                ".collection-card"
            );


        interactiveElements.forEach(element => {

            element.addEventListener(
                "mouseenter",
                () => {

                    cursorOutline.classList.add(
                        "cursor-hover"
                    );

                }
            );


            element.addEventListener(
                "mouseleave",
                () => {

                    cursorOutline.classList.remove(
                        "cursor-hover"
                    );

                }
            );

        });

    }


    /* =========================================
       HERO PARALLAX
    ========================================== */

    const heroImage =
        document.querySelector(".hero-image");


    if (heroImage) {

        window.addEventListener(
            "scroll",
            () => {

                const scrollY =
                    window.scrollY;

                if (scrollY < window.innerHeight) {

                    heroImage.style.transform =
                        `translateY(${scrollY * 0.18}px)`;

                }

            },
            { passive: true }
        );

    }


    /* =========================================
       CAMPAIGN PARALLAX
    ========================================== */

    const campaignImage =
        document.querySelector(".campaign-image");


    if (campaignImage) {

        const campaignSection =
            document.querySelector(
                ".campaign-section"
            );


        window.addEventListener(
            "scroll",
            () => {

                if (!campaignSection) return;


                const rect =
                    campaignSection.getBoundingClientRect();

                const windowHeight =
                    window.innerHeight;


                if (
                    rect.top < windowHeight &&
                    rect.bottom > 0
                ) {

                    const progress =
                        (windowHeight - rect.top) /
                        (windowHeight + rect.height);


                    const movement =
                        (progress - 0.5) * 50;


                    campaignImage.style.transform =
                        `translateY(${movement}px)`;

                }

            },
            { passive: true }
        );

    }


    /* =========================================
       MAGNETIC BUTTONS
    ========================================== */

    const magneticButtons =
        document.querySelectorAll(
            ".btn, " +
            ".view-all, " +
            ".text-link, " +
            ".modal-add-cart, " +
            ".checkout-btn"
        );


    if (
        window.matchMedia("(pointer: fine)").matches
    ) {

        magneticButtons.forEach(button => {

            button.addEventListener(
                "mousemove",
                event => {

                    const rect =
                        button.getBoundingClientRect();

                    const x =
                        event.clientX -
                        rect.left -
                        rect.width / 2;

                    const y =
                        event.clientY -
                        rect.top -
                        rect.height / 2;


                    button.style.transform =
                        `translate(${x * 0.08}px, ${y * 0.08}px)`;

                }
            );


            button.addEventListener(
                "mouseleave",
                () => {

                    button.style.transform = "";

                }
            );

        });

    }


    /* =========================================
       IMAGE LAZY LOADING
    ========================================== */

    document
        .querySelectorAll("img")
        .forEach(image => {

            image.loading = "lazy";

        });


    /* Keep first hero/editor images eager */
    document
        .querySelectorAll(
            ".hero img, .campaign-section img"
        )
        .forEach(image => {

            image.loading = "eager";

        });


    /* =========================================
       PRODUCT IMAGE ERROR FALLBACK
    ========================================== */

    document
        .querySelectorAll("img")
        .forEach(image => {

            image.addEventListener(
                "error",
                () => {

                    image.classList.add(
                        "image-error"
                    );

                }
            );

        });


    /* =========================================
       YEAR
    ========================================== */

    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();

    }


    /* =========================================
       KEYBOARD CONTROLS
    ========================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") return;

            closeMobileMenu();
            closeSearch();
            closeCart();
            closeQuickView();

        }
    );


    /* =========================================
       PREVENT BODY SCROLL FOR OVERLAYS
    ========================================== */

    function updateBodyLock() {

        const locked =
            mobileMenu?.classList.contains("active") ||
            searchOverlay?.classList.contains("active") ||
            cartDrawer?.classList.contains("active") ||
            quickViewModal?.classList.contains("active");


        body.classList.toggle(
            "overlay-open",
            Boolean(locked)
        );

    }


    const overlayObserver =
        new MutationObserver(updateBodyLock);


    [
        mobileMenu,
        searchOverlay,
        cartDrawer,
        quickViewModal
    ]
        .filter(Boolean)
        .forEach(element => {

            overlayObserver.observe(
                element,
                {
                    attributes: true,
                    attributeFilter: ["class"]
                }
            );

        });


    /* =========================================
       RESIZE CLEANUP
    ========================================== */

    let resizeTimer;

    window.addEventListener(
        "resize",
        () => {

            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(() => {

                if (
                    window.innerWidth > 900
                ) {

                    closeMobileMenu();

                }

            }, 150);

        },
        { passive: true }
    );


    /* =========================================
       INITIALIZE
    ========================================== */

    updateCart();
    updateWishlistCount();


    /* =========================================
       CONSOLE BRANDING
    ========================================== */

    console.log(
        "%cRM FASHION HOUSE",
        "font-size: 24px; font-weight: 700;"
    );

    console.log(
        "%cDefine your style.",
        "font-size: 14px;"
    );

});