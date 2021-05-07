let currentList: object[] = [];
let currentPage: number = 1;
let modalWindowOpened = false;
const itemsPerPage: number = 5;

const contentContainer: HTMLDivElement | null = document.querySelector('#content');
const itemsContainer: HTMLUListElement | null = document.querySelector('#list');
const pagination: HTMLDivElement | null = document.querySelector('#pagination');
const currentPageSpan: HTMLSpanElement | null = document.querySelector('#num');
const buttonNext: HTMLButtonElement | null = document.querySelector('#next');
const buttonPrev: HTMLButtonElement | null = document.querySelector('#prev');
const modalButtonClose: HTMLButtonElement | null = document.querySelector('#close');
const modalButtonAdd: HTMLButtonElement | null = document.querySelector('#add');
const modalWindow: HTMLDivElement | null = document.querySelector('#modal');
const modalWindowContent: HTMLDivElement | null = document.querySelector('#details');

interface listItem {
  name: string;
  descr: string;
  url: string;
  price: number;
}

document.body.addEventListener('click', handleClick);

if (buttonNext && buttonPrev) {
  buttonNext.addEventListener('click', nextPage);
  buttonPrev.addEventListener('click', prevPage);
}

async function getDataAndUpdatePage(): Promise<void> {
  hideCatalog();
  hidePagination();
  showSpinner();

  currentList = await getDataFromBE(currentPage);

  if (currentList.length === 0 || currentList.length > itemsPerPage) {
    catchError();
  } else {
    updatePageNum();
    updateCatalog();
  }
}

getDataAndUpdatePage();
updatePaginationButtons();

async function getDataFromBE(page: number) {
  try {
    return (await fetch(`http://localhost:5500/api/sneakers/${page}`))
      .json()
      .then(list => {
        if (list.length === 0) {
          throw new Error('Error. Stock is empty');
        }
        return list;
      })
  } catch (error) {
    catchError(error);
  }
}

function updateCatalog(): void {
  if (!currentList || !itemsContainer) {
    catchError();
    return;
  }

  itemsContainer.innerHTML = '';

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

function createNewItem(item: listItem, index: number, isLast: boolean) {
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

    if (itemsContainer) {
      itemsContainer.appendChild(li);
    }

    if (isLast) {
      hideSpinner();
      showCatalog();
      showPagination();
    }
  }

  img.src = item.url;
}

function showSpinner(): void {
  if (contentContainer) {
    contentContainer.insertAdjacentHTML('afterbegin', `<i class="fas fa-compact-disc spinner" id="spinner"></i>`);
  }
}

function hideSpinner(): void {
  const spinner: HTMLElement | null = document.querySelector('#spinner');

  if (spinner) {
    spinner.style.display = 'none';
  }
}

function showCatalog(): void {
  if (itemsContainer) {
    itemsContainer.style.display = 'flex';
  }
}

function hideCatalog(): void {
  if (itemsContainer) {
    itemsContainer.style.display = 'none';
  }
}

function showPagination(): void {
  if (pagination) {
    pagination.style.display = 'flex';
  }
}

function hidePagination(): void {
  if (pagination) {
    pagination.style.display = 'none';
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
  if (currentPageSpan) {
    currentPageSpan.textContent = String(currentPage);
  }
}

async function updatePaginationButtons(): Promise<void> {
  if (!buttonNext || !buttonPrev) {
    return;
  }

  if (await nextPageExists(currentPage + 1)) {
    buttonNext.disabled = false;
  } else {
    buttonNext.disabled = true;
  }

  if (currentPage > 1) {
    buttonPrev.disabled = false;
  } else {
    buttonPrev.disabled = true;
  }
}

async function nextPageExists(page: number): Promise<boolean> {
  try {
    return (await fetch(`http://localhost:5500/api/sneakers/check/${page}`)).json();
  } catch (error) {
    return false;
  }
}

function catchError(error = ''): void {
  console.error(`Cannot load and display items. ${error}`);

  if (contentContainer) {
    contentContainer.innerHTML = '<span class="error">Sorry, try again later...</span>';
  }
}

async function handleClick(event: any) {
  // find card that was clicked on
  const clickedOn = event.path.find((el: HTMLElement) => !el.classList ? false : el.classList.contains('list__item') || el.classList.contains('modal'));

  // if click was on modal window
  if (clickedOn && clickedOn.classList.contains('modal') || !modalWindow) {
    return;
  }

  // show or hide modal
  if (clickedOn) {
    hideCatalog();
    hidePagination();
    showSpinner();

    await displayItemInModal(clickedOn.classList[0].split('№')[1])
    .then(showModalWindow);
  } else {
    hideModalWindow();
  }
}

async function displayItemInModal(index: number) {
  return new Promise((resolve, reject) => {
    const item: any = currentList[+index];

    if (modalWindowContent) {
      modalWindowContent.innerHTML = '';
  
      const image = new Image();
      image.classList.add('card__image');
      image.alt = `Image of ${item.name}`;
      image.onload = () => {
        resolve(true);
      }
      image.src = item.url;
  
      modalWindowContent.appendChild(image);
      modalWindowContent.insertAdjacentHTML('beforeend',
      `<div class="card__info align-center column">
          <span class="card__title">${item.name}</span>
          <span class="card__description">${item.descr}</span>
          <span class="card__price">${item.price} UAH.</span>
        </div>
      `);
    }
  });
}

if (modalButtonAdd && modalButtonClose) {
  modalButtonAdd.addEventListener('click', addItemToTheCart);
  modalButtonClose.addEventListener('click', hideModalWindow);
}

document.body.onload = () => {
  if (modalWindow) {
    modalWindow.style.transition = 'var(--default-transition)';
    modalWindow.addEventListener('transitionend', () => {
      hideSpinner();
      showPagination();
      showCatalog();
    })
  }
}

function showModalWindow() {
  document.body.style.overflow = 'hidden';

  if (modalWindow) {
    modalWindow.style.transform = 'scale(1)';
  }
}

function hideModalWindow() {
  document.body.style.overflow = 'auto';

  if (modalWindow) {
    modalWindow.style.transform = 'scale(0)';
  }
}

function addItemToTheCart() {
  alert('Will be added soon!');
}