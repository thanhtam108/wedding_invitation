window.onload = () => {
  // MASTER INTRO TIMELINE
  const intro = gsap.timeline({
    defaults: {
      ease: "power3.out",
    },
  });

  // Title: top -> down
  intro.fromTo(
    "#title",
    { y: -40, opacity: 0 },
    { y: 0, opacity: 1, duration: 3 },
    0
  );

  // Decorative line: fade in
  intro.fromTo("#line", { opacity: 0 }, { opacity: 1, duration: 3 }, 0);

  // Groom: left -> right
  intro.fromTo(
    "#groom",
    { x: -60, opacity: 0 },
    { x: 0, opacity: 1, duration: 6.5 },
    0
  );

  // Ampersand: fade only
  intro.fromTo("#amp", { opacity: 0 }, { opacity: 1, duration: 5 }, 0);

  // Bride: right -> left
  intro.fromTo(
    "#bride",
    { x: 60, opacity: 0 },
    { x: 0, opacity: 1, duration: 6.5 },
    0
  );

  // Date: bottom -> top
  intro.fromTo(
    "#date",
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 3, delay: 1.5 },
    0
  );

  // ENVELOPE IDLE ENTRANCE
  intro.fromTo(
    ".wrapper",
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 5 },
    0
  );

  // Grab music and UI elements early so the scroll trigger can attempt autoplay
  const music = document.getElementById("bg-music");
  const musicBtn = document.getElementById("music-btn");
  const topBtn = document.getElementById("top-btn");

  let isPlaying = false;

  // Register ScrollTrigger and animate details section when it scrolls into view
  gsap.registerPlugin(ScrollTrigger);

  const detailsTL = gsap.timeline({
    defaults: { ease: "power3.out" },
    scrollTrigger: {
      trigger: "#details",
      start: "top 80%",
      once: true,
      onEnter: () => {
        // Try to start music when the user scrolls to the details section
        tryPlayMusic();
      },
    },
  });

  detailsTL.fromTo(
    "#details-line",
    { opacity: 0 },
    { opacity: 1, duration: 0.8 },
    0
  );

  detailsTL.fromTo(
    "#intro",
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8 },
    0.1
  );

  detailsTL.fromTo(
    ".details-groom",
    { x: -40, opacity: 0 },
    { x: 0, opacity: 1, duration: 1.1 },
    0.2
  );

  detailsTL.fromTo(
    ".details-amp",
    { opacity: 0 },
    { opacity: 1, duration: 0.9 },
    0.35
  );

  detailsTL.fromTo(
    ".details-bride",
    { x: 40, opacity: 0 },
    { x: 0, opacity: 1, duration: 1.1 },
    0.2
  );

  detailsTL.fromTo(
    ".details-family",
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.9 },
    0.6
  );

  /* music elements declared earlier (used by scroll trigger) */

  // Try to play music helper (used by on-load, scroll trigger, and first-scroll)
  const tryPlayMusic = () => {
    if (!music || isPlaying) return;
    const p = music.play();
    if (p !== undefined) {
      p.then(() => {
        isPlaying = true;
        if (musicBtn) {
          musicBtn.textContent = "❚❚";
          musicBtn.classList.remove("pulse");
        }
      }).catch(() => {
        // Autoplay blocked — add a visual cue for user interaction
        if (musicBtn) {
          musicBtn.textContent = "♪";
          musicBtn.classList.add("pulse");
        }
      });
    } else {
      // play() returned undefined in some browsers — assume playing
      isPlaying = true;
      if (musicBtn) {
        musicBtn.textContent = "❚❚";
        musicBtn.classList.remove("pulse");
      }
    }
  };

  // Attempt autoplay on first user scroll (one-time)
  window.addEventListener(
    "scroll",
    function onFirstScroll() {
      tryPlayMusic();
      window.removeEventListener("scroll", onFirstScroll);
    },
    { passive: true, once: true }
  );

  // Attempt autoplay on load
  tryPlayMusic();

  // Music toggle
  musicBtn.addEventListener("click", () => {
    if (!isPlaying) {
      const p = music.play();
      if (p !== undefined) {
        p.then(() => {
          isPlaying = true;
          musicBtn.textContent = "❚❚";
          musicBtn.classList.remove("pulse");
        }).catch(() => {
          // still blocked
          musicBtn.classList.add("pulse");
        });
      } else {
        // Play returned undefined; assume playing
        isPlaying = true;
        musicBtn.textContent = "❚❚";
        musicBtn.classList.remove("pulse");
      }
    } else {
      music.pause();
      isPlaying = false;
      musicBtn.textContent = "♪";
    }
  });

  // Back to top
  topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Show / hide back-to-top button
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      topBtn.classList.remove("opacity-0", "pointer-events-none");
    } else {
      topBtn.classList.add("opacity-0", "pointer-events-none");
    }
  });

  // Envelope size customization via data attributes (data-env-width / data-env-height)
  const wrapper = document.querySelector(".wrapper");
  if (wrapper) {
    const setVar = (el, dataKey, cssVar) => {
      const v = el.dataset[dataKey];
      if (!v) return;
      // allow plain integers or decimals (treated as px) or full CSS values ("22rem", "50vw", "320px")
      const cssVal = /^(\d+(\.\d+)?|\d+)$/.test(v) ? `${v}px` : v;
      el.style.setProperty(cssVar, cssVal);
    };
    setVar(wrapper, "envWidth", "--env-width");
    setVar(wrapper, "envHeight", "--env-height");
  }

  // Trigger envelope open along with intro animations
  if (wrapper && typeof intro !== "undefined") {
    // Open envelope at the start of the intro timeline so opening happens simultaneously with text animations
    intro.call(() => wrapper.classList.add("open"), null, 0);
  }
};
