import { ListItem } from './interfaces.js';

class View {
  contentContainer: HTMLDivElement | null;
  itemsContainer: HTMLUListElement | null;
  pagination: HTMLDivElement | null;
  currentPageSpan: HTMLSpanElement | null;
  buttonNext: HTMLButtonElement | null;
  buttonPrev: HTMLButtonElement | null;
  spinner: HTMLElement | null;
  modalButtonClose: HTMLButtonElement | null;
  modalButtonAdd: HTMLButtonElement | null;
  modalWindow: HTMLDivElement | null;
  modalWindowContent: HTMLDivElement | null;
  modalWindowOpened: boolean;

  constructor() {
    this.contentContainer = document.querySelector('#content');
    this.itemsContainer = document.querySelector('#list');
    this.pagination = document.querySelector('#pagination');
    this.currentPageSpan = document.querySelector('#num');
    this.buttonNext = document.querySelector('#next');
    this.buttonPrev = document.querySelector('#prev');
    this.spinner = document.querySelector('#spinner');
    this.modalButtonClose = document.querySelector('#close');
    this.modalButtonAdd = document.querySelector('#add');
    this.modalWindow = document.querySelector('#modal');
    this.modalWindowContent = document.querySelector('#details');
    this.modalWindowOpened = false;
  }

  createNewItem(item: ListItem, index: number, isLast: boolean) {
    const li = document.createElement('li');

    li.classList.add(`item-№${index}`, 'align-center', 'column', 'list__item', 'card');

    const title = document.createElement('span');

    title.classList.add('card__title');
    title.textContent = item.name;

    const wrapper = document.createElement('div');

    wrapper.classList.add('wrapper');

    const img = new Image();

    img.onload = function() {
      img.classList.add('card__img');
      img.alt = (`Image of ${item.name}`);

      const info = document.createElement('div');

      info.classList.add('wrapper', 'info');

      const descrip = document.createElement('p');

      descrip.classList.add('card__description');
      descrip.textContent = `${item.descr.split('. ')[0]}.`;

      const price = document.createElement('span');

      price.classList.add('card__price');
      price.textContent = `${item.price}UAH.`;

      info.append(descrip, price);
      wrapper.append(img, info);
      li.append(title, wrapper);

      if (view.itemsContainer) {
        view.itemsContainer.appendChild(li);
      }

      if (isLast) {
        view.hideSpinner();
        view.showCatalog();
        view.showPagination();
      }
    };

    img.src = item.url;
  }
  async displayItemInModal(index: number, currentList: object[]) {
    return new Promise((resolve) => {
      const item: any = currentList[+index];

      if (view.modalWindowContent) {
        view.modalWindowContent.innerHTML = '';

        const image = new Image();

        image.classList.add('card__image');
        image.alt = `Image of ${item.name}`;

        image.onload = () => {
          resolve(true);
        };
        image.src = item.url;

        view.modalWindowContent.appendChild(image);

        view.modalWindowContent.insertAdjacentHTML('beforeend',
          `<div class="card__info align-center column">
            <span class="card__title">${item.name}</span>
            <span class="card__description">${item.descr}</span>
            <span class="card__price">${item.price} UAH.</span>
          </div>
        `);
      }
    });
  }
  addItemToTheCart() {
    alert('Will be added soon!');
  }
  showCatalog(): void {
    if (view.itemsContainer) {
      view.itemsContainer.style.display = 'flex';
    }
  }
  hideCatalog(): void {
    if (view.itemsContainer) {
      view.itemsContainer.style.display = 'none';
    }
  }
  showPagination(): void {
    if (view.pagination) {
      view.pagination.style.display = 'flex';
    }
  }
  hidePagination(): void {
    if (view.pagination) {
      view.pagination.style.display = 'none';
    }
  }
  showSpinner(): void {
    if (view.contentContainer) {
      view.contentContainer.insertAdjacentHTML('afterbegin',
        `<i class="fas fa-compact-disc spinner" id="spinner"></i>`);
    }
  }
  hideSpinner(): void {
    view.spinner = document.querySelector('#spinner');

    if (view.spinner) {
      view.spinner.style.display = 'none';
    }
  }
  showModalWindow() {
    document.body.style.overflow = 'hidden';

    if (view.modalWindow) {
      view.modalWindow.style.transform = 'scale(1)';
    }
  }
  hideModalWindow() {
    document.body.style.overflow = 'auto';

    if (view.modalWindow) {
      view.modalWindow.style.transform = 'scale(0)';
    }
  }
  catchError(error = ''): void {
    console.error(`Cannot load and display items. ${error}`);

    if (view.contentContainer) {
      view.contentContainer.innerHTML = '<span class="error">Sorry, try again later...</span>';
    }
  }
}

const view = new View();

export { view };
