const demoCards = [
  {
    kicker: "会社を知る",
    title: "なぜこの事業をやるのか",
    text: "市場の課題、顧客に届けている価値、会社が大切にしている判断軸を短く学びます。",
    progress: 20,
  },
  {
    kicker: "仕事を知る",
    title: "募集職種の役割を理解する",
    text: "担当する業務、期待される成果、入社後に関わるチームを応募前に確認します。",
    progress: 40,
  },
  {
    kicker: "現場のリアル",
    title: "働き方と一日の流れを見る",
    text: "きれいな魅力だけでなく、忙しさ、難しさ、やりがいまで含めて現場の実感を伝えます。",
    progress: 60,
  },
  {
    kicker: "4択テスト",
    title: "この仕事で大切な姿勢は？",
    text: "候補者が仕事の前提を理解できているか、軽い確認テストで応募前に整理します。",
    progress: 80,
  },
  {
    kicker: "応募ステップ解放",
    title: "理解した人だけが次へ進む",
    text: "学習完了後に応募導線を表示し、面談前の期待値をそろえやすくします。",
    progress: 100,
  },
];

const featuredCards = contentCatalog.filter((item) => item.featured);
const localImageFallback = "assets/vertical-learning-logo-comic-safe-20260820.png";

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

const comicLinesByCategory = {
  "ai-learning": "なるほど！",
  programming: "できた！",
  "business-manner": "伝わった！",
  marketing: "見えてきた！",
  money: "わかった！",
  management: "任せてみよう",
  lifehack: "今日から使える",
  parenting: "大丈夫！",
  english: "Let's try!",
};

function createCoverArt(item, className = "catalog-cover-art", variant = 0) {
  if (item && item.image && item.image.includes("assets/covers/")) {
    const img = createElement("img", `${className} catalog-cover-webp`);
    img.src = item.image;
    img.alt = item.alt || item.title || "";
    img.loading = "lazy";
    return img;
  }
  return createComicCoverArt(item, className, variant);
}

function createComicCoverArt(item, className = "catalog-cover-art", variant = 0) {
  const art = createElement("div", className);
  art.setAttribute("aria-hidden", "true");
  art.dataset.comicVariant = String(variant % 5);

  const panel = createElement("div", "comic-art-panel");
  const burst = createElement("span", "comic-art-burst");
  const bubble = createElement("span", "comic-art-bubble", comicLinesByCategory[item.categoryId] || "読んでみよう！");
  const character = createElement("span", "comic-art-character");
  const hair = createElement("span", "comic-art-hair");
  const face = createElement("span", "comic-art-face");
  const eyes = createElement("span", "comic-art-eyes");
  const body = createElement("span", "comic-art-body");
  const prop = createElement("span", "comic-art-prop");

  character.append(hair, face, eyes, body, prop);
  panel.append(burst, bubble, character);
  art.append(panel);
  return art;
}

