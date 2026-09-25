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

  const getCapabilityPageSize = () => {
    const firstCard = capabilityCards[0];
    if (!firstCard) return 1;
    return Math.max(1, Math.round(capabilitiesTrack.clientWidth / firstCard.getBoundingClientRect().width));
  };

  const moveCapability = (direction) => {
    const lastIndex = capabilityCards.length - 1;
    if (direction > 0) {
      goToCapability(activeCapability >= lastIndex ? 0 : Math.min(activeCapability + getCapabilityPageSize(), lastIndex));
    } else {
      goToCapability(activeCapability <= 0 ? lastIndex : Math.max(activeCapability - getCapabilityPageSize(), 0));
    }
  };

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

  capabilityPrev?.addEventListener("click", () => moveCapability(-1));
  capabilityNext?.addEventListener("click", () => moveCapability(1));

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
  { slug: "jia-hayat-villa-1", name: "Jia Hayat Villa 1", type: "residential", count: 22 },
  { slug: "jia-hayat-villa-2", name: "Jia Hayat Villa 2", type: "residential", count: 33 },
  { slug: "4g-cabinet", name: "4G Kitchen Cabinet", type: "residential", count: 11, videoCount: 5, videoExtension: "mp4" },
  { slug: "aman-jalil", name: "Aman Jalil", type: "residential", count: 7, videoCount: 1, videoExtension: "mp4" },
  { slug: "bintang-jalil-brain", name: "Bintang Jalil - Brain", type: "residential", count: 17, videoCount: 7, videoExtension: "mp4" },
  { slug: "bintang-jalil-melvin", name: "Bintang Jalil - Melvin", type: "residential", count: 12, videoCount: 17, videoExtension: "mp4" },
  { slug: "bintang-jalil-wei-xin", name: "Bintang Jalil - Wei Xin", type: "residential", count: 15, videoCount: 5, videoExtension: "mp4" },
  { slug: "bintang-jalil-william", name: "Bintang Jalil - William", type: "residential", count: 19, videoCount: 9, videoExtension: "mp4" },
  { slug: "taman-desa", name: "Taman Desa", type: "residential", count: 56, videoCount: 3, videoExtension: "mp4" },
  { slug: "cherry-car-showroom", name: "Chery Car Showroom", type: "commercial", count: 6, extensions: { 1: "png", 4: "png" } },
  { slug: "empire-damansara-freestore", name: "Empire Damansara FREEstore", type: "commercial", count: 8, extensions: { 1: "png", 3: "png", 8: "png" } },
  { slug: "honey-land-bangsar", name: "Honey Land Bangsar Shopping Centre", type: "commercial", count: 9 },
  { slug: "honey-land-lalaport", name: "Honey Land LaLaport", type: "commercial", count: 8, extensions: { 6: "png", 8: "png" } },
  { slug: "honey-land-pavilion-bukit-jalil", name: "Honey Land Pavilion Bukit Jalil", type: "commercial", count: 7 },
  { slug: "sime-darby-project", name: "Sime Darby Project", type: "commercial", count: 14 },
  { slug: "tt-boutique-salon", name: "T&T Boutique Salon", type: "commercial", count: 4, defaultExtension: "png" },
  { slug: "the-hub-coffee", name: "The Hub Coffee", type: "commercial", count: 15 },
  { slug: "pezzo-pizza-ipc", name: "Pezzo Pizza IPC", type: "commercial", count: 9 },
  { slug: "3d-rendering", name: "3D Rendering", type: "rendering", count: 24 },
  { slug: "social-media-video", name: "Social Media Video", type: "social", count: 0, videoCount: 1, videoExtension: "mp4", videoFile: "01.mp4", coverImage: "assets/images/portfolio/social-media-video/cover-01.webp" },
];

const portfolioGrid = document.querySelector(".portfolio-grid");
const portfolioFilters = [...document.querySelectorAll(".portfolio-filter")];
const portfolioViewer = document.querySelector(".portfolio-viewer");
const portfolioVideoRoot = "assets/videos/portfolio-compressed";
const portfolioGroups = {
  residential: { number: "01", label: "Residential", heading: "Residential projects" },
  commercial: { number: "02", label: "Commercial", heading: "Commercial projects" },
  rendering: { number: "03", label: "3D Rendering", heading: "3D Rendering" },
  social: { number: "04", label: "Social Media Video", heading: "Social Media Video" },
};

