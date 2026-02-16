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
  musicToggle.addEventListener("click", () => {
    if (isMusicPlaying) {
      bgMusic.pause();
      musicToggle.textContent = "🔇";
      musicToggle.classList.remove("playing");
      isMusicPlaying = false;
    } else {
      bgMusic.play().catch((err) => {
        console.log("Audio play failed:", err);
        alert("Please allow audio to play for the full experience!");
      });
      musicToggle.textContent = "🔊";
      musicToggle.classList.add("playing");
      isMusicPlaying = true;
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

    // Try to play background music
    bgMusic.volume = 0.3; // Set volume to 30%
    if (!isMusicPlaying) {
      bgMusic
        .play()
        .then(() => {
          musicToggle.textContent = "🔊";
          musicToggle.classList.add("playing");
          isMusicPlaying = true;
        })
        .catch((err) => {
          console.log("Auto-play blocked. User can click music button.");
        });
    }

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
