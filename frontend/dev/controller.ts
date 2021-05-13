// /* eslint-disable linebreak-style */
import { view } from './view.js';
import { model } from './model.js';
class Controller {
  buttonListener() {
    document.body.addEventListener('click', model.handleClick);

    if (view.buttonNext && view.buttonPrev) {
      view.buttonNext.addEventListener('click', model.nextPage);
      view.buttonPrev.addEventListener('click', model.prevPage);
    }

    if (view.modalButtonAdd && view.modalButtonClose) {
      view.modalButtonAdd.addEventListener('click', view.addItemToTheCart);
      view.modalButtonClose.addEventListener('click', view.hideModalWindow);
    }
  }
}

document.body.onload = () => {
  controller.buttonListener();
  model.getDataAndUpdatePage();
  model.updatePaginationButtons();

  if (view.modalWindow) {
    view.modalWindow.style.transition = 'var(--default-transition)';

    view.modalWindow.addEventListener('transitionend', () => {
      view.hideSpinner();
      view.showPagination();
      view.showCatalog();
    });
  }
};

const controller = new Controller();

export { controller };
