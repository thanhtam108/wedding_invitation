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

  const music = document.getElementById("bg-music");
  const musicBtn = document.getElementById("music-btn");
  const topBtn = document.getElementById("top-btn");

  let isPlaying = false;

  // Attempt autoplay on load
  if (music) {
    const playPromise = music.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPlaying = true;
          musicBtn.textContent = "❚❚";
          musicBtn.classList.remove("pulse");
        })
        .catch(() => {
          // Autoplay blocked — add a visual cue for user interaction
          musicBtn.textContent = "♪";
          musicBtn.classList.add("pulse");
        });
    }
  }

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