function createCatalogRow(category) {
  const section = createElement("section", "content-row catalog-row");
  section.id = `category-${category.id}`;
  section.dataset.categoryId = category.id;
  section.setAttribute("aria-labelledby", `category-${category.id}-title`);

  const heading = createElement("div", "row-heading catalog-row-heading");
  const titleGroup = createElement("div", "catalog-row-title");
  titleGroup.append(
    createElement("span", "catalog-row-code", category.code),
    createElement("h2", "", category.label),
    createElement("p", "", `${category.description} · 全${category.count}コンテンツ`),
  );
  titleGroup.querySelector("h2").id = `category-${category.id}-title`;

  const actions = createElement("div", "catalog-row-actions");
  const shelfLink = createElement("a", "catalog-shelf-link", "すべて見る");
  shelfLink.href = category.shelfUrl;
  shelfLink.target = "_blank";
  shelfLink.rel = "noopener noreferrer";
  shelfLink.setAttribute("aria-label", `${category.label}をまとめて別タブで開く`);

  const controls = createElement("div", "row-controls");
  controls.setAttribute("aria-label", `${category.label}の表示操作`);
  const previous = createElement("button", "", "‹");
  previous.type = "button";
  previous.dataset.railPrev = "";
  previous.setAttribute("aria-label", `${category.label}を前へ`);
  const next = createElement("button", "", "›");
  next.type = "button";
  next.dataset.railNext = "";
  next.setAttribute("aria-label", `${category.label}を次へ`);
  controls.append(previous, next);
  actions.append(shelfLink, controls);
  heading.append(titleGroup, actions);

  const rail = createElement("div", "card-rail catalog-rail");
  rail.dataset.contentRail = "";

  category.entries.forEach((item, index) => {
    const card = createElement("a", "catalog-card content-link");
    card.href = item.href;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.dataset.contentId = item.id;
    card.dataset.categoryId = item.categoryId;
    card.setAttribute("aria-label", `${item.title}を別タブで開く`);

    const cover = createElement("div", "catalog-cover");
    const coverArt = createCoverArt(item, "catalog-cover-art", index);
    const coverKicker = createElement("span", "catalog-cover-kicker", `${item.categoryCode} / 漫画で学ぶ`);
    const format = createElement("span", "catalog-format", "MANGA");
    const coverTitle = createElement("h3", "catalog-cover-title", item.title);
    cover.append(coverArt, coverKicker, format, coverTitle);

    const copy = createElement("div", "catalog-card-copy");
    copy.append(
      createElement("small", "catalog-card-category", item.categoryLabel),
      createElement("p", "", item.meta),
    );
    card.append(cover, copy);
    rail.append(card);
  });

  section.append(heading, rail);
  return section;
}

function renderCatalogRows() {
  const primaryTarget = document.querySelector('[data-category-groups="primary"]');
  const secondaryTarget = document.querySelector('[data-category-groups="secondary"]');
  if (!primaryTarget || !secondaryTarget) return;

  const primaryCategories = categoryCatalog.slice(0, 5);
  const secondaryCategories = categoryCatalog.slice(5);
  primaryTarget.replaceChildren(...primaryCategories.map(createCatalogRow));
  secondaryTarget.replaceChildren(...secondaryCategories.map(createCatalogRow));
}

function renderFeaturedRail() {
  const rail = document.querySelector("[data-feature-rail]");
  if (!rail) return;

  const introThumb = rail.querySelector("[data-feature-intro]");
  rail.replaceChildren(...(introThumb ? [introThumb] : []));

  featuredCards.forEach((item, index) => {
    const button = createElement("button", "featured-thumb");
    button.type = "button";
    button.dataset.featureIndex = String(index);
    button.setAttribute("aria-pressed", "false");
    button.append(
      createCoverArt(item, "featured-thumb-art", index),
      createElement("span", "", item.categoryCode),
      createElement("strong", "", item.title),
      createElement("small", "", "ログイン不要 · 無料"),
    );
    rail.append(button);
  });
}

const contentPortal = document.querySelector(".content-portal");
const featuredShowcase = document.querySelector(".featured-showcase");

renderCatalogRows();

// The opening explains the service. The featured experience appears after visitors have explored the catalog.
const catalogRows = [...document.querySelectorAll(".catalog-row")];
const featuredAnchor = catalogRows[6] || catalogRows.at(-1);
if (contentPortal && featuredShowcase && featuredAnchor) {
  featuredAnchor.after(featuredShowcase);
}

renderFeaturedRail();

function prepareImageFallback(image) {
  if (!image || image.dataset.fallbackReady) return;

  image.dataset.fallbackReady = "true";
  image.addEventListener("error", () => {
    if (image.dataset.fallbackApplied) return;
    image.dataset.fallbackApplied = "true";
    image.src = localImageFallback;
  });

  if (image.complete && image.naturalWidth === 0 && !image.src.endsWith(localImageFallback)) {
    image.src = localImageFallback;
  }
}

document.querySelectorAll("img").forEach(prepareImageFallback);

