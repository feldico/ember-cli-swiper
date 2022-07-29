import Controller from '@ember/controller';
import { action } from '@ember/object';
import { later } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';

export default class IndexController extends Controller {
  @tracked selectionHistory = '';
  @tracked currentSlide = 3;
  @tracked currentSlide2 = 2;

  @action
  goToTwo() {
    this.currentSlide = 2;
  }

  @action
  onSwiperEnd() {
    later(() => alert('End of slider'), 300);
  }
}
