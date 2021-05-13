import { view } from './view.js';
class Model {
    currentList: object[];
    currentPage: number;
    itemsPerPage: number;
    hostName: string;

    constructor() {
      this.currentList = [];
      this.currentPage = 1;
      this.itemsPerPage = 5;
      this.hostName = 'http://localhost:5500';
      this.handleClick = this.handleClick.bind(this);
    }
    async getDataFromBE(page: number) {
      try {
        return (await fetch(`${this.hostName}/api/sneakers/${page}`))
          .json()
          .then((list) => {
            if (list.length === 0) {
              throw new Error('Error. Stock is empty');
            }

            return list;
          });
      } catch (error) {
        view.catchError(error);
      }
    }
    async handleClick(event: any) {
      // find card that was clicked on
      this.currentList = await this.getDataFromBE(this.currentPage);

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

        await view.displayItemInModal(clickedOn.classList[0].split('№')[1], this.currentList)
          .then(view.showModalWindow);
      } else {
        view.hideModalWindow();
      }
    }
    async updatePaginationButtons(): Promise<void> {
      if (!view.buttonNext || !view.buttonPrev) {
        return;
      }
      view.buttonNext.disabled = !(await this.nextPageExists(this.currentPage + 1));
      view.buttonPrev.disabled = this.currentPage <= 1;
    }
    async getDataAndUpdatePage(): Promise<void> {
      view.hideCatalog();
      view.hidePagination();
      view.showSpinner();
      this.currentList = await this.getDataFromBE(this.currentPage);

      if (this.currentList.length === 0 || this.currentList.length > this.itemsPerPage) {
        view.catchError();
      } else {
        this.updatePageNum();
        this.updateCatalog();
      }
    }
    updateCatalog(): void {
      if (!this.currentList || !view.itemsContainer) {
        view.catchError();

        return;
      }
      view.itemsContainer.innerHTML = '';

      for (let i = 0; i < this.currentList.length; i++) {
        const item: any = this.currentList[i];

        if (i === this.currentList.length - 1) {
          // If item is the last one, he deletes the spinner
          view.createNewItem(item, i, true);

          return;
        }
        view.createNewItem(item, i, false);
      }
    }
    async nextPageExists(page: number): Promise<boolean> {
      try {
        return (await fetch(`${this.hostName}/api/sneakers/check/${page}`))
          .json()
          .then(
            (page) => page.exists,
          );
      } catch (error) {
        return false;
      }
    }
    updatePageNum(): void {
      if (view.currentPageSpan) {
        view.currentPageSpan.textContent = String(this.currentPage);
      }
    }
    nextPage(): void {
      if (model.currentList.length > 0) {
        model.currentPage++;
        model.getDataAndUpdatePage();
        model.updatePaginationButtons();
      }
    }
    prevPage(): void {
      if (model.currentPage > 1) {
        model.currentPage--;
        model.getDataAndUpdatePage();
        model.updatePaginationButtons();
      }
    }
}

const model = new Model();

export { model };
