import { gsap } from "../vendor/gsap/esm/index.js";
import ScrollTrigger from "../vendor/gsap/esm/ScrollTrigger.js";

import {
  categories,
  portfolioProfile,
  projects,
  resumeData,
  siteCopy,
} from "../data/projects.js";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const gsapApi = gsap;
const supportedLanguages = ["zh", "en"];
let currentLang = getInitialLanguage();
let activeFilter = "all";

function getInitialLanguage() {
  const saved = window.localStorage.getItem("portfolio-language");
  if (supportedLanguages.includes(saved)) return saved;
  return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}

function pick(value, fallback = "") {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value[currentLang] ?? value.en ?? value.zh ?? fallback;
  }
  return value ?? fallback;
}

function copy(path) {
  return path.split(".").reduce((value, key) => value?.[key], siteCopy[currentLang]) ?? "";
}

function padCount(value) {
  return String(value).padStart(2, "0");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setText(selector, value) {
  const node = document.querySelector(selector);
  if (node) node.textContent = value;
}

function syncStaticCopy() {
  document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
  document.title = copy("metaTitle");

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const value = copy(node.dataset.i18n);
    if (value) node.textContent = value;
  });

  document.querySelectorAll("[data-marquee-text]").forEach((node) => {
    node.textContent = copy("hero.marquee");
  });
}

function setProfile() {
  const name = pick(portfolioProfile.name);
  const role = pick(portfolioProfile.role);

  setText("#brand-name", name);
  setText("#hero-name", name);
  setText("#hero-role", role);
  setText("#hero-statement", pick(portfolioProfile.statement));
  setText("#availability-text", pick(portfolioProfile.availability));
  setText("#profile-location", pick(portfolioProfile.location));

  const focusList = document.querySelector("#focus-list");
  if (focusList) {
    focusList.innerHTML = pick(portfolioProfile.focus, [])
      .map((item) => `<span>${escapeHtml(item)}</span>`)
      .join("");
  }

  const factList = document.querySelector("#fact-list");
  if (factList) {
    factList.innerHTML = pick(portfolioProfile.facts, [])
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");
  }

  setText("#project-count", padCount(projects.length));
  setText("#category-count", padCount(categories.length));
}

function splitTitle() {
  const title = document.querySelector(".motion-title span");
  if (!title) return;

  const text = title.textContent ?? "";
  title.textContent = "";
  title.dataset.split = "true";

  [...text].forEach((char) => {
    const wrap = document.createElement("span");
    wrap.className = "char-wrap";
    const inner = document.createElement("span");
    inner.className = "char";
    inner.textContent = char === " " ? "\u00a0" : char;
    wrap.append(inner);
    title.append(wrap);
  });
}

function renderFilters() {
  const container = document.querySelector("#category-filter");
  if (!container) return;

  const buttons = [
    { id: "all", label: copy("projects.all"), accent: "var(--accent-primary)" },
    ...categories.map((category) => ({
      ...category,
      label: pick(category.label),
    })),
  ];

  container.innerHTML = buttons
    .map(
      (category) => `
        <button
          class="${category.id === activeFilter ? "is-active" : ""}"
          type="button"
          data-filter="${category.id}"
          style="--category-accent: ${category.accent}"
        >
          ${escapeHtml(category.label)}
        </button>
      `,
    )
    .join("");
}

function categoryFor(id) {
  return categories.find((category) => category.id === id) ?? categories[0];
}

