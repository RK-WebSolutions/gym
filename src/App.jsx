import { useEffect, useRef, useState } from "react";
import { siteConfig } from "./siteConfig";

const SOURCE_URL = "/gymate/home2-source.html";
const LOCAL_ASSET_BASE = "/gymate/assets/";
const ASSET_PREFIXES = [
  "Home%202%20%E2%80%93%20gymate_files/",
  "Home 2 – gymate_files/",
];
const DEMO_BASE_URL = "https://radiustheme.com/demo/wordpress/themes/gymat";
const SOCIAL_ICON_MAP = [
  { iconClass: "fa-facebook-f", network: "facebook" },
  { iconClass: "fa-x-twitter", network: "twitter" },
  { iconClass: "fa-linkedin-in", network: "linkedin" },
  { iconClass: "fa-instagram", network: "instagram" },
];
const DUMMY_SOCIAL_LINKS = {
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  linkedin: "https://linkedin.com",
  twitter: "https://x.com",
};
const GLOBAL_LINK_URL = "https://rkws.in";
const EXECUTABLE_SCRIPT_TYPES = new Set([
  "",
  "text/javascript",
  "application/javascript",
  "module",
]);
const BLOCKED_HEAD_RELS = new Set([
  "alternate",
  "canonical",
  "edituri",
  "https://api.w.org/",
  "profile",
  "shortlink",
]);
const BLOCKED_HEAD_STYLE_IDS = new Set([
  "fluentform-elementor-widget-css",
  "woocommerce-layout-css",
  "woocommerce-smallscreen-css",
  "woocommerce-general-css",
  "rtsb-quick-view-css",
  "rtsb-wishlist-css",
  "rtsb-compare-css",
  "rtsb-frontend-css",
  "rtsb-fonts-css",
  "photoswipe-css",
  "photoswipe-default-skin-css",
  "wc-blocks-style-css",
]);
const BLOCKED_SCRIPT_IDS = new Set([
  "tmpl-variation-template",
  "tmpl-unavailable-variation-template",
  "wc-jquery-blockui-js",
  "wc-add-to-cart-js",
  "wc-js-cookie-js",
  "woocommerce-js",
  "wc-flexslider-js",
  "wp-util-js",
  "wc-add-to-cart-variation-js",
  "wc-zoom-js",
  "wc-photoswipe-js",
  "wc-photoswipe-ui-default-js",
  "wc-single-product-js",
  "fluentform-elementor-js",
  "sourcebuster-js-js",
  "wc-order-attribution-js",
  "rtsb-public-js",
  "rtsb-tipsy-js",
  "rtsb-quick-view-js",
  "rtsb-wishlist-js",
  "rtsb-compare-js",
  "wp-emoji-settings",
]);
const BLOCKED_SCRIPT_ID_PARTS = [
  "woocommerce-js-extra",
  "wc-add-to-cart",
  "wc-single-product",
  "wc-order-attribution",
  "rtsb-public-js-extra",
  "rtsb-quick-view-js-extra",
  "rtsb-wishlist-js-extra",
  "rtsb-compare-js-extra",
  "fluentform-elementor-js-extra",
  "wp-util-js-extra",
];
const BLOCKED_MENU_LABELS = new Set([
  "Cart",
  "Checkout",
  "My account",
  "Shop",
  "Shop Details",
  "Wishlist",
  "Woo Home Page",
]);
const NAV_TEXT_MAP = new Map([
  ["Home", "Home"],
  ["About", "About"],
  ["Pages", "Programs"],
  ["Class", "Programs"],
  ["Schedule", "Trainers"],
  ["Blog", "Testimonials"],
  ["Contact", "Contact"],
]);

function rewriteAssetPaths(value = "") {
  return ASSET_PREFIXES.reduce(
    (result, prefix) => result.split(prefix).join(LOCAL_ASSET_BASE),
    value,
  );
}

