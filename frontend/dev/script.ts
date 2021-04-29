let currentList: null | object[] = null;
let currentPage: number = 1;
const itemsPerPage: number = 5;

const contentContainer: HTMLDivElement | null = document.querySelector('#content');
const itemsContainer: HTMLUListElement | null = document.querySelector('#list');
const pagination: HTMLDivElement | null = document.querySelector('#pagination');
const currentPageText: HTMLSpanElement | null = document.querySelector('#num');
const buttonNext: HTMLButtonElement | null = document.querySelector('#next');
const buttonPrev: HTMLButtonElement | null = document.querySelector('#prev');

type listItem = {
  name: string;
  description: string;
  url: string;
  price: number;
}

if (buttonNext && buttonPrev) {
  buttonNext.addEventListener('click', nextPage);
  buttonPrev.addEventListener('click', prevPage);
} else {
  console.error('Button PREVIOUS or button NEXT is missing...');
}

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

function addSpinner(): void {
  if (contentContainer) {
    contentContainer.insertAdjacentHTML('afterbegin', `<i class="fas fa-compact-disc spinner" id="spinner"></i>`);
  }
}

function removeSpinner(): void {
  const spinner: HTMLElement | null = document.querySelector('#spinner');

  if (spinner) {
    spinner.style.display = 'none';
  }
}

function updateContent(): void {
  itemsContainer.innerHTML = '';

  if (currentList === null) {
    errorOccurred();
  }

  for (let i = 0; i < currentList.length; i++) {
    const item = currentList[i];

    if (i === currentList.length - 1) {
      // If item is the last one, deletes the spinner
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
    itemsContainer.appendChild(li);

    if (isLast) {
      removeSpinner();
      displayPagination();
      itemsContainer.style.display = 'flex';
    }
  }

  img.src = item.url;
}


function displayPagination() {
  pagination.style.display = 'flex';
}

function errorOccurred(error = '') {
  console.error(`Cannot load and display items. ${error}`);

  if (contentContainer) {
    contentContainer.innerHTML = '<span class="error">Sorry, try again later...</span>';
  }
}

function nextPage() {
  if (currentList.length > 0) {
    currentPage++;
    getDataAndUpdatePage();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    getDataAndUpdatePage();
  }
}


function updatePageNum() {
  currentPageText.textContent = currentPage;
}

async function getDataAndUpdatePage() {
  addSpinner();
  currentList = await getDataFromBE(currentPage);

  if (currentList.length === 0 || currentList.length > itemsPerPage) {
    errorOccurred();
  } else {
    updateContent();
  }
}

getDataAndUpdatePage();




/*

function numPages() {
    return Math.ceil(list.length / itemOnPage);
=======
  // if (currentPage < fromBE lenght) {
  //     currentPage++;
  //     updateContent(currentPage);
  // }
}

function prevPage() {
  // if (currentPage > 1) {
  //     currentPage--;
  //     updateContent(currentPage);
  // }
}

EXAMPLE OF THE CARD:
    <li class="align-center column list__item card">
        <span class="card__title">SLICER Light Coral</span>

        <div class="wrapper">
            <img class="card__img"
                src="https://github.com/exORYON/db/blob/main/119905085_323766932189419_4890343778692013862_n.jpg?raw=true">

            <div class="wrapper info">
                <p class="card__description">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <span class="card__price">1950 грн.</span>
            </div>
        </div>
    </li>
*/