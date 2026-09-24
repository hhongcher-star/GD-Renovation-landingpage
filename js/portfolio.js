const servicesTrack = document.querySelector(".services-track");
const serviceCards = servicesTrack ? [...servicesTrack.querySelectorAll(".service-card")] : [];

if (servicesTrack && serviceCards.length) {
  let isTransitioning = false;

  const scrollToCard = (index) => {
    const targetCard = serviceCards[index];
    const targetLeft = targetCard.offsetLeft - servicesTrack.offsetLeft;

    servicesTrack.scrollTo({
      left: targetLeft,
      behavior: "smooth",
    });
  };

  serviceCards.forEach((card, index) => {
    const nextButton = card.querySelector(".service-next");

    nextButton?.addEventListener("click", () => {
      if (isTransitioning) return;

      isTransitioning = true;
      const nextIndex = (index + 1) % serviceCards.length;
      const nextCard = serviceCards[nextIndex];

      card.classList.add("is-transitioning-out");

      window.setTimeout(() => {
        scrollToCard(nextIndex);
        nextCard.classList.add("is-transitioning-in");
        nextCard.querySelector(".service-next")?.focus({ preventScroll: true });
      }, 140);

      window.setTimeout(() => {
        card.classList.remove("is-transitioning-out");
        nextCard.classList.remove("is-transitioning-in");
        isTransitioning = false;
      }, 720);
    });
  });
}

const capabilitiesTrack = document.querySelector(".capabilities-track");
const capabilityCards = capabilitiesTrack ? [...capabilitiesTrack.querySelectorAll(".capability-card")] : [];
const capabilityPrev = document.querySelector(".capabilities-prev");
const capabilityNext = document.querySelector(".capabilities-next");
const capabilityCount = document.querySelector(".capabilities-count span");

