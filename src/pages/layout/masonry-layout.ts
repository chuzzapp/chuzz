import { BasePage } from '../base-page'

declare var Masonry: any

function _masonrisar(gridClass: string, gridItemClass: string, callback) {
  setTimeout(() => {
      var elem = document.querySelector(gridClass);
      new Masonry(elem, {
          itemSelector: gridItemClass,
          columnWidth: gridItemClass,
          gutter: 0,
          fitWidth: false,
          horizontalOrder: false,
          resize: true,
          percentPosition: true,
      });

      callback();
  }, 0);
}

export abstract class MasonryLayout {
    contructor() { }

    protected postLayout() {}

    protected masonrisar(gridClass: string, gridItemClass: string) {
      _masonrisar(gridClass, gridItemClass, () => { this.postLayout() });
    }
}

export abstract class MasonryLayoutPage extends BasePage {

    protected postLayout() {}

    protected masonrisar(gridClass: string, gridItemClass: string) {
      _masonrisar(gridClass, gridItemClass, () => { this.postLayout() });
    }
}