function assetSummary(project) {
  if (!project.assets?.length) return copy("projects.noAsset");
  const counts = project.assets.reduce((acc, asset) => {
    acc[asset.type] = (acc[asset.type] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts)
    .map(([type, count]) => `${count} ${copy(`assetTypes.${type}`) || type}`)
    .join(" / ");
}

function coverData(project) {
  return project.cover ?? {};
}

function coverHref(project) {
  const cover = coverData(project);
  return typeof cover === "string" ? cover : cover.href;
}

function coverLabel(project) {
  const cover = coverData(project);
  return pick(cover.label, pick(project.title));
}

function coverTone(project) {
  const cover = coverData(project);
  return cover.tone ?? project.category ?? "default";
}

function coverPosition(project) {
  const cover = coverData(project);
  return cover.position ?? "50% 50%";
}

function coverMarkup(project, size = "row") {
  const href = coverHref(project);
  const label = coverLabel(project);
  const category = categoryFor(project.category);
  const tone = coverTone(project);

  if (href) {
    return `
      <div class="project-cover project-cover-${size} has-image" style="--category-accent: ${category.accent}">
        <img src="${href}" alt="${escapeHtml(label)}" loading="lazy" style="object-position: ${coverPosition(project)}" />
      </div>
    `;
  }

  return `
    <div class="project-cover project-cover-${size} cover-tone-${tone}" style="--category-accent: ${category.accent}">
      <span>${escapeHtml(project.number ?? "")}</span>
      <strong>${escapeHtml(label)}</strong>
    </div>
  `;
}

function firstOpenableAsset(project) {
  return project.assets?.find((asset) => asset.href);
}

function projectTags(project) {
  return pick(project.tags, [])
    .map((tag) => `<span>${escapeHtml(tag)}</span>`)
    .join("");
}

function assetLabel(asset) {
  return escapeHtml(pick(asset.label));
}

function emptyState() {
  return `
    <article class="empty-state">
      <div class="empty-icon" aria-hidden="true"></div>
      <div>
        <span>${escapeHtml(copy("projects.emptyMeta"))}</span>
        <h3>${escapeHtml(copy("projects.emptyTitle"))}</h3>
        <p>${escapeHtml(copy("projects.emptyBody"))}</p>
      </div>
    </article>
  `;
}

function renderProjects(filter = activeFilter) {
  activeFilter = filter;
  const list = document.querySelector("#project-list");
  if (!list) return;

  const filtered =
    filter === "all" ? projects : projects.filter((project) => project.category === filter);

  if (!filtered.length) {
    list.innerHTML = emptyState();
    list.querySelector(".empty-state")?.addEventListener("mouseenter", () => setCursorState(true));
    list.querySelector(".empty-state")?.addEventListener("mouseleave", () => setCursorState(false));
    setPreview();
    animateProjectRows();
    return;
  }

  list.innerHTML = filtered
    .map((project, index) => {
      const category = categoryFor(project.category);
      const number = project.number ?? padCount(index + 1);
      return `
        <article
          class="project-row"
          tabindex="0"
          data-project-id="${project.id}"
          style="--category-accent: ${category.accent}"
        >
          <span class="project-number">${escapeHtml(number)}</span>
          ${coverMarkup(project)}
          <div>
            <h3>${escapeHtml(pick(project.title))}</h3>
            <p>${escapeHtml(pick(project.description))}</p>
            <div class="project-tags">${projectTags(project)}</div>
          </div>
          <div class="project-meta">
            <span>${escapeHtml(project.year ?? "TBD")}</span>
            <span>${escapeHtml(pick(category.label))}</span>
            <span>${escapeHtml(assetSummary(project))}</span>
          </div>
        </article>
      `;
    })
    .join("");

  list.querySelectorAll(".project-row").forEach((row) => {
    const project = projects.find((item) => item.id === row.dataset.projectId);
    row.addEventListener("mouseenter", () => {
      setPreview(project);
      setCursorState(true);
    });
    row.addEventListener("mouseleave", () => setCursorState(false));
    row.addEventListener("focus", () => setPreview(project));
  });

  animateProjectRows();
}

function setPreview(project) {
  const panel = document.querySelector("#preview-panel");
  if (!panel) return;

  if (!project) {
    panel.innerHTML = `
      <div class="preview-frame">
        <div class="preview-grid" aria-hidden="true"></div>
        <div class="preview-copy">
          <span>${escapeHtml(copy("projects.previewLabel"))}</span>
          <p>${escapeHtml(copy("projects.previewEmpty"))}</p>
        </div>
      </div>
    `;
    animatePreview();
    return;
  }

  const category = categoryFor(project.category);
  const openable = firstOpenableAsset(project);
  const openableAssets = (project.assets ?? []).filter((asset) => asset.href);
  const showAssetStrip = (project.assets ?? []).length > 1 || openableAssets.length > 1;
  const assetLinks = showAssetStrip
    ? (project.assets ?? [])
    .map((asset) => {
      if (asset.href) {
        return `<a href="${asset.href}" target="_blank" rel="noreferrer">${assetLabel(asset)}</a>`;
      }
      return `<span>${assetLabel(asset)}</span>`;
    })
    .join("")
    : "";

  panel.style.setProperty("--category-accent", category.accent);
  panel.innerHTML = `
    <div class="preview-frame has-project">
      ${coverMarkup(project, "preview")}
      <div class="preview-grid preview-grid-${project.category}" aria-hidden="true"></div>
      <div class="preview-watermark" aria-hidden="true">${escapeHtml(project.number)}</div>
      <div class="preview-copy">
        <span>${escapeHtml(pick(category.label))}</span>
        <h3>${escapeHtml(pick(project.title))}</h3>
        <p>${escapeHtml(pick(project.description))}</p>
        <div class="preview-tags">${projectTags(project)}</div>
        ${showAssetStrip ? `<div class="asset-strip">${assetLinks}</div>` : ""}
        ${
          openable
            ? `<a class="asset-cta" href="${openable.href}" target="_blank" rel="noreferrer">${escapeHtml(copy("projects.openAsset"))}</a>`
            : `<p class="asset-note">${escapeHtml(copy("projects.sourceOnly"))}: ${escapeHtml(project.sourcePath ?? "")}</p>`
        }
      </div>
    </div>
  `;
  animatePreview();
}

function renderCv() {
  setText("#cv-name", pick(resumeData.name));
  setText("#cv-role", pick(resumeData.role));
  setText("#cv-summary", pick(resumeData.summary));

  const highlights = document.querySelector("#cv-highlights");
  if (highlights) {
    highlights.innerHTML = pick(resumeData.highlights, [])
      .map((item) => `<span>${escapeHtml(item)}</span>`)
      .join("");
  }

  const sections = document.querySelector("#cv-sections");
  if (sections) {
    sections.innerHTML = resumeData.sections
      .map(
        (section, index) => `
          <div class="cv-block-heading">
            <span>${padCount(index + 2)}</span>
            <h3>${escapeHtml(pick(section.title))}</h3>
          </div>
          <div class="cv-timeline">
            ${section.items
              .map(
                (item) => `
                  <article class="cv-item">
                    <span>${escapeHtml(item.meta)}</span>
                    <h4>${escapeHtml(pick(item.title))}</h4>
                    <p>${escapeHtml(pick(item.detail))}</p>
                  </article>
                `,
              )
              .join("")}
          </div>
        `,
      )
      .join("");
  }

  const skillGrid = document.querySelector("#skill-grid");
  if (skillGrid) {
    skillGrid.innerHTML = resumeData.skillGroups
      .map(
        (group) => `
          <article>
            <h4>${escapeHtml(pick(group.title))}</h4>
            <p>${group.items.map((item) => escapeHtml(item)).join(" / ")}</p>
          </article>
        `,
      )
      .join("");
  }
}

function renderLanguage() {
  syncStaticCopy();
  setProfile();
  renderFilters();
  renderProjects(activeFilter);
  renderCv();
  setPreview();
  splitTitle();
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lang === currentLang);
  });
}

