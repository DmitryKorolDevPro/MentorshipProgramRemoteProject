let currentList: null | object[] = null;
let currentPage = 1;
const itemPerPage = 5;

const itemsContainer = document.querySelector('#list');
const currentPageText = document.querySelector('#num');
const buttonNext = document.querySelector('#next');
const buttonPrev = document.querySelector('#prev');

if (buttonNext && buttonPrev) {
  buttonNext.addEventListener('click', nextPage);
  buttonPrev.addEventListener('click', prevPage);
} else {
  console.error('Button PREVIOUS or button NEXT is missing...');
}

document.body.onload = () => {
    getDataFromBE(currentPage);
    // updateContent();
}

async function getDataFromBE(page: number) {
  (await fetch( `http://localhost:5500/api/sneakers/${page}`))
    .json()
    .then(list => {
      currentList = list;
      console.log(currentList);
      updateContent();
    });
}

function updateContent() {
  if (currentList === null || currentList.length === 0) {
    errorOccurred();
    return;
  }

    // TODO: LIST LENGTH MUST BE 5. CHECK
    // TODO: LIST LENGTH MUST BE > 0. CHECK itemsContainter.innerHTML = 'Sorry, stock is empty :(';

    for (let item of currentList) {
        const li = document.createElement('li');
        li.classList.add('align-center', 'column', 'list__item', 'card');

        const title = document.createElement('span');
        title.classList.add('card__title');
        title.textContent = item.name;

        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');

        const img = new Image();
        img.classList.add('card__img');
        img.src = item.url;
        img.alt = ('Image of ' + item.name);
        img.onerror = error => { console.error(error); };

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
    }
}

function errorOccurred() {
  console.error('Cannot load and display items.')

  if (itemsContainer) {
    itemsContainer.innerHTML = 'Sorry, try again later...';
  }
}

// function numPages() {
//     return Math.ceil(list.length / itemOnPage);
// }

function nextPage() {
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

/* EXAMPLE OF THE CARD:
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