function hydrateContentCards() {
  document.querySelectorAll("[data-content-id]").forEach((card) => {
    if (card.classList.contains("catalog-card")) return;

    const item = contentById[card.dataset.contentId];
    if (!item) return;

    if (card.matches("a")) card.href = item.href;

    const image = card.querySelector("img");
    if (image) {
      prepareImageFallback(image);
      image.src = item.image;
      image.alt = item.alt;
    }

    const title = card.querySelector("h3, strong");
    if (title) title.textContent = item.title;

    const meta = card.querySelector("p, small");
    if (meta && item.meta) meta.textContent = item.meta;

    const kicker = card.querySelector(":scope > span");
    if (kicker && item.kicker) kicker.textContent = item.kicker;
  });
}

hydrateContentCards();

function refreshRestoredCatalog() {
  renderCatalogRows();
  renderFeaturedRail();
  hydrateContentCards();
  document.querySelectorAll("img").forEach(prepareImageFallback);
}

window.addEventListener("pageshow", (event) => {
  if (event.persisted) refreshRestoredCatalog();
});

const demoCount = document.querySelector("#demo-count");
const demoKicker = document.querySelector("#demo-kicker");
const demoTitle = document.querySelector("#demo-title");
const demoText = document.querySelector("#demo-text");
const demoProgress = document.querySelector(".demo-progress span");
const demoSteps = document.querySelectorAll(".demo-step");

if (demoKicker && demoTitle && demoText && demoCount && demoProgress && demoSteps.length) {
  function setDemoCard(index) {
    const card = demoCards[index];
    demoKicker.textContent = card.kicker;
    demoTitle.textContent = card.title;
    demoText.textContent = card.text;
    demoCount.textContent = `${index + 1} / ${demoCards.length}`;
    demoProgress.style.background = `linear-gradient(90deg, var(--green) ${card.progress}%, #244864 ${card.progress}%)`;

    demoSteps.forEach((step) => {
      const isActive = Number(step.dataset.demo) === index;
      step.classList.toggle("is-active", isActive);
      step.setAttribute("aria-selected", String(isActive));
    });
  }

  demoSteps.forEach((step) => {
    step.addEventListener("click", () => {
      setDemoCard(Number(step.dataset.demo));
    });
  });

  setDemoCard(0);
}

