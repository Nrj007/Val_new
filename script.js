document.addEventListener("DOMContentLoaded", () => {
  const envelopeContainer = document.getElementById("envelopeContainer");
  const envelopeFlap = document.getElementById("envelopeFlap");
  const letterCard = document.getElementById("letterCard");
  const instruction = document.getElementById("instruction");
  const letterScroll = document.querySelector(".letter-scroll");
  const bgMusic = document.getElementById("bgMusic");
  const musicToggle = document.getElementById("musicToggle");

  let isOpen = false;
  let isMusicPlaying = false;

  // Function to attempt playing music
  function attemptPlay() {
    bgMusic.volume = 0.5;
    bgMusic
      .play()
      .then(() => {
        isMusicPlaying = true;
        musicToggle.textContent = "🔊";
        musicToggle.classList.add("playing");
        // Remove global listener if it exists once playing starts
        document.removeEventListener("click", attemptPlay);
      })
      .catch((error) => {
        console.log("Autoplay prevented:", error);
        // If autoplay blocked, ensure next interaction plays it
      });
  }

  // Attempt to play immediately
  attemptPlay();

  // Also play on first document click/interaction to bypass blocking policies
  document.addEventListener("click", attemptPlay, { once: true });

  // Background Hearts Animation
  function createHeart() {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.innerHTML = "❤";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = Math.random() * 1.5 + 0.5 + "rem";
    heart.style.animationDuration = Math.random() * 3 + 5 + "s";
    heart.style.opacity = Math.random() * 0.5 + 0.2;

    document.getElementById("floatingHearts").appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 8000);
  }

  setInterval(createHeart, 400);

  // Music Toggle Functionality
  musicToggle.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent bubbling to document click
    if (isMusicPlaying) {
      bgMusic.pause();
      musicToggle.textContent = "🔇";
      musicToggle.classList.remove("playing");
      isMusicPlaying = false;
    } else {
      bgMusic
        .play()
        .then(() => {
          isMusicPlaying = true;
          musicToggle.textContent = "🔊";
          musicToggle.classList.add("playing");
        })
        .catch((err) => {
          console.log("Audio play failed:", err);
        });
    }
  });

  // Initial Hover Effect on envelope
  gsap.to(envelopeContainer, {
    y: -15,
    duration: 1.8,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  // Opening Sequence
  envelopeContainer.addEventListener("click", () => {
    if (isOpen) return;
    isOpen = true;

    // Ensure music tries to play if it hasn't started yet
    if (!isMusicPlaying) attemptPlay();

    // Stop hovering
    gsap.killTweensOf(envelopeContainer);

    const tl = gsap.timeline();

    // Animation sequence
    tl.to(instruction, {
      opacity: 0,
      duration: 0.4,
    })
      // Open flap
      .to(envelopeFlap, {
        rotateX: 180,
        transformOrigin: "top center",
        duration: 0.8,
        ease: "power2.inOut",
      })
      // Fade out envelope
      .to(
        envelopeContainer,
        {
          opacity: 0,
          scale: 0.8,
          duration: 1,
          ease: "power2.in",
        },
        "-=0.3",
      )
      // Show letter card
      .set(letterCard, {
        visibility: "visible",
      })
      .to(letterCard, {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
      })
      // Fade in the letter content
      .fromTo(
        letterScroll,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 1.5,
          ease: "power2.out",
        },
        "-=0.8",
      );
  });
});
