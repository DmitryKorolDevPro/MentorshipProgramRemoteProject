/* eslint-disable linebreak-style */
import { view } from './view.js';

let currentList: object[] = [];
let currentPage: number = 1;
const itemsPerPage: number = 5;
const hostName: string = 'http://localhost:5500';

document.body.addEventListener('click', handleClick);

if (view.buttonNext && view.buttonPrev) {
  view.buttonNext.addEventListener('click', nextPage);
  view.buttonPrev.addEventListener('click', prevPage);
}

async function getDataAndUpdatePage(): Promise<void> {
  view.hideCatalog();
  view.hidePagination();
  view.showSpinner();
  currentList = await getDataFromBE(currentPage);

  if (currentList.length === 0 || currentList.length > itemsPerPage) {
    view.catchError();
  } else {
    updatePageNum();
    updateCatalog();
  }
}

getDataAndUpdatePage();
updatePaginationButtons();

async function getDataFromBE(page: number) {
  try {
    return (await fetch(`${hostName}/api/sneakers/${page}`))
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

function updateCatalog(): void {
  if (!currentList || !view.itemsContainer) {
    view.catchError();

    return;
  }

  view.itemsContainer.innerHTML = '';

  for (let i = 0; i < currentList.length; i++) {
    const item: any = currentList[i];

    if (i === currentList.length - 1) {
      // If item is the last one, he deletes the spinner
      view.createNewItem(item, i, true);

      return;
    }
    view.createNewItem(item, i, false);
  }
}

function nextPage(): void {
  if (currentList.length > 0) {
    currentPage++;
    getDataAndUpdatePage();
    updatePaginationButtons();
  }
}

function prevPage(): void {
  if (currentPage > 1) {
    currentPage--;
    getDataAndUpdatePage();
    updatePaginationButtons();
  }
}

function updatePageNum(): void {
  if (view.currentPageSpan) {
    view.currentPageSpan.textContent = String(currentPage);
  }
}

async function updatePaginationButtons(): Promise<void> {
  if (!view.buttonNext || !view.buttonPrev) {
    return;
  }
  view.buttonNext.disabled = !(await nextPageExists(currentPage + 1));
  view.buttonPrev.disabled = currentPage <= 1
}

async function nextPageExists(page: number): Promise<boolean> {
  try {
    return (await fetch(`${hostName}/api/sneakers/check/${page}`))
      .json()
      .then(
        (page) => page.exists,
      );
  } catch (error) {
    return false;
  }
}

async function handleClick(event: any) {
  // find card that was clicked on
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

    await displayItemInModal(clickedOn.classList[0].split('№')[1])
      .then(view.showModalWindow);
  } else {
    view.hideModalWindow();
  }
}

async function displayItemInModal(index: number) {
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

if (view.modalButtonAdd && view.modalButtonClose) {
  view.modalButtonAdd.addEventListener('click', addItemToTheCart);
  view.modalButtonClose.addEventListener('click', view.hideModalWindow);
}

document.body.onload = () => {
  if (view.modalWindow) {
    view.modalWindow.style.transition = 'var(--default-transition)';

    view.modalWindow.addEventListener('transitionend', () => {
      view.hideSpinner();
      view.showPagination();
      view.showCatalog();
    });
  }
};

function addItemToTheCart() {
  alert('Will be added soon!');
}