const featuredStage = document.querySelector("[data-feature-stage]");
if (featuredStage) {
  const heroIntro = featuredStage.querySelector("[data-hero-intro]");
  const featuredImage = featuredStage.querySelector("[data-feature-image]");
  const featuredKicker = featuredStage.querySelector("[data-feature-kicker]");
  const featuredTitle = featuredStage.querySelector("[data-feature-title]");
  const featuredSummary = featuredStage.querySelector("[data-feature-summary]");
  const featuredLink = featuredStage.querySelector("[data-feature-link]");
  const featuredSignal = featuredStage.querySelector("[data-feature-signal]");
  const featuredTime = featuredStage.querySelector("[data-feature-time]");
  const featuredNextStep = featuredStage.querySelector("[data-feature-next-step]");
  const featuredThumbs = document.querySelectorAll("[data-feature-index]");
  const introThumb = document.querySelector("[data-feature-intro]");
  const featuredPrevButton = document.querySelector("[data-feature-prev]");
  const featuredNextButton = document.querySelector("[data-feature-next-control]");

  let currentIndex = 0;
  let introActive = true;
  let autoplayTimer;

  function clearAutoplay() {
    if (autoplayTimer) window.clearTimeout(autoplayTimer);
  }

  function centerFeaturedThumb(thumb) {
    const rail = thumb?.closest("[data-feature-rail]");
    if (!rail) return;

    const targetLeft = thumb.offsetLeft - (rail.clientWidth - thumb.offsetWidth) / 2;
    rail.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
  }

  function markFeaturedThumbs(activeIndex) {
    featuredThumbs.forEach((thumb) => {
      const isActive = activeIndex !== null && Number(thumb.dataset.featureIndex) === activeIndex;
      thumb.classList.toggle("is-active", isActive);
      thumb.setAttribute("aria-pressed", String(isActive));
      if (isActive) {
        centerFeaturedThumb(thumb);
      }
    });

    if (introThumb) {
      const isIntroActive = activeIndex === null;
      introThumb.classList.toggle("is-active", isIntroActive);
      introThumb.setAttribute("aria-pressed", String(isIntroActive));
      if (isIntroActive) {
        centerFeaturedThumb(introThumb);
      }
    }
  }

  function scheduleAutoplay() {
    clearAutoplay();
    autoplayTimer = window.setTimeout(() => {
      if (introActive) {
        setFeaturedCard(0);
      } else if (currentIndex >= featuredCards.length - 1) {
        showHeroIntro();
      } else {
        setFeaturedCard(currentIndex + 1);
      }
    }, introActive ? 5600 : 7200);
  }

  function showHeroIntro() {
    introActive = true;
    clearAutoplay();
    featuredStage.classList.add("is-intro");
    heroIntro?.setAttribute("aria-hidden", "false");
    markFeaturedThumbs(null);
    scheduleAutoplay();
  }

  function setFeaturedCard(index) {
    introActive = false;
    clearAutoplay();
    featuredStage.classList.remove("is-intro");
    heroIntro?.setAttribute("aria-hidden", "true");
    currentIndex = (index + featuredCards.length) % featuredCards.length;
    const card = featuredCards[currentIndex];

    if (featuredImage) {
      featuredImage.src = card.image || localImageFallback;
      featuredImage.alt = card.alt || `${card.title}の表紙`;
    }
    featuredStage.dataset.featureCategory = card.categoryId;
    if (featuredKicker) featuredKicker.textContent = card.kicker;
    if (featuredTitle) featuredTitle.textContent = card.title;
    if (featuredSummary) featuredSummary.textContent = card.summary;
    if (featuredLink) {
      featuredLink.href = card.href;
      featuredLink.setAttribute("aria-label", `${card.title}を開く`);
    }
    if (featuredSignal) featuredSignal.textContent = card.signal;
    if (featuredTime) featuredTime.textContent = card.time;
    if (featuredNextStep) featuredNextStep.textContent = card.nextStep;

    markFeaturedThumbs(currentIndex);
    scheduleAutoplay();
  }

  introThumb?.addEventListener("click", showHeroIntro);

  featuredThumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      setFeaturedCard(Number(thumb.dataset.featureIndex));
    });
  });

  if (featuredPrevButton) {
    featuredPrevButton.addEventListener("click", () => {
      if (introActive) {
        setFeaturedCard(featuredCards.length - 1);
      } else if (currentIndex === 0) {
        showHeroIntro();
      } else {
        setFeaturedCard(currentIndex - 1);
      }
    });
  }

  if (featuredNextButton) {
    featuredNextButton.addEventListener("click", () => {
      if (introActive) {
        setFeaturedCard(0);
      } else if (currentIndex >= featuredCards.length - 1) {
        showHeroIntro();
      } else {
        setFeaturedCard(currentIndex + 1);
      }
    });
  }

  showHeroIntro();
}

const categoryTabs = document.querySelectorAll(".category-tabs a");

categoryTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    categoryTabs.forEach((item) => item.classList.remove("is-active"));
    tab.classList.add("is-active");
  });
});

const navigatorToggle = document.querySelector("#paperobo-panel-toggle");
const navigatorControls = document.querySelectorAll("label[for='paperobo-panel-toggle']");

if (navigatorToggle && navigatorControls.length) {
  const syncNavigatorState = () => {
    document.body.classList.toggle("navigator-open", navigatorToggle.checked);
  };

  const closeNavigator = () => {
    navigatorToggle.checked = false;
    syncNavigatorState();
  };

  const toggleNavigator = (event) => {
    event.preventDefault();
    navigatorToggle.checked = !navigatorToggle.checked;
    syncNavigatorState();
  };

  navigatorControls.forEach((control) => {
    control.addEventListener("click", toggleNavigator);
    control.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") toggleNavigator(event);
    });
  });

  document.querySelector(".paperobo-open-link")?.addEventListener("click", closeNavigator);

  syncNavigatorState();
}

