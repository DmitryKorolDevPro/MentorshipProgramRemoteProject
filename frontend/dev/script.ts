import { ListItem, view } from './view.js';

let currentList: object[] = [];
let currentPage: number = 1;
const itemsPerPage: number = 5;
const hostName: string = `http://localhost:5500`;

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
      .then(list => {
        if (list.length === 0) {
          throw new Error('Error. Stock is empty');
        }
        return list;
      })
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
      createNewItem(item, i, true);
      return;
    }
    createNewItem(item, i, false);
  }
}

function createNewItem(item: ListItem, index: number, isLast: boolean) {
  const li = document.createElement('li');
  li.classList.add(`item-№${index}`, 'align-center', 'column', 'list__item', 'card');

  const title = document.createElement('span');
  title.classList.add('card__title');
  title.textContent = item.name;

  const wrapper = document.createElement('div');
  wrapper.classList.add('wrapper');

  const img = new Image();

  img.onload = function () {
    img.classList.add('card__img');
    img.alt = ('Image of ' + item.name);

    const info = document.createElement('div');
    info.classList.add('wrapper', 'info');

    const descrip = document.createElement('p');
    descrip.classList.add('card__description');
    descrip.textContent = item.descr.split(". ")[0] + ".";

    const price = document.createElement('span');
    price.classList.add('card__price');
    price.textContent = item.price + "UAH.";

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
  }

  img.src = item.url;
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
  if (await nextPageExists(currentPage + 1)) {
    view.buttonNext.disabled = false;
  } else {
    view.buttonNext.disabled = true;
  }
  if (currentPage > 1) {
    view.buttonPrev.disabled = false;
  } else {
    view.buttonPrev.disabled = true;
  }
}

async function nextPageExists(page: number): Promise<boolean> {
  try {
    return (await fetch(`${hostName}/api/sneakers/check/${page}`))
      .json()
      .then(
        page => {
          return page.exists;
        });
  } catch (error) {
    return false;
  }
}

async function handleClick(event: any) {
  // find card that was clicked on
  const clickedOn = event.path.find((el: HTMLElement) => !el.classList ? false : el.classList.contains('list__item') || el.classList.contains('modal'));

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
      .then(showModalWindow);
  } else {
    hideModalWindow();
  }
}

async function displayItemInModal(index: number) {
  return new Promise((resolve, reject) => {
    const item: any = currentList[+index];

    if (view.modalWindowContent) {
      view.modalWindowContent.innerHTML = '';

      const image = new Image();
      image.classList.add('card__image');
      image.alt = `Image of ${item.name}`;
      image.onload = () => {
        resolve(true);
      }
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
  view.modalButtonClose.addEventListener('click', hideModalWindow);
}

document.body.onload = () => {
  if (view.modalWindow) {
    view.modalWindow.style.transition = 'var(--default-transition)';
    view.modalWindow.addEventListener('transitionend', () => {
      view.hideSpinner();
      view.showPagination();
      view.showCatalog();
    })
  }
}

function showModalWindow() {
  document.body.style.overflow = 'hidden';

  if (view.modalWindow) {
    view.modalWindow.style.transform = 'scale(1)';
  }
}

function hideModalWindow() {
  document.body.style.overflow = 'auto';

  if (view.modalWindow) {
    view.modalWindow.style.transform = 'scale(0)';
  }
}

function addItemToTheCart() {
  alert('Will be added soon!');
}