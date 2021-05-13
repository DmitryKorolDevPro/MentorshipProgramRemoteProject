/* eslint-disable max-len */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-shadow */
// /* eslint-disable linebreak-style */
import { view } from './view.js';
import { model } from './model.js';
class Controller {
  buttonListener() {
    document.body.addEventListener('click', controller.handleClick);

    if (view.buttonNext && view.buttonPrev) {
      view.buttonNext.addEventListener('click', this.nextPage);
      view.buttonPrev.addEventListener('click', this.prevPage);
    }

    if (view.modalButtonAdd && view.modalButtonClose) {
      view.modalButtonAdd.addEventListener('click', view.addItemToTheCart);
      view.modalButtonClose.addEventListener('click', view.hideModalWindow);
    }
  }
  async handleClick(event: any) {
    // find card that was clicked on
    model.currentList = await model.getDataFromBE(model.currentPage);

    const clickedOn = event.path.find((el: HTMLElement) => (!el.classList ? false : el.classList.contains('list__item') || el.classList.contains('modal')));

    // if click was on modal window
    if (clickedOn && clickedOn.classList.contains('modal') || !view.modalWindow) {
      return;
    }

    // show or hide modal
    if (clickedOn) {
      view.hideCatalog();
      view.hidePagination();
      view.showSpinner();

      await view.displayItemInModal(clickedOn.classList[0].split('№')[1], model.currentList)
        .then(view.showModalWindow);
    } else {
      view.hideModalWindow();
    }
  }
  async getDataAndUpdatePage(): Promise<void> {
    view.hideCatalog();
    view.hidePagination();
    view.showSpinner();
    model.currentList = await model.getDataFromBE(model.currentPage);

    if (model.currentList.length === 0 || model.currentList.length > model.itemsPerPage) {
      view.catchError();
    } else {
      view.updatePageNum();
      view.updateCatalog();
    }
  }
  nextPage(): void {
    if (model.currentList.length > 0) {
      model.currentPage++;
      controller.getDataAndUpdatePage();
      view.updatePaginationButtons();
    }
  }
  prevPage(): void {
    if (model.currentPage > 1) {
      model.currentPage--;
      controller.getDataAndUpdatePage();
      view.updatePaginationButtons();
    }
  }
}

document.body.onload = () => {
  controller.buttonListener();
  controller.getDataAndUpdatePage();
  view.updatePaginationButtons();

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
