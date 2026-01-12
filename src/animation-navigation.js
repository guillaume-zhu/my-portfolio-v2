import gsap from "gsap"
import ScrollToPlugin from "gsap/ScrollToPlugin"
import Observer from "gsap/Observer"
import { SplitText } from "gsap/SplitText"
import { TextPlugin } from "gsap/TextPlugin"

gsap.registerPlugin(ScrollToPlugin, Observer, SplitText, TextPlugin)

// --------------------------------
// ANIMATION GSAP SCROLL TO
// --------------------------------

// --- Séléction des sections avec la classe .slide ---
const sections = gsap.utils.toArray(".slide")

// --- Séléction header ---
const header = document.querySelector("header")

// --- Mémoire ---
let currentIndex = 0
let isAnimating = false

// --- Split text ---
const presentationSplit = new SplitText(".presentation-text", { type: "chars, words" })
const presentationChars = presentationSplit.chars

gsap.set([presentationChars, ".project-item img"], { opacity: 0 })

// --- Animation ---
const goToSection = (index) => {
  // Sécurité 1 : Si animation active -> ne rien faire
  if (isAnimating) {
    return
  }

  // Sécurité 2 : Si destination non compris dans les slides existantes
  if (index < 0 || index >= sections.length) {
    return
  }

  // Initialisation
  isAnimating = true
  currentIndex = index

  // 1. HEADER CHANGE
  if (index >= 3) {
    header.classList.add("header-dark")
  }
  // Sinon (Intro ou Footer) header en blanc
  else {
    header.classList.remove("header-dark")
  }

  const currentSection = sections[index]

  // 2. PRESENTATION CASCADE
  if (currentSection.classList.contains("presentation")) {
    const tl = gsap.timeline({ delay: 0.4 })

    tl.fromTo(
      presentationChars,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.02,
        ease: "expo.out",
      }
    ).fromTo(
      ".presentation-img-group img",
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
      },
      "-=1.5"
    )
  }

  // 3.PROJECT APPARITION
  if (currentSection.classList.contains("project-item")) {
    const tl = gsap.timeline({ delay: 0.3 })

    const title = currentSection.querySelector("h1")
    const img = currentSection.querySelector("img")
    const h2 = currentSection.querySelector("h2")

    gsap.set([title, img, h2], { opacity: 0 })

    // Animation du petit titre "projets"
    if (h2) {
      tl.fromTo(h2, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
    }

    // Animation du gros titre H1 (Apparition verticale fluide)
    tl.fromTo(
      title,
      {
        opacity: 0,
        y: 100,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power4.out",
      },
      h2 ? "-=0.4" : 0
    )
      // Animation de l'image
      .fromTo(
        img,
        {
          opacity: 0,
          scale: 0.8,
          y: 50,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
        },
        "-=0.8" //
      )
  }

  // 4.NAVIGATION
  gsap.to(window, {
    scrollTo: { y: index * window.innerHeight },
    duration: 1,
    ease: "power2.inOut",

    // Quand fini
    onComplete: () => {
      isAnimating = false
    },
  })

  // 5.TYPEWRITER
  if (currentSection.classList.contains("footer")) {
    typeTimeline.play()
  } else {
    typeTimeline.pause()
  }
}

// --- Détection action ---
Observer.create({
  type: "wheel,touch,pointer",
  preventDefault: true,

  //   Si détecte mouvement vers le haut
  onUp: () => {
    goToSection(currentIndex - 1)
  },

  //   Si détéce mouvement vers le bas
  onDown: () => {
    goToSection(currentIndex + 1)
  },

  tolerance: 10,
})

// --------------------------------
// NAVIGATION HEADER
// --------------------------------
const links = document.querySelectorAll(".nav-link")

links.forEach((link) => {
  link.addEventListener("click", (e) => {
    const indexCible = parseInt(link.dataset.index)

    console.log(indexCible)

    goToSection(indexCible)
  })
})

// --------------------------------
// ANIMATION FOOTER TYPEWRITER
// --------------------------------

const footerProjectText = document.querySelector(".footer-project-text")

const typeTimeline = gsap.timeline({
  repeat: -1,
  repeatDelay: 1,
})

typeTimeline
  .to(footerProjectText, {
    duration: 1.5,
    text: "un projet ?",
    ease: "none",
  })
  .to({}, { duration: 2 })
  .to(footerProjectText, {
    duration: 1,
    text: "",
    ease: "none",
  })
  .to({}, { duration: 0.5 })

// --------------------------------
// GESTION DES HOVERS
// --------------------------------

// 2. Hovers IMAGES DE PROJET
const projectImages = document.querySelectorAll(".project-item img")
projectImages.forEach((img) => {
  img.addEventListener("mouseenter", () => {
    gsap.to(img, { scale: 1.05, duration: 0.5, ease: "power2.out" })
  })
  img.addEventListener("mouseleave", () => {
    gsap.to(img, { scale: 1, duration: 0.5, ease: "power2.out" })
  })
})

// 3. Hovers TITRES H1 DE PROJET
const projectTitles = document.querySelectorAll(".project-item h1")
projectTitles.forEach((h1) => {
  h1.addEventListener("mouseenter", () => {
    gsap.to(h1, { scale: 0.95, duration: 0.4, ease: "power2.out" })
  })
  h1.addEventListener("mouseleave", () => {
    gsap.to(h1, { scale: 1, duration: 0.4, ease: "power2.out" })
  })
})
