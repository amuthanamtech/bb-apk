// scroll-optimization.js - JavaScript optimizations for smooth scrolling in Capacitor Android apps

import React from 'react';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

// ===== SCROLL PERFORMANCE OPTIMIZATIONS =====

// Utility to add passive event listeners for better scroll performance
function addPassiveScrollListener(element, handler) {
  element.addEventListener('scroll', handler, { passive: true, capture: false });
}

// Utility to add passive touch event listeners
function addPassiveTouchListener(element, eventType, handler) {
  element.addEventListener(eventType, handler, {
    passive: true,
    capture: false
  });
}

// Debounce function to prevent excessive scroll event firing
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Global scroll optimization manager
class ScrollOptimizer {
  constructor() {
    this.scrolling = false;
    this.scrollTimeout = null;
    this.init();
  }

  init() {
    // Add scroll class during scrolling to disable heavy effects
    const scrollHandler = () => {
      if (!this.scrolling) {
        document.body.classList.add('scrolling');
        this.scrolling = true;
      }

      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        document.body.classList.remove('scrolling');
        this.scrolling = false;
      }, 150);
    };

    // Use passive listeners for better performance
    addPassiveScrollListener(window, throttle(scrollHandler, 16)); // ~60fps

    // Optimize touch events
    this.optimizeTouchEvents();

    // Prevent scroll blocking
    this.preventScrollBlocking();
  }

  optimizeTouchEvents() {
    // Add passive touchstart and touchmove listeners to prevent blocking
    addPassiveTouchListener(document, 'touchstart', (e) => {
      // Allow default touch behavior
    });

    addPassiveTouchListener(document, 'touchmove', (e) => {
      // Prevent default only if necessary (usually not needed for scrolling)
      // Let the browser handle momentum scrolling naturally
    });

    // Optimize wheel events for desktop
    addPassiveTouchListener(document, 'wheel', (e) => {
      // Allow smooth wheel scrolling
    });
  }

  preventScrollBlocking() {
    // Prevent JS that might block scrolling
    let ticking = false;

    const updateScrollPosition = () => {
      // Any scroll-dependent updates should be done here
      // Use requestAnimationFrame for smooth updates
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollPosition);
        ticking = true;
      }
    };

    // Use passive scroll listener
    addPassiveScrollListener(window, requestTick);
  }

  // Method to optimize scrollable containers
  optimizeScrollableContainer(container) {
    if (!container) return;

    // Ensure hardware acceleration
    container.style.transform = 'translate3d(0, 0, 0)';
    container.style.webkitTransform = 'translate3d(0, 0, 0)';

    // Enable touch scrolling
    container.style.webkitOverflowScrolling = 'touch';

    // Optimize scroll behavior
    container.style.overscrollBehavior = 'contain';
    container.style.willChange = 'scroll-position';

    // Add scroll listener with throttling
    addPassiveScrollListener(container, throttle(() => {
      // Handle container-specific scroll logic here
    }, 16));
  }
}

// Initialize scroll optimizer when DOM is ready
// Only initialize in browser environment
if (isBrowser) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.scrollOptimizer = new ScrollOptimizer();
    });
  } else {
    window.scrollOptimizer = new ScrollOptimizer();
  }
}

// ===== REACT/NEXT.JS SPECIFIC OPTIMIZATIONS =====

// Hook for React components to handle scroll events efficiently
export function useOptimizedScroll(callback, deps = []) {
  React.useEffect(() => {
    const throttledCallback = throttle(callback, 16);

    addPassiveScrollListener(window, throttledCallback);

    return () => {
      // Cleanup would be handled by React's useEffect cleanup
    };
  }, deps);
}

// Utility to prevent state updates during scroll for better performance
export function useScrollStatePrevention() {
  const [isScrolling, setIsScrolling] = React.useState(false);

  React.useEffect(() => {
    let scrollTimeout;

    const handleScroll = throttle(() => {
      setIsScrolling(true);

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    }, 16);

    addPassiveScrollListener(window, handleScroll);

    return () => {
      clearTimeout(scrollTimeout);
    };
  }, []);

  return isScrolling;
}

// ===== DEBUGGING HELPERS =====

// Performance monitoring for scroll events
function monitorScrollPerformance() {
  let frameCount = 0;
  let lastTime = performance.now();

  const measureFPS = () => {
    frameCount++;
    const currentTime = performance.now();

    if (currentTime - lastTime >= 1000) {
      console.log(`Scroll FPS: ${frameCount}`);
      frameCount = 0;
      lastTime = currentTime;
    }

    requestAnimationFrame(measureFPS);
  };

  addPassiveScrollListener(window, () => {
    requestAnimationFrame(measureFPS);
  });
}

// Uncomment to enable scroll performance monitoring in development
// if (process.env.NODE_ENV === 'development') {
//   monitorScrollPerformance();
// }

export { ScrollOptimizer, addPassiveScrollListener, addPassiveTouchListener, debounce, throttle };
