const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const revealGroups = [
  { selector: ".about-content > *", type: "from-left", step: 90 },
  { selector: ".about-media", type: "panel" },
  { selector: ".values-media", type: "panel" },
  { selector: ".values-content > .section-label, .values-content > .values-title", type: "from-right", step: 90 },
  { selector: ".values-list > p", type: "from-right", step: 80 },
  { selector: ".services-heading > *", type: "up", step: 90 },
  { selector: ".service-card", type: "up", step: 70 },
  { selector: ".capabilities-header > *", type: "up", step: 90 },
  { selector: ".capability-card", type: "up", step: 55, maxDelay: 220 },
  { selector: ".capabilities-controls", type: "scale" },
  { selector: ".portfolio-heading > *", type: "up", step: 80 },
  { selector: ".portfolio-filters", type: "up", delay: 110 },
  { selector: ".portfolio-card", type: "up", step: 55, maxDelay: 220 },
  { selector: ".impact-heading > *", type: "up", step: 90 },
  { selector: ".impact-stat", type: "up", step: 70 },
  { selector: ".contact-content > *", type: "from-left", step: 80 },
  { selector: ".contact-form", type: "from-right", delay: 100 },
  { selector: ".map-heading > *", type: "up", step: 80 },
  { selector: ".map-frame", type: "scale", delay: 80 },
];

const revealElements = [];

revealGroups.forEach(({ selector, type, step = 0, delay = 0, maxDelay = Infinity }) => {
  document.querySelectorAll(selector).forEach((element, index) => {
    element.dataset.reveal = type;
    element.style.setProperty("--reveal-delay", `${Math.min(delay + (index * step), maxDelay)}ms`);
    revealElements.push(element);
  });
});

if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-revealed"));
} else {
  document.documentElement.classList.add("motion-ready");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-revealed");
      observer.unobserve(entry.target);
      window.setTimeout(() => entry.target.style.removeProperty("--reveal-delay"), 1000);
    });
  }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
  revealElements.forEach((element) => revealObserver.observe(element));
}

/* Preserve the existing repeating counter behaviour. */
const impactSection = document.querySelector(".impact-section");
const impactCounters = impactSection ? [...impactSection.querySelectorAll("[data-counter-target]")] : [];

if (impactSection && impactCounters.length) {
  const countDuration = 5000;
  const repeatDelay = 3000;
  let animationFrame = 0;
  let repeatTimer = 0;
  let isVisible = false;

  const resetCounters = () => impactCounters.forEach((counter) => { counter.textContent = "1"; });
  const stopCounterLoop = () => {
    window.cancelAnimationFrame(animationFrame);
    window.clearTimeout(repeatTimer);
    animationFrame = 0;
    repeatTimer = 0;
  };

  const runCounters = () => {
    if (!isVisible) return;
    const startedAt = performance.now();
    resetCounters();

    const update = (now) => {
      if (!isVisible) return;
      const progress = Math.min((now - startedAt) / countDuration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      impactCounters.forEach((counter) => {
        const target = Number(counter.dataset.counterTarget);
        counter.textContent = String(1 + Math.round((target - 1) * easedProgress));
      });
      if (progress < 1) animationFrame = window.requestAnimationFrame(update);
      else repeatTimer = window.setTimeout(runCounters, repeatDelay);
    };
    animationFrame = window.requestAnimationFrame(update);
  };

  const impactObserver = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    stopCounterLoop();
    if (isVisible) runCounters();
    else resetCounters();
  }, { threshold: 0.08 });
  impactObserver.observe(impactSection);
}