if (capabilitiesTrack && capabilityCards.length) {
  let activeCapability = 0;

  const goToCapability = (index) => {
    activeCapability = (index + capabilityCards.length) % capabilityCards.length;
    const target = capabilityCards[activeCapability];

    capabilitiesTrack.scrollTo({
      left: target.offsetLeft - capabilitiesTrack.offsetLeft,
      behavior: "smooth",
    });

    if (capabilityCount) {
      capabilityCount.textContent = String(activeCapability + 1).padStart(2, "0");
    }
    capabilitiesTrack.parentElement?.style.setProperty("--capability-progress", `${((activeCapability + 1) / capabilityCards.length) * 100}%`);
  };

  capabilityPrev?.addEventListener("click", () => goToCapability(activeCapability - 1));
  capabilityNext?.addEventListener("click", () => goToCapability(activeCapability + 1));

  let scrollFrame;
  capabilitiesTrack.addEventListener("scroll", () => {
    window.cancelAnimationFrame(scrollFrame);
    scrollFrame = window.requestAnimationFrame(() => {
      const trackLeft = capabilitiesTrack.getBoundingClientRect().left;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      capabilityCards.forEach((card, index) => {
        const distance = Math.abs(card.getBoundingClientRect().left - trackLeft);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      activeCapability = closestIndex;
      if (capabilityCount) {
        capabilityCount.textContent = String(activeCapability + 1).padStart(2, "0");
      }
      capabilitiesTrack.parentElement?.style.setProperty("--capability-progress", `${((activeCapability + 1) / capabilityCards.length) * 100}%`);
    });
  }, { passive: true });
}

const portfolioProjects = [
  { slug: "armanee", name: "Armanee", type: "residential", count: 19 },
  { slug: "datum-jelatek", name: "Datum Jelatek", type: "residential", count: 15 },
  { slug: "novum-bangsar-south", name: "Novum Bangsar South", type: "residential", count: 12 },
  { slug: "selayang-residence", name: "Selayang Residence", type: "residential", count: 8 },
  { slug: "the-luxe", name: "The Luxe", type: "residential", count: 45 },
  { slug: "cherry-car-showroom", name: "Cherry Car Showroom", type: "commercial", count: 6, extensions: { 1: "png", 4: "png" } },
  { slug: "empire-damansara-freestore", name: "Empire Damansara FREEstore", type: "commercial", count: 8, extensions: { 1: "png", 3: "png", 8: "png" } },
  { slug: "honey-land-bangsar", name: "Honey Land Bangsar Shopping Centre", type: "commercial", count: 9 },
  { slug: "honey-land-lalaport", name: "Honey Land LaLaport", type: "commercial", count: 8, extensions: { 6: "png", 8: "png" } },
  { slug: "honey-land-pavilion-bukit-jalil", name: "Honey Land Pavilion Bukit Jalil", type: "commercial", count: 7 },
  { slug: "sime-darby-project", name: "Sime Darby Project", type: "commercial", count: 14 },
  { slug: "tt-boutique-salon", name: "T&T Boutique Salon", type: "commercial", count: 4, defaultExtension: "png" },
  { slug: "the-hub-coffee", name: "The Hub Coffee", type: "commercial", count: 15 },
];

const portfolioGrid = document.querySelector(".portfolio-grid");
const portfolioFilters = [...document.querySelectorAll(".portfolio-filter")];
const portfolioViewer = document.querySelector(".portfolio-viewer");

if (portfolioGrid && portfolioViewer) {
  const viewerTitle = portfolioViewer.querySelector("#portfolio-viewer-title");
  const viewerType = portfolioViewer.querySelector(".portfolio-viewer-type");
  const viewerImage = portfolioViewer.querySelector(".portfolio-viewer-image");
  const viewerCount = portfolioViewer.querySelector(".portfolio-viewer-count");
  const viewerFooterCount = portfolioViewer.querySelector(".portfolio-viewer-footer-count");
  const thumbnails = portfolioViewer.querySelector(".portfolio-thumbnails");
  const previousButton = portfolioViewer.querySelector(".portfolio-viewer-prev");
  const nextButton = portfolioViewer.querySelector(".portfolio-viewer-next");
  const closeButtons = [...portfolioViewer.querySelectorAll("[data-close-viewer]")];
  let activeProject = null;
  let activePhoto = 0;
  let returnFocus = null;
  let filterRun = 0;
  const visiblePortfolioCards = new Set();
  const reducePortfolioMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const getProjectImages = (project) => Array.from({ length: project.count }, (_, index) => {
    const number = index + 1;
    const extension = project.extensions?.[number] || project.defaultExtension || "jpg";
    return `assets/images/portfolio/${project.slug}/${String(number).padStart(2, "0")}.${extension}`;
  });

  portfolioProjects.forEach((project, index) => {
    const cover = getProjectImages(project)[0];
    const card = document.createElement("button");
    card.className = "portfolio-card";
    card.type = "button";
    card.dataset.type = project.type;
    card.dataset.projectIndex = String(index);
    card.dataset.coverIndex = "0";
    card.setAttribute("aria-label", `Open ${project.name} project gallery`);
    card.innerHTML = `
      <img src="${cover}" alt="${project.name} completed renovation" loading="lazy">
      <span class="portfolio-card-content">
        <span class="portfolio-card-meta">${project.type} &middot; ${project.count} photos</span>
        <h3>${project.name}</h3>
      </span>`;
    portfolioGrid.append(card);
  });

  const cardVisibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visiblePortfolioCards.add(entry.target);
      else visiblePortfolioCards.delete(entry.target);
    });
  }, { rootMargin: "120px 0px", threshold: 0.05 });

  [...portfolioGrid.children].forEach((card) => cardVisibilityObserver.observe(card));

  const rotatePortfolioCovers = () => {
    if (document.hidden || !visiblePortfolioCards.size) return;

    visiblePortfolioCards.forEach((card) => {
      if (card.hidden || card.dataset.coverLoading === "true" || card.classList.contains("is-filtering-out")) return;

      const project = portfolioProjects[Number(card.dataset.projectIndex)];
      const images = getProjectImages(project);
      const nextIndex = (Number(card.dataset.coverIndex) + 1) % images.length;
      const cardImage = card.querySelector("img");
      const preload = new Image();
      card.dataset.coverLoading = "true";

      preload.onload = () => {
        card.dataset.coverLoading = "false";
        if (card.hidden || !visiblePortfolioCards.has(card)) return;
        card.classList.add("is-cover-changing");

        window.setTimeout(() => {
          cardImage.src = images[nextIndex];
          cardImage.alt = `${project.name} completed renovation, photo ${nextIndex + 1}`;
          card.dataset.coverIndex = String(nextIndex);
          window.requestAnimationFrame(() => card.classList.remove("is-cover-changing"));
        }, reducePortfolioMotion.matches ? 0 : 180);
      };

      preload.onerror = () => { card.dataset.coverLoading = "false"; };
      preload.src = images[nextIndex];
    });
  };

  window.setInterval(rotatePortfolioCovers, 3000);

  const showPhoto = (index) => {
    if (!activeProject) return;
    const images = getProjectImages(activeProject);
    const previousPhoto = activePhoto;
    activePhoto = (index + images.length) % images.length;
    const nextSource = images[activePhoto];

    if (viewerImage.src && !reducePortfolioMotion.matches && previousPhoto !== activePhoto) {
      const movingForward = index > previousPhoto || (previousPhoto === images.length - 1 && activePhoto === 0);
      viewerImage.style.setProperty("--image-direction", movingForward ? "10px" : "-10px");
      viewerImage.classList.add("is-changing");

      const preload = new Image();
      preload.onload = () => {
        viewerImage.src = nextSource;
        window.requestAnimationFrame(() => viewerImage.classList.remove("is-changing"));
      };
      preload.onerror = () => viewerImage.classList.remove("is-changing");
      preload.src = nextSource;
    } else {
      viewerImage.src = nextSource;
    }
    viewerImage.alt = `${activeProject.name} renovation, photo ${activePhoto + 1} of ${images.length}`;
    viewerCount.textContent = `${String(activePhoto + 1).padStart(2, "0")} / ${String(images.length).padStart(2, "0")}`;
    viewerFooterCount.textContent = viewerCount.textContent;
    portfolioViewer.style.setProperty("--portfolio-backdrop", `url("${images[activePhoto]}")`);
    portfolioViewer.style.setProperty("--portfolio-progress", `${((activePhoto + 1) / images.length) * 100}%`);

    [...thumbnails.children].forEach((thumbnail, thumbnailIndex) => {
      const isActive = thumbnailIndex === activePhoto;
      thumbnail.classList.toggle("is-active", isActive);
      thumbnail.setAttribute("aria-current", isActive ? "true" : "false");
      if (isActive) thumbnail.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
  };

  const openProject = (project, trigger) => {
    activeProject = project;
    activePhoto = 0;
    returnFocus = trigger;
    viewerTitle.textContent = project.name;
    viewerType.textContent = `${project.type} project`;
    thumbnails.replaceChildren();

    getProjectImages(project).forEach((src, index) => {
      const button = document.createElement("button");
      button.className = "portfolio-thumbnail";
      button.type = "button";
      button.setAttribute("aria-label", `Show photo ${index + 1}`);
      button.innerHTML = `<img src="${src}" alt="" loading="lazy">`;
      button.addEventListener("click", () => showPhoto(index));
      thumbnails.append(button);
    });

    portfolioViewer.hidden = false;
    document.body.classList.add("portfolio-viewer-open");
    showPhoto(0);
    portfolioViewer.querySelector(".portfolio-viewer-close").focus();
  };

  const closeViewer = () => {
    portfolioViewer.hidden = true;
    document.body.classList.remove("portfolio-viewer-open");
    viewerImage.src = "";
    activeProject = null;
    returnFocus?.focus();
  };

  portfolioGrid.addEventListener("click", (event) => {
    const card = event.target.closest(".portfolio-card");
    if (!card) return;
    openProject(portfolioProjects[Number(card.dataset.projectIndex)], card);
  });

  portfolioFilters.forEach((filterButton) => {
    filterButton.addEventListener("click", () => {
      const filter = filterButton.dataset.filter;
      const currentRun = ++filterRun;
      portfolioFilters.forEach((button) => {
        const isActive = button === filterButton;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });
      const cards = [...portfolioGrid.children];
      const applyFilter = () => {
        if (currentRun !== filterRun) return;
        cards.forEach((card, index) => {
          const shouldHide = filter !== "all" && card.dataset.type !== filter;
          card.hidden = shouldHide;
          card.classList.remove("is-filtering-out", "is-filtering-in");
          if (!shouldHide && !reducePortfolioMotion.matches) {
            card.style.animationDelay = `${Math.min(index * 32, 160)}ms`;
            card.classList.add("is-filtering-in");
          }
        });
      };

      if (reducePortfolioMotion.matches) {
        applyFilter();
      } else {
        cards.filter((card) => !card.hidden).forEach((card) => card.classList.add("is-filtering-out"));
        window.setTimeout(applyFilter, 180);
      }
    });
  });

  portfolioGrid.addEventListener("animationend", (event) => {
    if (!event.target.classList.contains("portfolio-card")) return;
    event.target.classList.remove("is-filtering-in");
    event.target.style.removeProperty("animation-delay");
  });

  previousButton.addEventListener("click", () => showPhoto(activePhoto - 1));
  nextButton.addEventListener("click", () => showPhoto(activePhoto + 1));
  closeButtons.forEach((button) => button.addEventListener("click", closeViewer));

  document.addEventListener("keydown", (event) => {
    if (portfolioViewer.hidden) return;
    if (event.key === "Escape") closeViewer();
    if (event.key === "ArrowLeft") showPhoto(activePhoto - 1);
    if (event.key === "ArrowRight") showPhoto(activePhoto + 1);
  });
}