function initLanguageToggle() {
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextLang = button.dataset.lang;
      if (!supportedLanguages.includes(nextLang) || nextLang === currentLang) return;
      currentLang = nextLang;
      window.localStorage.setItem("portfolio-language", currentLang);
      renderLanguage();
      initIntroMotion(true);
    });
  });
}

function initFilterEvents() {
  const container = document.querySelector("#category-filter");
  if (!container) return;
  container.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    activeFilter = button.dataset.filter;
    container.querySelectorAll("button").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    renderProjects(activeFilter);
  });
}

function registerGsap() {
  if (!gsapApi || !ScrollTrigger) return false;
  gsapApi.registerPlugin(ScrollTrigger);
  return true;
}

function initIntroMotion(skipLoader = false) {
  splitTitle();

  if (!registerGsap() || prefersReducedMotion) {
    document.querySelector(".motion-loader")?.remove();
    return;
  }

  const tl = gsapApi.timeline({
    defaults: { ease: "power4.out" },
    onComplete: () => document.querySelector(".motion-loader")?.remove(),
  });

  const introTargets = [".site-header", ".hero-index", ".motion-item", ".motion-panel"];

  tl.set(introTargets, { autoAlpha: 0 })
    .set(".hero-title .char", { yPercent: 110, rotate: 3 })
    .set(".motion-panel", { clipPath: "inset(0 0 100% 0)", y: 36 });

  if (!skipLoader && document.querySelector(".motion-loader")) {
    tl.to(".loader-line", { "--loader-scale": 1, duration: 0.72, ease: "expo.inOut" })
      .to(".motion-loader span", { y: -12, autoAlpha: 0, duration: 0.32 }, "-=0.16")
      .to(".motion-loader", { yPercent: -100, duration: 0.82, ease: "expo.inOut" }, "-=0.02");
  }

  tl.to(".site-header", { autoAlpha: 1, y: 0, duration: 0.54 }, "-=0.35")
    .to(".hero-index", { autoAlpha: 1, y: 0, duration: 0.44 }, "-=0.42")
    .to(
      ".hero-title .char",
      {
        yPercent: 0,
        rotate: 0,
        duration: 1.0,
        stagger: 0.028,
      },
      "-=0.3",
    )
    .to("[data-motion='clip']", { autoAlpha: 1, y: 0, duration: 0.52 }, "-=0.88")
    .to(
      "[data-motion='lift']",
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.72,
        stagger: 0.08,
      },
      "-=0.68",
    )
    .to(
      ".motion-panel",
      {
        autoAlpha: 1,
        clipPath: "inset(0 0 0% 0)",
        y: 0,
        duration: 0.84,
        ease: "expo.out",
      },
      "-=0.76",
    )
    .to(".motion-panel", { "--panel-line-scale": 1, duration: 0.62 }, "-=0.5");
}

