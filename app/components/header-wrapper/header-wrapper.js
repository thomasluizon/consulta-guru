import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class HeaderWrapper extends Component {
  @tracked
  fixed = false;

  @tracked
  scroll = false;

  constructor(...args) {
    super(...args);

    window.onscroll = () => {
      if (!this.scrolling) {
        this.scrolling = true;
        setTimeout(() => {
          if (window.scrollY >= 50) this.fixed = true;
          else this.fixed = false;
        }, 100);
      }
      this.scrolling = false;
    };
  }
}