if (portfolioGrid && portfolioViewer) {
  const viewerTitle = portfolioViewer.querySelector("#portfolio-viewer-title");
  const viewerType = portfolioViewer.querySelector(".portfolio-viewer-type");
  const viewerImage = portfolioViewer.querySelector(".portfolio-viewer-image");
  const viewerVideo = portfolioViewer.querySelector(".portfolio-viewer-video");
  const viewerCount = portfolioViewer.querySelector(".portfolio-viewer-count");
  const viewerFooterCount = portfolioViewer.querySelector(".portfolio-viewer-footer-count");
  const thumbnails = portfolioViewer.querySelector(".portfolio-thumbnails");
  const previousButton = portfolioViewer.querySelector(".portfolio-viewer-prev");
  const nextButton = portfolioViewer.querySelector(".portfolio-viewer-next");
  const closeButtons = [...portfolioViewer.querySelectorAll("[data-close-viewer]")];
  let activeProject = null;
  let activePhoto = 0;
  let photoRequest = 0;
  let returnFocus = null;
  let filterRun = 0;
  let thumbnailObserver = null;
  const reducePortfolioMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const getProjectImages = (project) => Array.from({ length: project.count }, (_, index) => {
    const number = index + 1;
    return `assets/images/portfolio/${project.slug}/${String(number).padStart(2, "0")}.webp`;
  });

  const getProjectMedia = (project) => {
    const images = getProjectImages(project).map((src) => ({ type: "image", src }));
    const videos = project.videoFile
      ? [{ type: "video", src: `${portfolioVideoRoot}/${project.slug}/${project.videoFile}`, poster: project.coverImage }]
      : Array.from({ length: project.videoCount || 0 }, (_, index) => ({
        type: "video",
        src: `${portfolioVideoRoot}/${project.slug}/${String(index + 1).padStart(2, "0")}.${project.videoExtension || "mp4"}`,
        poster: project.coverImage,
      }));
    return [...images, ...videos];
  };

  const getProjectMeta = (project) => {
    if (!project.count) return `${project.videoCount} ${project.videoCount === 1 ? "video" : "videos"}`;
    const photoLabel = `${project.count} ${project.count === 1 ? "photo" : "photos"}`;
    if (!project.videoCount) return photoLabel;
    return `${photoLabel} · ${project.videoCount} ${project.videoCount === 1 ? "video" : "videos"}`;
  };

  let previousProjectType = "";
  portfolioProjects.forEach((project, index) => {
    if (project.type !== previousProjectType) {
      const group = portfolioGroups[project.type];
      const groupHeading = document.createElement("div");
      groupHeading.className = "portfolio-group-heading";
      groupHeading.dataset.type = project.type;
      groupHeading.id = `portfolio-group-${project.type}`;
      groupHeading.innerHTML = `<span>${group.number}</span><h3>${group.heading}</h3>`;
      portfolioGrid.append(groupHeading);
      previousProjectType = project.type;
    }

    const cover = project.coverImage || `assets/images/portfolio/${project.slug}/cover.webp`;
    const coverMarkup = cover
      ? `<img src="${cover}" alt="${project.name} completed renovation" loading="lazy" decoding="async">`
      : `<video src="${portfolioVideoRoot}/${project.slug}/${project.videoFile || `01.${project.videoExtension || "mp4"}`}" muted playsinline preload="metadata" aria-label="${project.name} preview"></video>`;
    const card = document.createElement("button");
    card.className = "portfolio-card";
    card.type = "button";
    card.dataset.type = project.type;
    card.dataset.projectIndex = String(index);
    card.dataset.coverIndex = "0";
    card.setAttribute("aria-label", `Open ${project.name} project gallery`);
    card.innerHTML = `
      ${coverMarkup}
      <span class="portfolio-card-content">
        <span class="portfolio-card-meta">${portfolioGroups[project.type].label} &middot; ${getProjectMeta(project)}</span>
        <h3>${project.name}</h3>
      </span>
      <span class="portfolio-card-cue" aria-hidden="true"><i class="fa-solid fa-images"></i><span>${project.type === "rendering" ? "View rendering" : project.type === "social" ? "View videos" : "View project"}</span></span>`;
    portfolioGrid.append(card);
  });

  const showPhoto = (index) => {
    if (!activeProject) return;
    const request = ++photoRequest;
    const media = getProjectMedia(activeProject);
    const previousPhoto = activePhoto;
    activePhoto = (index + media.length) % media.length;
    const activeMedia = media[activePhoto];
    const nextSource = activeMedia.src;

    viewerVideo.pause();
    if (activeMedia.type === "video") {
      viewerImage.classList.remove("is-changing");
      viewerImage.hidden = true;
      viewerVideo.hidden = false;
      viewerVideo.src = nextSource;
      if (activeMedia.poster) {
        viewerVideo.poster = activeMedia.poster;
      } else {
        viewerVideo.removeAttribute("poster");
      }
      viewerVideo.setAttribute("aria-label", `${activeProject.name} video ${activePhoto - activeProject.count + 1}`);
      viewerVideo.load();
    } else if (viewerImage.src && !reducePortfolioMotion.matches && previousPhoto !== activePhoto) {
      viewerVideo.hidden = true;
      viewerVideo.removeAttribute("src");
      viewerVideo.removeAttribute("poster");
      viewerVideo.load();
      viewerImage.hidden = false;
      const movingForward = index > previousPhoto || (previousPhoto === media.length - 1 && activePhoto === 0);
      viewerImage.style.setProperty("--image-direction", movingForward ? "10px" : "-10px");
      viewerImage.classList.add("is-changing");

      const preload = new Image();
      preload.onload = () => {
        if (request !== photoRequest) return;
        viewerImage.src = nextSource;
        window.requestAnimationFrame(() => viewerImage.classList.remove("is-changing"));
      };
      preload.onerror = () => {
        if (request === photoRequest) viewerImage.classList.remove("is-changing");
      };
      preload.src = nextSource;
    } else {
      viewerVideo.hidden = true;
      viewerVideo.removeAttribute("src");
      viewerVideo.removeAttribute("poster");
      viewerVideo.load();
      viewerImage.hidden = false;
      viewerImage.src = nextSource;
    }
    viewerImage.alt = activeMedia.type === "image" ? `${activeProject.name} renovation, photo ${activePhoto + 1} of ${activeProject.count}` : "";
    viewerCount.textContent = `${String(activePhoto + 1).padStart(2, "0")} / ${String(media.length).padStart(2, "0")}`;
    viewerFooterCount.textContent = viewerCount.textContent;
    const backdrop = activeMedia.type === "image" ? activeMedia.src : activeMedia.poster || getProjectImages(activeProject)[0];
    portfolioViewer.style.setProperty("--portfolio-backdrop", `url("${backdrop}")`);
    portfolioViewer.style.setProperty("--portfolio-progress", `${((activePhoto + 1) / media.length) * 100}%`);

    const nextMedia = media[(activePhoto + 1) % media.length];
    if (nextMedia.type === "image") {
      const adjacentPreload = new Image();
      adjacentPreload.decoding = "async";
      adjacentPreload.src = nextMedia.src;
    }

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
    viewerType.textContent = project.type === "rendering" || project.type === "social" ? portfolioGroups[project.type].label : `${portfolioGroups[project.type].label} project`;
    thumbnails.replaceChildren();
    thumbnailObserver?.disconnect();
    thumbnailObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const image = entry.target.querySelector("img[data-src]");
        if (image) {
          image.src = image.dataset.src;
          image.removeAttribute("data-src");
        }
        observer.unobserve(entry.target);
      });
    }, { root: thumbnails, rootMargin: "0px 320px", threshold: 0.01 });

    const mediaItems = getProjectMedia(project);
    const hasMultipleMedia = mediaItems.length > 1;
    previousButton.hidden = !hasMultipleMedia;
    nextButton.hidden = !hasMultipleMedia;

    mediaItems.forEach((media, index) => {
      const button = document.createElement("button");
      button.className = "portfolio-thumbnail";
      button.type = "button";
      const mediaNumber = media.type === "image" ? index + 1 : index - project.count + 1;
      button.setAttribute("aria-label", `Show ${media.type} ${mediaNumber}`);
      button.innerHTML = media.type === "image"
        ? `<img data-src="${media.src}" alt="" loading="lazy" decoding="async">`
        : media.poster
          ? `<span class="portfolio-thumbnail-video"><img data-src="${media.poster}" alt="" loading="lazy" decoding="async"><i class="fa-solid fa-play" aria-hidden="true"></i><span>Video ${mediaNumber}</span></span>`
        : `<span class="portfolio-thumbnail-video"><i class="fa-solid fa-play" aria-hidden="true"></i><span>Video ${mediaNumber}</span></span>`;
      button.addEventListener("click", () => showPhoto(index));
      thumbnails.append(button);
      thumbnailObserver.observe(button);
    });

    portfolioViewer.hidden = false;
    document.body.classList.add("portfolio-viewer-open");
    showPhoto(0);
    portfolioViewer.querySelector(".portfolio-viewer-close").focus();
  };

  const keepFocusInViewer = (event) => {
    if (event.key !== "Tab") return;
    const focusable = [...portfolioViewer.querySelectorAll("button:not([hidden]), video[controls]")]
      .filter((element) => !element.disabled && element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const closeViewer = () => {
    photoRequest += 1;
    portfolioViewer.hidden = true;
    document.body.classList.remove("portfolio-viewer-open");
    viewerImage.src = "";
    viewerVideo.pause();
    viewerVideo.removeAttribute("src");
    viewerVideo.removeAttribute("poster");
    viewerVideo.load();
    thumbnailObserver?.disconnect();
    thumbnailObserver = null;
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
      const cards = [...portfolioGrid.querySelectorAll(".portfolio-card")];
      const groupHeadings = [...portfolioGrid.querySelectorAll(".portfolio-group-heading")];
      const applyFilter = () => {
        if (currentRun !== filterRun) return;
        groupHeadings.forEach((heading) => {
          heading.hidden = filter !== "all" && heading.dataset.type !== filter;
        });
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
    keepFocusInViewer(event);
    const media = activeProject ? getProjectMedia(activeProject) : [];
    if (event.key === "Escape") closeViewer();
    if (media.length <= 1) return;
    if (event.key === "ArrowLeft") showPhoto(activePhoto - 1);
    if (event.key === "ArrowRight") showPhoto(activePhoto + 1);
  });
}

