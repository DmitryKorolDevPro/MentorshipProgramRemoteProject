export interface ListItem {
  name: string;
  descr: string;
  url: string;
  price: number;
}

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

  createNewItem(item: ListItem, isLast: boolean) {
    const itemsCont = view.itemsContainer;
    const li = document.createElement('li');

    li.classList.add('align-center', 'column', 'list__item', 'card');

    const title = document.createElement('span');

    title.classList.add('card__title');
    title.textContent = item.name;

    const wrapper = document.createElement('div');

    wrapper.classList.add('wrapper');

    const img = new Image();

    img.onload = function() {
      img.classList.add('card__img');
      img.alt = ('Image of ' + item.name);

      const info = document.createElement('div');

      info.classList.add('wrapper', 'info');

      const descrip = document.createElement('p');

      descrip.classList.add('card__description');
      descrip.textContent = item.descr.split('. ')[0] + '.';

      const price = document.createElement('span');

      price.classList.add('card__price');
      price.textContent = item.price + 'UAH.';

      info.append(descrip, price);
      wrapper.append(img, info);
      li.append(title, wrapper);

      if (itemsCont) {
        itemsCont.appendChild(li);
      }

      if (isLast) {
        view.hideSpinner();
        view.showCatalog();
        view.showPagination();
      }
    };
    img.src = item.url;
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
    const spin = document.querySelector('#spinner');

    if (spin) {
      spin.style.display = 'none';
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
