document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".mobile-menu-button");
  const nav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".main-nav a");
  const year = document.getElementById("current-year");
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const updateHeader = () => {
    header?.classList.toggle("scrolled", window.scrollY > 20);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const closeMenu = () => {
    nav?.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  menuButton?.addEventListener("click", () => {
    const isOpen = nav?.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(Boolean(isOpen)));
    document.body.classList.toggle("menu-open", Boolean(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) {
      closeMenu();
    }
  });

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("reveal-visible"));
  }

  if (form) {
    form.addEventListener("submit", async (event) => {
      const action = form.getAttribute("action") || "";

      if (action.includes("VOTRE_IDENTIFIANT")) {
        event.preventDefault();
        formStatus.textContent =
          "Remplacez VOTRE_IDENTIFIANT dans index.html par l’identifiant de votre formulaire Formspree.";
        formStatus.className = "form-status error";
        return;
      }

      event.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      const buttonLabel = submitButton?.querySelector("span");
      const originalLabel = buttonLabel?.textContent || "Envoyer ma demande";

      if (submitButton) {
        submitButton.disabled = true;
      }
      if (buttonLabel) {
        buttonLabel.textContent = "Envoi en cours...";
      }

      formStatus.textContent = "";
      formStatus.className = "form-status";

      try {
        const response = await fetch(action, {
          method: "POST",
          body: new FormData(form),
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("La demande n’a pas pu être envoyée.");
        }

        form.reset();
        formStatus.textContent =
          "Votre demande a bien été envoyée. Nous reviendrons vers vous rapidement.";
        formStatus.className = "form-status success";
      } catch (error) {
        formStatus.textContent =
          "Une erreur est survenue. Vérifiez la configuration Formspree ou réessayez plus tard.";
        formStatus.className = "form-status error";
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
        if (buttonLabel) {
          buttonLabel.textContent = originalLabel;
        }

        if (window.lucide) {
          window.lucide.createIcons();
        }
      }
    });
  }
});
