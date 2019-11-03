import BaseClass from '../system/BaseClass';

/**
 * @class LazyBackgroundImage - Initializes a lazy load image
 */

export default class LazyBackgroundImage extends BaseClass {
  constructor(rootElement, args) {
    super(rootElement, args);
    this.active = false;
    this.lazyLoad = this.lazyLoad.bind(this);
    this.observeAndLazyLoad = this.observeAndLazyLoad.bind(this);
    this.init();
  }

  lazyLoad() {
    if (this.active === false) {
      const lazyImage = this.rootElement;
      setTimeout(() => {
        if ((lazyImage.getBoundingClientRect().top <= window.innerHeight
          && lazyImage.getBoundingClientRect().bottom >= 0)
          && getComputedStyle(lazyImage).display !== "none") {
          lazyImage.style.backgroundImage = `url(${lazyImage.dataset.src}`;
          this.active = true;
          document.removeEventListener("scroll", this.lazyLoad);
          window.removeEventListener("resize", this.lazyLoad);
          window.removeEventListener("orientationchange", this.lazyLoad);   
        }
      }, 200);
    }
  }

  observeAndLazyLoad(image) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if(entry.isIntersecting) {
          image.style.backgroundImage = `url(${image.dataset.src}`;
          imageObserver.unobserve(entry.target);
        }
      })
    });
    imageObserver.observe(image);
  }

  init() {
    if("IntersectionObserver" in window) {
      this.observeAndLazyLoad(this.rootElement);
    }else{
      this.lazyLoad();
      document.addEventListener("scroll", this.lazyLoad);
      window.addEventListener("resize", this.lazyLoad);
      window.addEventListener("orientationchange", this.lazyLoad);
    }
  }
}