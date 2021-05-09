import { View } from './view.js';
const view = new View;

let currentList: object[] = [];
let currentPage: number = 1;
const itemsPerPage: number = 5;
const hostName: string = `http://localhost:5500`;

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
      view.createNewItem(item, true);
      return;
    }
    view.createNewItem(item, false);
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
    return (await fetch(`${hostName}/api/sneakers/check/${page}`)).status === 200;
  } catch (error) {
    return false;
  }
}