function parseHtmlAttribute(source, attributeName) {
  const match = source.match(
    new RegExp(`${attributeName}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"),
  );

  return match?.[2] ?? match?.[3] ?? "";
}

function extractSourceParts(rawHtml) {
  const htmlMatch = rawHtml.match(/<html([^>]*)>/i);
  const headMatch = rawHtml.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const bodyMatch = rawHtml.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);

  if (!htmlMatch || !headMatch || !bodyMatch) {
    throw new Error("Unable to parse the saved Gymate HTML.");
  }

  const headTemplate = document.createElement("template");
  headTemplate.innerHTML = rewriteAssetPaths(headMatch[1]);

  const bodyTemplate = document.createElement("template");
  bodyTemplate.innerHTML = rewriteAssetPaths(bodyMatch[2]);

  const title = headTemplate.content.querySelector("title")?.textContent || "";
  const headScripts = [...headTemplate.content.querySelectorAll("script")];
  const bodyScripts = [...bodyTemplate.content.querySelectorAll("script")];

  headScripts.forEach((script) => script.remove());
  bodyScripts.forEach((script) => script.remove());

  return {
    bodyAttributes: bodyMatch[1],
    bodyHtml: bodyTemplate.innerHTML,
    headNodes: [...headTemplate.content.children],
    htmlAttributes: htmlMatch[1],
    scripts: [...headScripts, ...bodyScripts],
    title,
  };
}

function shouldCloneHeadNode(node) {
  const tagName = node.tagName?.toLowerCase();

  if (tagName === "style") {
    return true;
  }

  if (tagName !== "link") {
    return false;
  }

  const rel = (node.getAttribute("rel") || "").toLowerCase();
  const id = node.getAttribute("id") || "";

  if (BLOCKED_HEAD_RELS.has(rel)) {
    return false;
  }

  if (BLOCKED_HEAD_STYLE_IDS.has(id)) {
    return false;
  }

  return (
    rel === "stylesheet"
  );
}

function cloneNodeWithRewrittenAttributes(node) {
  const clone = document.createElement(node.tagName.toLowerCase());

  for (const attribute of node.attributes) {
    clone.setAttribute(attribute.name, rewriteAssetPaths(attribute.value));
  }

  if (node.textContent) {
    clone.textContent = rewriteAssetPaths(node.textContent);
  }

  clone.dataset.gymateManaged = "true";
  return clone;
}

function applyBodyAttributes(sourceBody) {
  const previous = {
    className: document.body.className,
    dataset: { ...document.body.dataset },
  };

  document.body.className = sourceBody.className;

  for (const key of Object.keys(document.body.dataset)) {
    delete document.body.dataset[key];
  }

  for (const [key, value] of Object.entries(sourceBody.dataset)) {
    document.body.dataset[key] = value;
  }

  return () => {
    document.body.className = previous.className;

    for (const key of Object.keys(document.body.dataset)) {
      delete document.body.dataset[key];
    }

    for (const [key, value] of Object.entries(previous.dataset)) {
      document.body.dataset[key] = value;
    }
  };
}

function applyHtmlAttributes({ lang, dir, title }) {
  const previous = {
    lang: document.documentElement.lang,
    dir: document.documentElement.dir,
    title: document.title,
  };

  document.documentElement.lang = lang || "en-US";
  document.documentElement.dir = dir || "";
  document.title = siteConfig.pageTitle || title || previous.title;

  return () => {
    document.documentElement.lang = previous.lang;
    document.documentElement.dir = previous.dir;
    document.title = previous.title;
  };
}

function getConfiguredSocialLink(network) {
  return (siteConfig.socialLinks[network] || "").trim();
}

function findSocialNetwork(anchor) {
  return SOCIAL_ICON_MAP.find(({ iconClass }) =>
    anchor.querySelector(`.${iconClass}`),
  )?.network;
}

function isExternalUrl(value) {
  if (!value || value.startsWith("#") || value.startsWith("mailto:") || value.startsWith("tel:")) {
    return false;
  }

  try {
    const url = new URL(value, window.location.origin);
    return url.origin !== window.location.origin;
  } catch {
    return false;
  }
}

function sanitizeHref(value) {
  if (!value) {
    return "#";
  }

  try {
    const url = new URL(value, window.location.origin);

    if (url.origin === window.location.origin) {
      return url.pathname === "/home-2/" ? "/" : url.pathname + url.search + url.hash;
    }

    if (url.href.startsWith(DEMO_BASE_URL)) {
      if (
        url.pathname === "/demo/wordpress/themes/gymat/" ||
        url.pathname === "/demo/wordpress/themes/gymat/home-2/"
      ) {
        return "#top";
      }

      if (url.pathname.includes("/about")) {
        return "#about";
      }

      if (url.pathname.includes("/class")) {
        return "#classes";
      }

      if (url.pathname.includes("/trainer")) {
        return "#trainers";
      }

      if (url.pathname.includes("/pricing")) {
        return "#pricing";
      }

      if (url.pathname.includes("/blog")) {
        return "#blog";
      }

      if (url.pathname.includes("/contact")) {
        return "#contact";
      }

      return "#contact";
    }

    return "#";
  } catch {
    return value;
  }
}

function sanitizeInjectedMarkup(root) {
  const anchors = root.querySelectorAll("a[href]");

  anchors.forEach((anchor) => {
    const socialNetwork = findSocialNetwork(anchor);

    if (socialNetwork) {
      const configuredUrl = getConfiguredSocialLink(socialNetwork);
      const fallbackUrl = DUMMY_SOCIAL_LINKS[socialNetwork] || "#";
      const finalUrl = configuredUrl || fallbackUrl;

      anchor.setAttribute("href", finalUrl);
      anchor.setAttribute("target", "_blank");
      anchor.setAttribute("rel", "noreferrer");
      if (!configuredUrl) anchor.dataset.dummyLink = "true";

      return;
    }

    const href = anchor.getAttribute("href") || "";

    if (isExternalUrl(href)) {
      anchor.dataset.originalHref = href;
      anchor.setAttribute("href", sanitizeHref(href));
      anchor.removeAttribute("target");
      anchor.removeAttribute("rel");
    }
  });

  root.querySelectorAll("form[action]").forEach((form) => {
    const action = form.getAttribute("action") || "";

    if (isExternalUrl(action)) {
      form.dataset.originalAction = action;
      form.setAttribute("action", "/");
    }
  });
}

function removeUnnecessarySections(root) {
  root.querySelectorAll(".elementor-invisible").forEach((node) => {
    node.classList.remove("elementor-invisible");
    node.style.visibility = "visible";
  });

  root.querySelectorAll(".elementor-section-stretched").forEach((section) => {
    section.style.width = "";
    section.style.left = "";
  });

  root.querySelectorAll("nav li.menu-item").forEach((item) => {
    const anchor = item.querySelector(":scope > a");
    const label = anchor?.textContent?.replace(/\s+/g, " ").trim() || "";
    if (BLOCKED_MENU_LABELS.has(label)) item.remove();
  });

  // Keep navbar minimal: remove mega/dropdown wrappers and only keep core links.
  const allowedTopNavLabels = new Set(["Home", "About", "Programs", "Trainers", "Testimonials", "Contact"]);

  root.querySelectorAll("nav li.menu-item > a").forEach((anchor) => {
    const label = anchor.textContent?.replace(/\s+/g, " ").trim() || "";
    const mappedLabel = NAV_TEXT_MAP.get(label);

    if (!mappedLabel) {
      return;
    }

    anchor.textContent = mappedLabel;

    const hrefMap = {
      Home: "#top",
      About: "#about",
      Programs: "#classes",
      Trainers: "#trainers",
      Testimonials: "#blog",
      Contact: "#contact",
    };

    anchor.setAttribute("href", hrefMap[mappedLabel] || "#");
  });

  root.querySelectorAll("nav").forEach((nav) => {
    const seen = new Set();
    nav.querySelectorAll(":scope li.menu-item").forEach((item) => {
      const label = item.querySelector(":scope > a")?.textContent?.replace(/\s+/g, " ").trim() || "";
      if (!label) {
        return;
      }

      if (seen.has(label)) {
        item.remove();
        return;
      }

      seen.add(label);
    });

    nav.querySelectorAll(":scope li.menu-item").forEach((item) => {
      const anchor = item.querySelector(":scope > a");
      const label = anchor?.textContent?.replace(/\s+/g, " ").trim() || "";
      if (!label || !allowedTopNavLabels.has(label)) {
        item.remove();
        return;
      }

      item.classList.remove("menu-item-has-children");
      const subMenu = item.querySelector(":scope > ul");
      if (subMenu) subMenu.remove();
    });
  });

  // Remove cart/shop/search clutter from header (desktop + mobile)
  root.querySelectorAll(".cart-icon-area, .header-shop-cart, .cart-list-trigger, .mobile-cart, .cart-trigger-icon").forEach((node) => {
    node.remove();
  });

  // Remove trainer promo card section (two big "Become A Trainer" cards)
  root.querySelectorAll("section.elementor-section").forEach((section) => {
    const trainerCards = section.querySelectorAll(".title-text-button.text-style2");
    if (trainerCards.length >= 2) {
      section.remove();
    }
  });

  // Remove all product/shop sections
  root.querySelectorAll(".elementor-widget-rt-product-grid, .product-grid-addon, .woocommerce .product-list-wrap").forEach((node) => {
    const section = node.closest("section.elementor-section");
    if (section) {
      section.remove();
      return;
    }
    node.remove();
  });

  // Remove leftover shop intro blocks if they still exist
  root.querySelectorAll("h1, h2, h3, .section-title, .subtitle").forEach((node) => {
    const text = (node.textContent || "").trim().toLowerCase();
    if (
      text.includes("shop online") ||
      text.includes("online gym store") ||
      text.includes("shop")
    ) {
      const section = node.closest("section.elementor-section");
      if (section) section.remove();
    }
  });

  // Remove promo card/banner section
  root.querySelectorAll("h1, h2, h3, .section-title").forEach((node) => {
    const text = (node.textContent || "").trim().toLowerCase();
    if (
      text.includes("get expert training session today") ||
      text.includes("become a trainer")
    ) {
      const section = node.closest("section.elementor-section");
      if (section) section.remove();
    }
  });
}

function replaceText(root, selector, value) {
  if (!value) {
    return;
  }

  const node = root.querySelector(selector);
  if (node) {
    node.textContent = value;
  }
}

function replaceTextInNodes(root, replacements) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const original = node.nodeValue || "";
    let updated = original;

    for (const [from, to] of replacements) {
      if (!from || to == null || to === "") {
        continue;
      }

      if (updated.includes(from)) {
        updated = updated.split(from).join(to);
      }
    }

    if (updated !== original) {
      node.nodeValue = updated;
    }
  }
}

function applyContentOverrides(root) {
  const content = siteConfig.content || {};

  replaceText(root, ".rt-banner-addon.style1 .subtitle", content.heroSubtitle);
  replaceText(root, ".rt-banner-addon.style1 .banner-title", content.heroTitle);
  replaceText(root, ".rt-banner-addon.style1 .banner-content p", content.heroDescription);

  const heroButton = root.querySelector(".rt-banner-addon.style1 .btn-wrap a");
  if (heroButton && content.heroButtonLabel) {
    const labelSpan = heroButton.querySelector("span");
    if (labelSpan) {
      labelSpan.childNodes[0].textContent = content.heroButtonLabel;
    }
  }

  const joinBtn = root.querySelector(".header-right-button .header-btn .btn-text");
  if (joinBtn && content.headerButtonLabel) {
    joinBtn.textContent = content.headerButtonLabel;
  }

  replaceText(root, ".title-text-button .subtitle", content.aboutSubtitle);
  replaceText(root, ".title-text-button .section-title", content.aboutTitle);
  replaceText(root, ".title-text-button .section-content", content.aboutBody);
  replaceText(root, ".elementor-widget-text-editor p", content.aboutBody);

  const buttonSpans = root.querySelectorAll(".btn-style1 span, .btn-style2 span, .btn-style3 span");
  if (buttonSpans[1] && content.heroSecondaryButtonLabel) {
    buttonSpans[1].childNodes[0].textContent = content.heroSecondaryButtonLabel;
  }

  const replacements = [
    ["Gymat Services", content.programsTitle],
    ["Our Featured Classes", content.programsTitle],
    ["Cycling", "Strength Training"],
    ["Meditation", "Cardio Training"],
    ["Martial Arts", "Personal Training"],
    ["Karate", "Weight Loss Program"],
    ["Power Lifting", "Yoga & Flexibility"],
    [
      "Team Of Expert Coaches", content.trainersTitle
    ],
    [
      "Gymat Trainer", content.trainersTitle
    ],
    [
      "Gymat an unknown printer took a galley of type and scrambled make a type specimen book.",
      content.trainersBody,
    ],
    ["Pricing Chart", content.membershipTitle],
    ["Choose Pricing Package", content.membershipTitle],
    ["Basic Plan", content.plans?.basic],
    ["Standard Plan", content.plans?.standard],
    ["Premium Plan", content.plans?.premium],
    ["$49.00", content.plans?.basicPrice],
    ["$69.00", content.plans?.standardPrice],
    ["$99.00", content.plans?.premiumPrice],
    ["Latest Blog", content.testimonialsTitle],
    ["Recent News & Blogs", content.testimonialsTitle],
    ["Our testimonials", content.testimonialsTitle],
    ["What Our Client Say's", content.testimonialsTitle],
    ["Become A Trainer", content.getInTouchTitle],
    ["Get In Touch", content.getInTouchTitle],
    ["Find Your Energy", content.heroSubtitle],
    ["Gym Fitness", content.heroOutlineTitle || "Gym Fitness"],
    ["GYM FITNESS", content.heroOutlineTitle || "GYM FITNESS"],
    ["MAKE YOUR BODY FIT & PERFECT", content.heroTitle],
    ["Our Classes", content.heroButtonLabel],
    ["Join Our Team", content.ctaButton],
    ["© 2025 gymat. All Rights Reserved by RadiusTheme", content.footerCopyright],
    ["Phone", content.phone],
    ["info@gym.com", content.email],
    ["Erode, Tamil Nadu", content.location],
  ];

  replaceTextInNodes(root, replacements);

  const pricingSections = root.querySelectorAll(".rt-switcher-pricing-section");
  pricingSections.forEach((section) => {
    const monthlyCards = section.querySelectorAll(".rt-tab-pane.monthly .rt-pricing-table");
    const yearlyCards = section.querySelectorAll(".rt-tab-pane.yearly .rt-pricing-table");
    const plans = [
      {
        name: content.plans?.basic,
        monthlyPrice: content.plans?.basicPrice,
        yearlyPrice: content.plans?.basicYearlyPrice || content.plans?.basicPrice,
      },
      {
        name: content.plans?.standard,
        monthlyPrice: content.plans?.standardPrice,
        yearlyPrice: content.plans?.standardYearlyPrice || content.plans?.standardPrice,
      },
      {
        name: content.plans?.premium,
        monthlyPrice: content.plans?.premiumPrice,
        yearlyPrice: content.plans?.premiumYearlyPrice || content.plans?.premiumPrice,
      },
    ];

    plans.forEach((plan, index) => {
      const monthlyCard = monthlyCards[index];
      if (monthlyCard) {
        const nameNode = monthlyCard.querySelector(".rt-pricing-table__plan-name");
        const priceNode = monthlyCard.querySelector(".rt-pricing-table__item-price h4");
        if (nameNode && plan.name) nameNode.textContent = plan.name;
        if (priceNode && plan.monthlyPrice) priceNode.innerHTML = `${plan.monthlyPrice} <sub>/Month</sub>`;
      }

      const yearlyCard = yearlyCards[index];
      if (yearlyCard) {
        const nameNode = yearlyCard.querySelector(".rt-pricing-table__plan-name");
        const priceNode = yearlyCard.querySelector(".rt-pricing-table__item-price h4");
        if (nameNode && plan.name) nameNode.textContent = plan.name;
        if (priceNode && plan.yearlyPrice) priceNode.innerHTML = `${plan.yearlyPrice} <sub>/Year</sub>`;
      }
    });
  });

  const copyrightNode = root.querySelector(".copyright_wrap .copyright");
  if (copyrightNode && content.footerCopyright) {
    copyrightNode.textContent = content.footerCopyright;
  }

  const footerBrand = root.querySelector(".copyright_wrap .footer-branding");
  if (footerBrand && content.footerTagline) {
    footerBrand.setAttribute("aria-label", content.footerTagline);
  }

  replaceText(root, "#trainers .section-content", content.trainersBody);
}

function applyIconFallbacks(root) {
  const iconMap = [
    { className: "flaticon-cycling", newClass: "fa-solid fa-dumbbell" }, // Strength Training
    { className: "flaticon-proteins", newClass: "fa-solid fa-heart-pulse" }, // Cardio Training
    { className: "flaticon-skipping-rope", newClass: "fa-solid fa-user-ninja" }, // Personal Training
    { className: "flaticon-expander", newClass: "fa-solid fa-weight-scale" }, // Weight Loss
    { className: "flaticon-weightlifter", newClass: "fa-solid fa-yin-yang" }, // Yoga
    { className: "flaticon-workout", newClass: "fa-solid fa-person-running" }, // Workout
    { className: "flaticon-weightlifter-1", newClass: "fa-solid fa-dumbbell" },
    { className: "flaticon-weights", newClass: "fa-solid fa-dumbbell" },
    { className: "flaticon-grip", newClass: "fa-solid fa-hand-grab" },
    { className: "flaticon-boxing-gloves", newClass: "fa-solid fa-mitten" },
    { className: "flaticon-search", newClass: "fa-solid fa-magnifying-glass" },
    { className: "flaticon-magnifiying-glass", newClass: "fa-solid fa-magnifying-glass" },
    { className: "flaticon-yoga-mat", newClass: "fa-solid fa-yin-yang" },
  ];

  iconMap.forEach(({ className, newClass }) => {
    root.querySelectorAll(`i.${className}`).forEach((node) => {
      node.className = newClass;
      node.innerHTML = "";
    });
  });

  // Catch any missed flaticons and assign a default dot or circle
  root.querySelectorAll('i[class*="flaticon-"]').forEach((node) => {
    node.className = "fa-solid fa-circle-dot";
    node.innerHTML = "";
  });

  // Force icon positioning for the old layout to firmly prevent overlapping with text
  root.querySelectorAll('.class-item .class-media').forEach((mediaNode) => {
    mediaNode.style.setProperty("position", "absolute", "important");
    mediaNode.style.setProperty("top", "20px", "important");
    mediaNode.style.setProperty("right", "20px", "important");
    mediaNode.style.setProperty("bottom", "auto", "important");
    mediaNode.style.setProperty("left", "auto", "important");
    mediaNode.style.setProperty("transform", "none", "important");
    mediaNode.style.setProperty("z-index", "10", "important");
  });
  
  root.querySelectorAll('.class-item .class-media .class-icon i').forEach((iconNode) => {
    iconNode.style.setProperty("font-size", "28px", "important");
    iconNode.style.setProperty("display", "block", "important");
    iconNode.style.setProperty("text-align", "center", "important");
  });
}

function setupPricingToggle(root) {
  const switchBox = root.querySelector('.price-switch-box');
  const tabContent = root.querySelector('.rt-tab-content');
  const switches = root.querySelectorAll('.pricing-switch');

  const monthlyTab = root.querySelector('.rt-tab-pane.monthly');
  const yearlyTab = root.querySelector('.rt-tab-pane.yearly');

  if (monthlyTab) monthlyTab.style.display = 'block';
  if (yearlyTab) yearlyTab.style.display = 'none';

  switchBox.addEventListener('click', () => {
    const isYearly = switchBox.classList.toggle('price-switch-box--active');
    tabContent.classList.toggle('rt-active');

    // Toggle the active state on the inner switches for the bubble animation
    if (switches.length >= 2) {
      switches[0].classList.toggle('pricing-switch-active');
      switches[1].classList.toggle('pricing-switch-active');
    }

    // Force display explicitly to bypass CSS rules that rely on Elementor logic
    if (monthlyTab) monthlyTab.style.display = isYearly ? 'none' : 'block';
    if (yearlyTab) yearlyTab.style.display = isYearly ? 'block' : 'none';
  });
}



function applyLogoOverrides(root) {
  const darkLogo = "/gymate/assets/gymat_dark-1.svg";
  const lightLogo = "/gymate/assets/gymat_light-1.svg";

  root.querySelectorAll("a.dark-logo img, a.img-logo img").forEach((img) => {
    img.setAttribute("src", darkLogo);
    img.setAttribute("alt", "Gym Logo");
  });

  root.querySelectorAll("a.light-logo img").forEach((img) => {
    img.setAttribute("src", lightLogo);
    img.setAttribute("alt", "Gym Logo");
  });
}

function applyTestimonialOverrides(root) {
  const content = siteConfig.content || {};
  const testimonials = [
    {
      name: "Arun Kumar",
      role: "Member",
      text: content.testimonial1,
    },
    {
      name: "Priya S",
      role: "Member",
      text: content.testimonial2,
    },
    {
      name: "Vikram R",
      role: "Member",
      text: content.testimonial3,
    },
  ].filter((item) => item.text);

  if (!testimonials.length) {
    return;
  }

  const testimonialItems = root.querySelectorAll(".default-testimonial .testimonial-item");
  testimonialItems.forEach((item, index) => {
    const data = testimonials[index % testimonials.length];
    const title = item.querySelector(".testimonial-title");
    const role = item.querySelector(".testimonial-designation span");
    const text = item.querySelector("p");

    if (title) title.textContent = data.name;
    if (role) role.textContent = data.role;
    if (text) text.textContent = data.text;
  });
}

function ensureContactSection(root) {
  if (root.querySelector("#contact")) {
    return;
  }

  const content = siteConfig.content || {};
  const section = document.createElement("section");
  section.id = "contact";
  section.className = "rk-contact-section";

  section.innerHTML = `
    <div class="rk-contact-inner">
      <div class="rk-contact-header">
        <p class="rk-contact-subtitle">${content.getInTouchTitle || "Get In Touch"}</p>
        <h2 class="rk-contact-title">${content.ctaText || "Start Your Fitness Journey Today"}</h2>
        <p class="rk-contact-body">${content.getInTouchBody || ""}</p>
      </div>

      <div class="rk-contact-split">

        <div class="rk-contact-content">
          <div class="rk-contact-info-cards">
            <a href="tel:${(content.phone || "").replace(/\s+/g, "")}" class="rk-contact-card">
              <div class="rk-card-icon"><i class="fa-solid fa-phone"></i></div>
              <div class="rk-card-text">
                <strong>Call Us</strong>
                <span>${content.phone || "-"}</span>
              </div>
            </a>
            <a href="mailto:${content.email || ""}" class="rk-contact-card">
              <div class="rk-card-icon"><i class="fa-solid fa-envelope"></i></div>
              <div class="rk-card-text">
                <strong>Email Us</strong>
                <span>${content.email || "-"}</span>
              </div>
            </a>
            <div class="rk-contact-card">
              <div class="rk-card-icon"><i class="fa-solid fa-location-dot"></i></div>
              <div class="rk-card-text">
                <strong>Visit Us</strong>
                <span>${content.location || "-"}</span>
              </div>
            </div>
            <div class="rk-contact-card">
              <div class="rk-card-icon"><i class="fa-solid fa-clock"></i></div>
              <div class="rk-card-text">
                <strong>Working Hours</strong>
                <span>Mon – Sat: 5:00 AM – 10:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div class="rk-contact-form-wrapper">
          <h3 class="rk-form-heading">Send Us a Message</h3>
          <p class="rk-form-subtext">Fill out the form and our team will get back to you within 24 hours.</p>
          <form class="rk-contact-form" onsubmit="event.preventDefault(); this.querySelector('.rk-form-btn').textContent='Sent ✓'; setTimeout(()=>{this.querySelector('.rk-form-btn').textContent='Send Message'; this.reset();}, 2000);">
            <div class="rk-form-row">
              <input type="text" class="rk-form-input" placeholder="Your Name" required />
              <input type="email" class="rk-form-input" placeholder="Email Address" required />
            </div>
            <div class="rk-form-row">
              <input type="tel" class="rk-form-input" placeholder="Phone Number" />
              <select class="rk-form-input">
                <option value="" disabled selected>Select Program</option>
                <option value="strength">Strength Training</option>
                <option value="cardio">Cardio Training</option>
                <option value="personal">Personal Training</option>
                <option value="weight-loss">Weight Loss</option>
                <option value="yoga">Yoga & Flexibility</option>
              </select>
            </div>
            <textarea class="rk-form-input" rows="4" placeholder="Tell us about your fitness goals..." required></textarea>
            <button type="submit" class="rk-form-btn">Send Message</button>
          </form>
        </div>

      </div>
    </div>
  `;

  const footer = root.querySelector("footer");
  if (footer?.parentNode) {
    footer.parentNode.insertBefore(section, footer);
  } else {
    root.appendChild(section);
  }
}

function addGlobalIcon(root) {
  const containers = root.querySelectorAll(".topbar-social, .banner-social-section, .sidenav-social");

  containers.forEach((container) => {
    if (container.querySelector(".rk-global-icon")) {
      return;
    }

    const holder = document.createElement("span");
    holder.className = "rk-global-icon";

    const anchor = document.createElement("a");
    anchor.href = GLOBAL_LINK_URL;
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
    anchor.setAttribute("aria-label", "Global Website");

    const icon = document.createElement("i");
    icon.className = "fas fa-globe";

    anchor.appendChild(icon);
    holder.appendChild(anchor);
    container.appendChild(holder);
  });
}

function applySocialIconFallbacks(root) {
  const socialSvgMap = [
    {
      classes: ["fa-facebook-f"],
      svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v5h3v-5h2.2l.8-3H13V9c0-.6.4-1 1-1z"></path></svg>',
    },
    {
      classes: ["fa-x-twitter", "fa-twitter"],
      svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h4.5l3.5 5 4-5H20l-6 7.3L20.4 20H16l-3.9-5.6L7.2 20H4l6.4-7.3z"></path></svg>',
    },
    {
      classes: ["fa-linkedin-in"],
      svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.5a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6zM5 10h3v9H5zM10 10h2.9v1.3h.1c.4-.8 1.4-1.6 2.9-1.6 3.1 0 3.7 2 3.7 4.7V19h-3v-3.9c0-.9 0-2.1-1.3-2.1s-1.5 1-1.5 2V19h-3z"></path></svg>',
    },
    {
      classes: ["fa-instagram"],
      svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="4"></rect><circle cx="12" cy="12" r="3.2"></circle><circle cx="16.5" cy="7.5" r="1"></circle></svg>',
    },
    {
      classes: ["fa-globe"],
      svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"></path></svg>',
    },
  ];

  const getSvgForNode = (node) => {
    const classList = [...node.classList];
    const match = socialSvgMap.find(({ classes }) =>
      classes.some((cls) => classList.includes(cls)),
    );

    if (match) return match.svg;

    if (classList.includes("fab") || classList.includes("fa-brands")) {
      return socialSvgMap.find(({ classes }) => classes.includes("fa-globe"))?.svg;
    }

    return null;
  };

  const socialSelectors = [
    ".social-icon i",
    ".topbar-social i",
    ".banner-social-section i",
    ".sidenav-social i",
  ];

  root.querySelectorAll(socialSelectors.join(",")).forEach((iconNode) => {
    const svg = getSvgForNode(iconNode);
    if (!svg || iconNode.classList.contains("icon-fallback-applied")) return;
    iconNode.classList.add("icon-fallback-applied", "icon-svg");
    iconNode.setAttribute("aria-hidden", "true");
    iconNode.innerHTML = svg;
  });
}

function wireNavbarAnchors(root) {
  const setIdFromText = (textNeedle, id) => {
    const needle = textNeedle.toLowerCase();
    root.querySelectorAll("h1, h2, h3, .section-title, .subtitle").forEach((node) => {
      const text = (node.textContent || "").trim().toLowerCase();
      if (!text.includes(needle)) return;
      const section = node.closest("section.elementor-section");
      if (section && !section.id) section.id = id;
    });
  };

  setIdFromText("about our gym", "about");
  setIdFromText("our programs", "classes");
  setIdFromText("meet our trainers", "trainers");
  setIdFromText("what our members say", "blog");
  setIdFromText("membership plans", "pricing");
  setIdFromText("get in touch", "contact");

  // Ensure top anchor exists
  if (!root.querySelector("#top")) {
    const top = document.createElement("div");
    top.id = "top";
    root.prepend(top);
  }

  // Smooth-scroll fallback for in-page nav links
  root.querySelectorAll('nav a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href") || "";
      if (!href.startsWith("#")) return;
      const target = root.querySelector(href) || document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function applyPricingSwitcher(root) {
  root.querySelectorAll(".rt-switcher-pricing-section").forEach((section) => {
    const switchButton = section.querySelector(".switch-button");
    const switches = section.querySelectorAll(".pricing-switch");
    const labels = section.querySelectorAll(".pack-name");
    const monthlyPane = section.querySelector(".rt-tab-pane.monthly");
    const yearlyPane = section.querySelector(".rt-tab-pane.yearly");

    if (!switchButton || !monthlyPane || !yearlyPane) {
      return;
    }

    const setMode = (mode) => {
      const isYearly = mode === "yearly";
      section.dataset.pricingMode = mode;
      monthlyPane.style.display = isYearly ? "none" : "";
      yearlyPane.style.display = isYearly ? "" : "none";
      switches.forEach((sw, idx) => sw.classList.toggle("pricing-switch-active", isYearly ? idx === 0 : idx === 1));
      labels.forEach((label, idx) => label.classList.toggle("active", isYearly ? idx === 1 : idx === 0));
    };

    switchButton.style.cursor = "pointer";
    switchButton.addEventListener("click", () => {
      setMode(section.dataset.pricingMode === "yearly" ? "monthly" : "yearly");
    });

    labels[0]?.addEventListener("click", () => setMode("monthly"));
    labels[1]?.addEventListener("click", () => setMode("yearly"));
    setMode("monthly");
  });
}

function shouldSkipScript(scriptNode) {
  const type = (scriptNode.getAttribute("type") || "").toLowerCase();
  const id = scriptNode.getAttribute("id") || "";
  const src = scriptNode.getAttribute("src") || "";

  if (type === "text/template" || type === "application/json" || type === "speculationrules") {
    return true;
  }

  if (BLOCKED_SCRIPT_IDS.has(id)) {
    return true;
  }

  if (BLOCKED_SCRIPT_ID_PARTS.some((part) => id.includes(part))) {
    return true;
  }

  return (
    src.includes("woocommerce") ||
    src.includes("quick-view") ||
    src.includes("wishlist") ||
    src.includes("compare") ||
    src.includes("sourcebuster") ||
    src.includes("order-attribution") ||
    src.includes("fluent-forms-elementor-widget") ||
    src.includes("photoswipe") ||
    src.includes("single-product") ||
    src.includes("add-to-cart") ||
    src.includes("jquery.blockUI")
  );
}

async function appendScriptInOrder(scriptNode, managedNodes) {
  const clone = cloneNodeWithRewrittenAttributes(scriptNode);
  managedNodes.push(clone);

  const type = (scriptNode.getAttribute("type") || "").toLowerCase();
  const src = clone.getAttribute("src");

  if (!src) {
    document.body.appendChild(clone);
    return;
  }

  clone.async = false;

  await new Promise((resolve) => {
    clone.addEventListener("load", resolve, { once: true });
    clone.addEventListener("error", resolve, { once: true });
    document.body.appendChild(clone);
  });

  if (!EXECUTABLE_SCRIPT_TYPES.has(type)) {
    return;
  }
}

export default function App() {
  const mountRef = useRef(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let disposed = false;
    let restoreBody = () => {};
    let restoreHtml = () => {};
    const managedNodes = [];

    const cleanup = () => {
      for (let index = managedNodes.length - 1; index >= 0; index -= 1) {
        managedNodes[index].remove();
      }

      managedNodes.length = 0;

      if (mountRef.current) {
        mountRef.current.innerHTML = "";
      }

      restoreBody();
      restoreHtml();
    };

    async function loadPage() {
      try {
        const response = await fetch(SOURCE_URL);

        if (!response.ok) {
          throw new Error(`Failed to load source HTML: ${response.status}`);
        }

        let sourceHtml = await response.text();
        sourceHtml = sourceHtml.replace(/[^><]+an unknown printer[^><]+/gi, "");
        sourceHtml = sourceHtml.replace(/[^><]+specimen book\./gi, "");
        sourceHtml = sourceHtml.replace(/[^><]+survived not only[^><]+/gi, "");
        const sourceParts = extractSourceParts(sourceHtml);
        const bodyShell = new DOMParser().parseFromString(
          `<!doctype html><html><body ${sourceParts.bodyAttributes}></body></html>`,
          "text/html",
        );

        restoreHtml = applyHtmlAttributes({
          dir: parseHtmlAttribute(sourceParts.htmlAttributes, "dir"),
          lang: parseHtmlAttribute(sourceParts.htmlAttributes, "lang"),
          title: sourceParts.title,
        });
        restoreBody = applyBodyAttributes(bodyShell.body);

        sourceParts.headNodes.forEach((node) => {
          if (!shouldCloneHeadNode(node)) {
            return;
          }

          const clone = cloneNodeWithRewrittenAttributes(node);
          managedNodes.push(clone);
          document.head.appendChild(clone);
        });

        if (!mountRef.current) {
          return;
        }

        mountRef.current.innerHTML = sourceParts.bodyHtml;
        sanitizeInjectedMarkup(mountRef.current);
        removeUnnecessarySections(mountRef.current);
        wireNavbarAnchors(mountRef.current);
        applyContentOverrides(mountRef.current);
        applyTestimonialOverrides(mountRef.current);
        ensureContactSection(mountRef.current);
        addGlobalIcon(mountRef.current);
        applyLogoOverrides(mountRef.current);
        applySocialIconFallbacks(mountRef.current);
        applyIconFallbacks(mountRef.current);
        applyPricingSwitcher(mountRef.current);

        if (!disposed) {
          setStatus("ready");
        }

        for (const script of sourceParts.scripts) {
          if (disposed) {
            return;
          }

          if (shouldSkipScript(script)) {
            continue;
          }

          await appendScriptInOrder(script, managedNodes);
        }

        // Some external scripts mutate the DOM after initial render.
        // Re-apply icon fallbacks to catch newly inserted/broken font glyphs.
        if (mountRef.current) {
          applySocialIconFallbacks(mountRef.current);
          applyIconFallbacks(mountRef.current);
          setupPricingToggle(mountRef.current);
        }
      } catch (loadError) {
        cleanup();

        if (!disposed) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load the saved Gymate page.",
          );
          setStatus("error");
        }
      }
    }

    loadPage();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  if (status === "error") {
    return (
      <div className="gymate-status">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      {status === "loading" && (
        <div className="gymate-status">
          <p>Loading Gymate page...</p>
        </div>
      )}
      <div
        id="gymate-app"
        ref={mountRef}
        style={{ display: status === "ready" ? "contents" : "none" }}
      />
    </>
  );
}