function initScrollMotion() {
  if (!gsapApi || !ScrollTrigger || prefersReducedMotion) return;

  gsapApi.to(".scroll-rail span", {
    scaleY: 1,
    ease: "none",
    scrollTrigger: {
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.35,
    },
  });

  gsapApi.to(".hero-marquee span", {
    xPercent: -100,
    ease: "none",
    repeat: -1,
    duration: 18,
  });

  gsapApi.to(".hero", {
    "--hero-orbit-rotate": "28deg",
    "--hero-orbit-y": "70px",
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  document.querySelectorAll(".metric").forEach((metric, index) => {
    gsapApi.from(metric, {
      y: 34,
      autoAlpha: 0,
      duration: 0.72,
      delay: index * 0.04,
      ease: "power3.out",
      scrollTrigger: {
        trigger: metric,
        start: "top 88%",
      },
    });
    gsapApi.to(metric, {
      "--line-scale": 1,
      scrollTrigger: {
        trigger: metric,
        start: "top 88%",
      },
    });
  });

  document.querySelectorAll(".motion-section").forEach((section) => {
    gsapApi.from(section.children, {
      y: 42,
      autoAlpha: 0,
      duration: 0.82,
      stagger: 0.08,
      ease: "power4.out",
      scrollTrigger: {
        trigger: section,
        start: "top 82%",
      },
    });
  });

  gsapApi.from(".cv-summary, .cv-block", {
    y: 48,
    autoAlpha: 0,
    duration: 0.78,
    stagger: 0.08,
    ease: "power4.out",
    scrollTrigger: {
      trigger: ".cv-layout",
      start: "top 82%",
    },
  });
}

function animateProjectRows() {
  if (!gsapApi || prefersReducedMotion) return;
  gsapApi.fromTo(
    "#project-list > *",
    { y: 28, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.62,
      stagger: 0.045,
      ease: "power3.out",
      overwrite: true,
    },
  );
}

function animatePreview() {
  if (!gsapApi || prefersReducedMotion) return;
  gsapApi.fromTo(
    "#preview-panel .preview-frame",
    { rotateX: 4, rotateY: -3, scale: 0.985, autoAlpha: 0.72 },
    { rotateX: 0, rotateY: 0, scale: 1, autoAlpha: 1, duration: 0.42, ease: "power3.out" },
  );
  gsapApi.fromTo(
    "#preview-panel .preview-copy > *",
    { y: 14, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 0.42, stagger: 0.05, ease: "power3.out" },
  );
}

function setCursorState(active) {
  if (!gsapApi || prefersReducedMotion || window.innerWidth < 980) return;
  gsapApi.to(".cursor-orbit", {
    scale: active ? 1.9 : 1,
    borderColor: active ? "rgba(0, 255, 179, 0.85)" : "rgba(223, 255, 0, 0.72)",
    duration: 0.25,
    ease: "power2.out",
  });
}

function initCursor() {
  if (!gsapApi || prefersReducedMotion || window.innerWidth < 980) return;

  const cursor = document.querySelector(".cursor-orbit");
  if (!cursor) return;
  document.body.classList.add("motion-cursor");

  const quickX = gsapApi.quickTo(cursor, "x", { duration: 0.28, ease: "power3.out" });
  const quickY = gsapApi.quickTo(cursor, "y", { duration: 0.28, ease: "power3.out" });

  window.addEventListener("pointermove", (event) => {
    quickX(event.clientX);
    quickY(event.clientY);
  });

  document.querySelectorAll("a, button, .project-row, .cv-item, .skill-grid article").forEach((node) => {
    node.addEventListener("mouseenter", () => setCursorState(true));
    node.addEventListener("mouseleave", () => setCursorState(false));
  });
}

function initCanvas() {
  const canvas = document.querySelector("#archive-canvas");
  const context = canvas?.getContext("2d");
  if (!canvas || !context) return;

  let width = 0;
  let height = 0;
  let pointerX = 0.72;
  let pointerY = 0.28;
  let raf = null;

  function resize() {
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * scale);
    canvas.height = Math.floor(height * scale);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(scale, 0, 0, scale, 0, 0);
  }

  function draw(time = 0) {
    context.clearRect(0, 0, width, height);
    context.fillStyle = "rgba(5, 5, 6, 0.7)";
    context.fillRect(0, 0, width, height);

    const grid = width < 720 ? 44 : 62;
    context.strokeStyle = "rgba(242, 242, 234, 0.055)";
    context.lineWidth = 1;
    for (let x = -grid; x < width + grid; x += grid) {
      context.beginPath();
      context.moveTo(x + ((time * 0.006) % grid), 0);
      context.lineTo(x + ((time * 0.006) % grid), height);
      context.stroke();
    }
    for (let y = -grid; y < height + grid; y += grid) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }

    const glowX = width * pointerX;
    const glowY = height * pointerY;
    const radius = Math.min(width, height) * 0.46;
    const gradient = context.createRadialGradient(glowX, glowY, 0, glowX, glowY, radius);
    gradient.addColorStop(0, "rgba(223, 255, 0, 0.13)");
    gradient.addColorStop(0.32, "rgba(0, 255, 179, 0.045)");
    gradient.addColorStop(1, "rgba(5, 5, 6, 0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    if (!prefersReducedMotion) raf = window.requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (event) => {
    pointerX = event.clientX / Math.max(width, 1);
    pointerY = event.clientY / Math.max(height, 1);
  });

  resize();
  draw();

  if (prefersReducedMotion && raf) {
    window.cancelAnimationFrame(raf);
  }
}

renderLanguage();
initLanguageToggle();
initFilterEvents();
initIntroMotion();
initScrollMotion();
initCursor();
initCanvas();
