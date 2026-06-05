import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollReveal() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    gsap.defaults({ ease: 'power3.out', duration: 1 });

    const sections = gsap.utils.toArray<HTMLElement>('[data-reveal]');
    sections.forEach((section) => {
      const children = section.querySelectorAll<HTMLElement>('[data-reveal-child]');
      const direction = section.dataset.reveal || 'up';

      let fromVars: gsap.TweenVars = { opacity: 0, y: 60 };
      if (direction === 'left') fromVars = { opacity: 0, x: -80 };
      else if (direction === 'right') fromVars = { opacity: 0, x: 80 };
      else if (direction === 'scale') fromVars = { opacity: 0, scale: 0.9 };

      if (children.length > 0) {
        gsap.set(children, fromVars);
        ScrollTrigger.create({
          trigger: section,
          start: 'top 80%',
          onEnter: () => {
            gsap.to(children, {
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.12,
              ease: 'power3.out',
              overwrite: 'auto',
            });
          },
          once: true,
        });
      } else {
        gsap.set(section, fromVars);
        ScrollTrigger.create({
          trigger: section,
          start: 'top 80%',
          onEnter: () => {
            gsap.to(section, {
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
              duration: 0.9,
              ease: 'power3.out',
              overwrite: 'auto',
            });
          },
          once: true,
        });
      }
    });

    const counters = gsap.utils.toArray<HTMLElement>('[data-counter]');
    counters.forEach((el) => {
      const target = parseInt(el.dataset.counter || '0', 10);
      const obj = { val: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(obj, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = Math.round(obj.val) + '+';
            },
          });
        },
        once: true,
      });
    });

    const parallaxElements = gsap.utils.toArray<HTMLElement>('[data-parallax]');
    parallaxElements.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax || '0.3');
      gsap.to(el, {
        y: () => ScrollTrigger.maxScroll(window) * speed * -0.1,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });
    });

    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);
}
