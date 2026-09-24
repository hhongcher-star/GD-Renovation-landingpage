const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.querySelector(".primary-nav");
const siteHeader = document.querySelector(".site-header");

if (siteHeader) {
  let headerFrame = 0;

  const updateHeader = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
    headerFrame = 0;
  };

  const requestHeaderUpdate = () => {
    if (headerFrame) return;
    headerFrame = window.requestAnimationFrame(updateHeader);
  };

  updateHeader();
  window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
}

if (navToggle && primaryNav) {
  const closeNavigation = () => {
    navToggle.classList.remove("is-open");
    primaryNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
    siteHeader?.classList.remove("menu-open");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.classList.toggle("is-open");
    primaryNav.classList.toggle("is-open", isOpen);
    siteHeader?.classList.toggle("menu-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  primaryNav.addEventListener("click", (event) => {
    if (event.target.closest(".nav-link")) {
      closeNavigation();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      closeNavigation();
    }
  });
}

const contactForm = document.querySelector("#contact-form");
const whatsappFloat = document.querySelector(".whatsapp-float");
const whatsappConfirm = document.querySelector(".whatsapp-confirm");
const whatsappConfirmCancel = document.querySelector(".whatsapp-confirm-cancel");
const whatsappConfirmOpen = document.querySelector(".whatsapp-confirm-open");
const whatsappConfirmBackdrop = document.querySelector(".whatsapp-confirm-backdrop");

whatsappFloat?.addEventListener("click", (event) => {
  event.preventDefault();
  whatsappConfirm.hidden = false;
  document.body.classList.add("whatsapp-confirm-active");
  whatsappConfirmOpen.focus({ preventScroll: true });
});

const closeWhatsAppConfirm = () => {
  if (!whatsappConfirm || whatsappConfirm.hidden) return;
  whatsappConfirm.hidden = true;
  document.body.classList.remove("whatsapp-confirm-active");
  whatsappFloat?.focus({ preventScroll: true });
};

whatsappConfirmCancel?.addEventListener("click", closeWhatsAppConfirm);
whatsappConfirmBackdrop?.addEventListener("click", closeWhatsAppConfirm);

whatsappConfirm?.addEventListener("wheel", (event) => {
  event.preventDefault();
}, { passive: false });

whatsappConfirm?.addEventListener("touchmove", (event) => {
  event.preventDefault();
}, { passive: false });

whatsappConfirmOpen?.addEventListener("click", () => {
  window.open(whatsappFloat.href, "_blank", "noopener,noreferrer");
  closeWhatsAppConfirm();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && whatsappConfirm && !whatsappConfirm.hidden) {
    closeWhatsAppConfirm();
  }
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  const formData = new FormData(contactForm);
  const name = String(formData.get("name") || "").trim();
  const mobile = String(formData.get("mobile") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const enquiry = [
    "Hello GD Renovation, I would like to make an enquiry.",
    `Name: ${name}`,
    `Mobile: ${mobile}`,
    email ? `Email: ${email}` : null,
    `Message: ${message}`,
  ].filter(Boolean).join("\n");

  window.open(`https://wa.me/60126767617?text=${encodeURIComponent(enquiry)}`, "_blank", "noopener,noreferrer");
});

