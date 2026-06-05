import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollReveal() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1px)', () => {
      // Hero entrance animation on page load
      const heroSection = document.getElementById('inicio');
      if (heroSection) {
        const heroH1 = heroSection.querySelector('h1');
        const heroP = heroSection.querySelector('p');
        const heroA = heroSection.querySelector('a[href="#propiedades"]');
        const heroSearch = heroSection.querySelector('.max-w-3xl');

        const heroTl = gsap.timeline({ delay: 0.3 });

        if (heroH1) {
          gsap.set(heroH1, { opacity: 0, y: 80, scale: 0.95 });
          heroTl.to(heroH1, { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power4.out' });
        }
        if (heroP) {
          gsap.set(heroP, { opacity: 0, y: 40 });
          heroTl.to(heroP, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6');
        }
        if (heroA) {
          gsap.set(heroA, { opacity: 0, y: 30 });
          heroTl.to(heroA, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4');
        }
        if (heroSearch) {
          gsap.set(heroSearch, { opacity: 0, y: 50 });
          heroTl.to(heroSearch, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.3');
        }
      }

      // Section scroll reveals
      const sections = gsap.utils.toArray<HTMLElement>('[data-reveal]');
      sections.forEach((section) => {
        const children = section.querySelectorAll<HTMLElement>('[data-reveal-child]');
        const direction = section.dataset.reveal || 'up';

        const getFromVars = (): gsap.TweenVars => {
          switch (direction) {
            case 'left': return { opacity: 0, x: -100 };
            case 'right': return { opacity: 0, x: 100 };
            case 'scale': return { opacity: 0, scale: 0.85 };
            default: return { opacity: 0, y: 80 };
          }
        };

        if (children.length > 0) {
          gsap.set(children, getFromVars());

          ScrollTrigger.create({
            trigger: section,
            start: 'top 85%',
            onEnter: () => {
              gsap.to(children, {
                opacity: 1,
                y: 0,
                x: 0,
                scale: 1,
                duration: 1,
                stagger: 0.15,
                ease: 'power3.out',
                overwrite: 'auto',
              });
            },
            once: true,
          });
        } else {
          gsap.set(section, getFromVars());

          ScrollTrigger.create({
            trigger: section,
            start: 'top 85%',
            onEnter: () => {
              gsap.to(section, {
                opacity: 1,
                y: 0,
                x: 0,
                scale: 1,
                duration: 1.1,
                ease: 'power3.out',
                overwrite: 'auto',
              });
            },
            once: true,
          });
        }
      });

      // Animated counters
      const counters = gsap.utils.toArray<HTMLElement>('[data-counter]');
      counters.forEach((el) => {
        const target = parseInt(el.dataset.counter || '0', 10);
        const obj = { val: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          onEnter: () => {
            gsap.to(obj, {
              val: target,
              duration: 2.2,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = Math.round(obj.val) + '+';
              },
            });
          },
          once: true,
        });
      });

      // Parallax depth on images
      const parallaxElements = gsap.utils.toArray<HTMLElement>('[data-parallax]');
      parallaxElements.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || '0.3');
        gsap.to(el, {
          y: () => 100 * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
      });

      ScrollTrigger.refresh();
    });

    return () => {
      mm.revert();
    };
  }, []);
}
