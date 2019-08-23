import BaseClass from '../system/BaseClass';
import initializeDrawer from '../utils/initializeDrawer';
import insertDrawerContent from '../utils/insertDrawerContent';
import insertDrawerPlaceholder from '../utils/insertDrawerPlaceholder';
import ProductForm from '../components/ProductForm';
import ProductReviews from '../components/ProductReviews';
import renderSnptScript from '../utils/renderSnptScript';

export default class ProductDrawer extends BaseClass {
  constructor(rootElement, args) {
    super(rootElement, args);
    this.state = {
      page_url: window.location.href,
      page_title: document.title
    };
    this.Instance = {};
    this.Swiper = {};
    this.ProductForm = {};
    this.init();
  }

  async onOpenStart() {
    const product_id = event.target.dataset.id;
    const product_url = event.target.dataset.url;
    const page_title = event.target.dataset.pageTitle;
    await new Promise((resolve, reject)=> {
      insertDrawerContent(this.rootElement, product_url, {resolve: resolve, reject: reject});
    });
    history.pushState(this.state, page_title, product_url.replace('?view=stripped', ''));
    document.getElementById('canonical').href = product_url.replace('?view=stripped', '');
    window.addEventListener('popstate', close);
    const swiper_options = {
      loop: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        dynamicBullets: true
      },
    }
    this.Swiper = new Swiper('#ProductSwiper', swiper_options);
    const form = document.getElementById('ProductDrawer').getElementsByClassName('product-form')[0];
    this.ProductForm = new ProductForm(form, {Swiper: this.Swiper});
    const review_container = this.rootElement.querySelector('.product-reviews');
    const yotpo = new ProductReviews(review_container, {product_id: product_id});
    const snpt_container = document.querySelector('.snpt-wdgt--ppg');
    const snpt_script = renderSnptScript(snpt_container.dataset.vendor);
    snpt_container.appendChild(snpt_script);
  }

  onCloseStart() {
    window.removeEventListener('popstate', close);
    document.getElementById('canonical').href = this.page_url;
    history.pushState(this.state, this.state.page_title, this.state.page_url);
  }

  onCloseEnd() {
    insertDrawerPlaceholder(this.rootElement);
    this.Swiper.destroy();
    this.ProductForm.destroy();
  }

  async init() {
    const options = {
      edge: 'right', 
      onOpenStart: ()=>this.onOpenStart(),
      onCloseStart: ()=>this.onCloseStart(),
      onCloseEnd: ()=>this.onCloseEnd()
    };
    this.Instance = await new Promise((resolve, reject)=> {
      initializeDrawer('ProductDrawer', options, {resolve: resolve, reject: reject});
    });
  }
}