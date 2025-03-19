
/**
 * Helper functions for animations and intersection observers
 */

export const setupScrollAnimation = (
  selector: string = '.animate-on-scroll',
  threshold: number = 0.1,
  rootMargin: string = '0px 0px -100px 0px'
): IntersectionObserver => {
  const elementsToAnimate = document.querySelectorAll(selector);
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold, rootMargin });
  
  elementsToAnimate.forEach((element) => {
    observer.observe(element);
  });
  
  return observer;
};

export const animateElement = (
  element: HTMLElement,
  animationClass: string,
  duration: number = 300
): void => {
  element.classList.add(animationClass);
  
  setTimeout(() => {
    element.classList.remove(animationClass);
  }, duration);
};
