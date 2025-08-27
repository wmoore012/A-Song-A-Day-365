import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize scroll-based animations and effects
 * Restored from the original nukes-v2 implementation
 */
export function initScrollAnimations() {
  // Check for required dependencies
  if (!gsap || !ScrollTrigger) {
    console.error('Scroll animations require GSAP + ScrollTrigger');
    return;
  }

  // Configure ScrollTrigger for smooth scrolling
  ScrollTrigger.config({
    limitCallbacks: true,
    ignoreMobileResize: false
  });

  // Refresh ScrollTrigger on window resize
  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
  });

  // Set up scroll-triggered animations (restored from nukes-v2)
  setupParallaxLayers();
  setupContentScrollAnimations();
  setupLaserEffects();
  setupScrollRuler();
}

/**
 * Parallax layers system (restored from original nukes-v2)
 */
function setupParallaxLayers() {
  const layers = Array.from(document.querySelectorAll('.parallax-layer'));
  if (!layers.length) return;

  layers.forEach(layer => {
    const speed = parseFloat((layer as HTMLElement).dataset.speed || '0.2');
    gsap.to(layer, {
      yPercent: () => -speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: layer,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });
}

/**
 * Content section scroll animations
 */
function setupContentScrollAnimations() {
  // Animate content sections on scroll
  gsap.utils.toArray('.content-section').forEach((section) => {
    const element = section as HTMLElement;
    gsap.fromTo(element,
      {
        opacity: 0,
        y: 50
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  // Stagger animations for cards/grids
  gsap.utils.toArray('.card-grid .card').forEach((card, index) => {
    const element = card as HTMLElement;
    gsap.fromTo(element,
      {
        opacity: 0,
        y: 30
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        delay: index * 0.1
      }
    );
  });
}

/**
 * Laser effects (restored from original nukes-v2)
 */
function setupLaserEffects() {
  const lasers = Array.from(document.querySelectorAll('.scroll-laser'));
  const deck = document.querySelector('.laser-deck');

  if (!lasers.length || !deck) return;

  const sweepLasers = () => {
    if (!deck || !lasers.length) return;
    const h = (deck as HTMLElement).clientHeight || window.innerHeight;

    lasers.forEach((el, i) => {
      const y = (i + 1) * (h / (lasers.length + 1));
      gsap.fromTo(el,
        { y: y - 16, opacity: 0 },
        { y: y, opacity: 0.7, duration: 0.28, ease: 'power1.out',
          onComplete: () => {
            gsap.to(el, { opacity: 0, duration: 0.22, ease: 'power1.in' });
          }
        }
      );

      const speed = parseFloat((el as HTMLElement).dataset.speed || (0.2 + i * 0.15).toString());
      gsap.to(el, {
        y: `+=${speed * 200}`,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        }
      });
    });
  };

  // Trigger laser sweep when entering content sections
  gsap.utils.toArray('.content-section').forEach((section) => {
    const element = section as HTMLElement;
    ScrollTrigger.create({
      trigger: element,
      start: 'top 80%',
      onEnter: sweepLasers,
      onEnterBack: sweepLasers
    });
  });

  // Initial sweep
  sweepLasers();
}

/**
 * Scroll ruler system (restored from original nukes-v2)
 */
function setupScrollRuler() {
  const ruler = document.getElementById('scroll-ruler');
  if (!ruler) return;

  const marker = ruler.querySelector('.marker');
  if (!marker) return;

  const onScrollResize = () => {
    const d = document.documentElement.scrollHeight;
    const y = window.scrollY;
    const vh = window.innerHeight;

    const total = Math.max(1, d - vh);
    const p = Math.min(1, Math.max(0, y / total));
    const yvh = p * 100;

    (marker as HTMLElement).style.transform = `translateY(${yvh}vh)`;
  };

  onScrollResize();
  window.addEventListener('scroll', onScrollResize, { passive: true });
  window.addEventListener('resize', onScrollResize);
}

/**
 * Utility function to create scroll-triggered reveals
 */
export function createScrollReveal(
  trigger: string | Element,
  animation: gsap.TweenVars,
  options: ScrollTrigger.Vars = {}
) {
  const defaultOptions: ScrollTrigger.Vars = {
    trigger,
    start: 'top 80%',
    end: 'bottom 20%',
    toggleActions: 'play none none reverse',
    ...options
  };

  return gsap.fromTo(
    trigger,
    {
      opacity: 0,
      y: 30,
      ...animation
    },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: defaultOptions
    }
  );
}

/**
 * Pin elements during scroll
 */
export function createScrollPin(
  element: string | Element,
  options: ScrollTrigger.Vars = {}
) {
  return ScrollTrigger.create({
    trigger: element,
    pin: true,
    start: 'top top',
    end: 'bottom top',
    ...options
  });
}

/**
 * Clean up scroll animations
 */
export function cleanupScrollAnimations() {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
}
