let currentList: object[] = [];
let currentPage: number = 1;
const itemsPerPage: number = 5;

const contentContainer: HTMLDivElement | null = document.querySelector('#content');
const itemsContainer: HTMLUListElement | null = document.querySelector('#list');
const pagination: HTMLDivElement | null = document.querySelector('#pagination');
const currentPageSpan: HTMLSpanElement | null = document.querySelector('#num');
const buttonNext: HTMLButtonElement | null = document.querySelector('#next');
const buttonPrev: HTMLButtonElement | null = document.querySelector('#prev');

type listItem = {
  name: string;
  descr: string;
  url: string;
  price: number;
}

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
    errorOccurred();
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
    errorOccurred(error);
  }
}

function updateCatalog(): void {
  if (!currentList || !itemsContainer) {
    errorOccurred();
    return;
  }

  itemsContainer.innerHTML = '';

  for (let i = 0; i < currentList.length; i++) {
    const item:any = currentList[i];

    if (i === currentList.length - 1) {
      // If item is the last one, he deletes the spinner
      createNewItem(item, true);
      return;
    }
    createNewItem(item, false);
  }
}

function createNewItem(item: listItem, isLast: boolean) {
  const li = document.createElement('li');
  li.classList.add('align-center', 'column', 'list__item', 'card');

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
    return (await fetch(`http://localhost:5500/api/sneakers/${page}`))
      .json()
      .then(list => {
        if (list.length === 0) {
          return false;
        } else {
          return true;
        }
      })
  } catch (error) {
    return false;
  }
}

function errorOccurred(error = ''): void {
  console.error(`Cannot load and display items. ${error}`);

  if (contentContainer) {
    contentContainer.innerHTML = '<span class="error">Sorry, try again later...</span>';
  }
}