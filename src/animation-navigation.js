import gsap from "gsap"
import ScrollToPlugin from "gsap/ScrollToPlugin"
import Observer from "gsap/Observer"

gsap.registerPlugin(ScrollToPlugin, Observer)

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

  // Header change
  if (index >= 3) {
    header.classList.add("header-dark")
  }
  // Sinon (Intro ou Footer), on remet le header en blanc
  else {
    header.classList.remove("header-dark")
  }

  // Animation mouvement
  gsap.to(window, {
    scrollTo: { y: index * window.innerHeight },
    duration: 1,
    ease: "power2.inOut",

    // Quand fini
    onComplete: () => {
      isAnimating = false
    },
  })
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
