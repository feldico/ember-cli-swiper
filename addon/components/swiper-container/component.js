import Component from '@glimmer/component';
import { action } from '@ember/object';
import { once, next } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import { arg } from 'ember-arg-types';
import { func, number, object, string } from 'prop-types';
import Swiper, { Navigation, Pagination, Scrollbar } from 'swiper';

export default class SwiperContainer extends Component {
  /**
   * Swiper Instance
   * @private
   * @type {Boolean}
   */
  @tracked swiperInstance = false;

  /**
   * Proxies `Swiper.activeIndex`
   * @public
   * @type {Number}
   */
  @arg
  currentSlide = 0;

  /**
   * On Swiper Slide change
   * @public
   * @param {Swiper.Slide} swiperSlide
   */
  @arg(func)
  onChange = () => {};

  /**
   * User defined map of Swiper events
   * @type {Object}
   */
  @arg(object)
  events = {};

  /**
   * Swiper next element class
   * @public
   * @type {String}
   */
  @arg(string)
  nextElClass = '.swiper-button-next';

  /**
   * Swiper previous element class
   * @public
   * @type {String}
   */
  @arg(string)
  prevElClass = '.swiper-button-prev';

  /**
   * Render navigation controls
   * @public
   * @type {Boolean}
   */
  get hasNavigation() {
    return this.options?.navigation || false;
  }

  /**
   * Render pagination controls
   * @public
   * @type {Boolean}
   */
  get hasPagination() {
    return this.options?.pagination || false;
  }

  /**
   * Render scrollbar controls
   * @public
   * @type {Boolean}
   */
  get hasScrollbar() {
    return this.options?.scrollbar || false;
  }

  /**
   * Single Attribute options
   * @public
   * @type {Object}
   */
  @arg
  options = null;

  @action
  initSwiper(element) {
    this.registerAs = this;

    const swiperOptions = {
      initialSlide: this.currentSlide,
      // Install modules
      modules: [],
      ...this.options,
    };

    if (this.hasNavigation) {
      swiperOptions.modules.push(Navigation);
      swiperOptions.navigation = {
        nextEl: this.nextElClass,
        prevEl: this.prevElClass,
        ...(swiperOptions.navigation || {}),
      };
    }

    if (this.hasPagination) {
      swiperOptions.modules.push(Pagination);
      swiperOptions.pagination = {
        el: '.swiper-pagination',
        clickable: true,
        ...(swiperOptions.pagination || {}),
      };
    }

    if (this.hasScrollbar) {
      swiperOptions.modules.push(Scrollbar);
    }

    const instance = new Swiper(element, swiperOptions);

    const transitionEvent = this.loop
      ? 'slideChangeTransitionEnd'
      : 'slideChange';

    instance.on(transitionEvent, this.slideChangedEvent);

    // Subscribe configured actions as Swiper events
    Object.keys(this.events || {}).forEach((evt) =>
      instance.on(evt, this[`events.${evt}`])
    );

    // Manual initalization when user requires `init` event handling
    if (swiperOptions.init === false) {
      instance.init();
    }

    this.swiperInstance = instance;
  }

  /**
   * Userland fallback sugar for forcing swiper update
   * @public
   */
  @action
  onUpdate() {
    this.swiperInstance.update();
    this.swiperInstance.slideTo(this.currentSlide);
  }

  /**
   * Update `currentSlide` and trigger `onChange` event
   * @private
   * @param {Object} swiper - Swiper instance
   */
  @action
  slideChangedEvent() {
    next(this, function () {
      this.onChange(this.swiperInstance.realIndex);
    });
  }

  willDestroy() {
    super.willDestroy(...arguments);

    let instance = this.swiperInstance;

    if (instance) {
      instance.off('slideChangeTransitionEnd');
      instance.destroy();
    }
  }
}