const searchPanelToggle = document.querySelector("#search-panel-toggle");
const searchPanelControls = document.querySelectorAll("label[for='search-panel-toggle']");
const supportSections = document.querySelectorAll("[data-menu-only]");

const showSupportSection = (targetId) => {
  const targetHeading = document.getElementById(targetId);
  const targetSection = targetHeading?.closest("[data-menu-only]");

  if (!targetSection) return;

  supportSections.forEach((section) => {
    section.classList.toggle("is-menu-visible", section === targetSection);
  });

  if (searchPanelToggle) searchPanelToggle.checked = false;
  window.setTimeout(() => {
    targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 50);
};

if (searchPanelToggle && searchPanelControls.length) {
  searchPanelControls.forEach((control) => {
    control.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        searchPanelToggle.checked = !searchPanelToggle.checked;
      }
    });
  });
}

document.querySelectorAll(".site-menu-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (!searchPanelToggle) return;

    if (link.classList.contains("site-menu-link-search")) {
      event.preventDefault();
      searchPanelToggle.checked = true;
      window.setTimeout(() => {
        document.querySelector("#content-search input[type='search']")?.focus();
      }, 80);
      return;
    }

    if (link.dataset.supportTarget) {
      event.preventDefault();
      showSupportSection(link.dataset.supportTarget);
      return;
    }

    searchPanelToggle.checked = false;
  });
});

document.querySelectorAll("[data-support-target]:not(.site-menu-link)").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showSupportSection(link.dataset.supportTarget);
  });
});

document.querySelectorAll(".content-row").forEach((row) => {
  const rail = row.querySelector("[data-content-rail]");
  const previous = row.querySelector("[data-rail-prev]");
  const next = row.querySelector("[data-rail-next]");

  if (!rail || !previous || !next) return;

  const scrollRail = (direction) => {
    rail.scrollBy({ left: direction * Math.max(rail.clientWidth * 0.82, 240), behavior: "smooth" });
  };

  previous.addEventListener("click", () => scrollRail(-1));
  next.addEventListener("click", () => scrollRail(1));
});

const searchForm = document.querySelector("#content-search");
const searchInput = searchForm?.querySelector("input[type='search']");
const categoryFilter = searchForm?.querySelector("[data-category-filter]");

if (searchForm && searchInput) {
  const filterContent = () => {
    const query = searchInput.value.trim().toLocaleLowerCase();
    const selectedCategory = categoryFilter?.value ?? "";
    let visibleCount = 0;

    document.querySelectorAll(".catalog-row").forEach((row) => {
      let rowVisibleCount = 0;
      row.querySelectorAll(".catalog-card").forEach((card) => {
        const matchesQuery = !query || card.textContent.toLocaleLowerCase().includes(query);
        const matchesCategory = !selectedCategory || card.dataset.categoryId === selectedCategory;
        const isVisible = matchesQuery && matchesCategory;
        card.hidden = !isVisible;
        if (isVisible) rowVisibleCount += 1;
      });
      row.hidden = rowVisibleCount === 0;
      visibleCount += rowVisibleCount;
    });

    document.body.classList.toggle("has-empty-search", visibleCount === 0);
  };

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    filterContent();
  });
  searchInput.addEventListener("input", filterContent);
  categoryFilter?.addEventListener("change", filterContent);
}

const contactForm = document.querySelector("#contact-form");
const formNote = document.querySelector("#form-note");

if (contactForm && formNote) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      formNote.textContent = "必須項目を入力してください。";
      contactForm.reportValidity();
      return;
    }

    formNote.textContent = "ありがとうございます。実運用時はここから送信先へ接続します。";
    contactForm.reset();
  });
}
