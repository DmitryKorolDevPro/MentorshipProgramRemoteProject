console.log('Helloasdadsadasd FE');
// const fs = require('fs').promises;
// const express = require('express');

// const app = express();
// const port = 5500;

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// });

// app.get('/getdata', async (req: any, res: any) => {

//   const result = await getDataFromBE();
//   res.status(200).send(result);

// });
// //______________________________________get DATA_________________________
// let currentPage = 1;

// async function getDataFromBE() {
//   const data = (await fetch('http://127.0.0.1:5500/api/sneakers/${currentPage}')).json()
//     .then(list => console.log(list));
// }
//const objJson = getDataFromBE();
const fs = require('fs').promises;

function getDBList() {
  fs.readFile('./db.json', 'utf8', (err: any, data: any) => {
    try {
      const productList = JSON.parse(data).stock;
      return productList;
    } catch (err) {
      console.log('Error' + err);
    }
  });

}
//__________________________________________________PAGINATION__________________
let currentPage = 1;
const records_per_page = 2;
const objJson = {
  "stock": [
    {
      "name": "SLICER Light Coral",
      "descr": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lobortis dictum neque, at tincidunt eros convallis quis. Donec ultricies sapien in lobortis pretium. Sed suscipit ipsum dolor, at pellentesque metus auctor quis. Suspendisse rhoncus ultricies mi, nec pharetra turpis tincidunt et.",
      "price": 1950,
      "url": "https://github.com/exORYON/db/blob/main/119905085_323766932189419_4890343778692013862_n.jpg?raw=true"
    },
    {
      "name": "SLICER Titanium White",
      "descr": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lobortis dictum neque, at tincidunt eros convallis quis. Donec ultricies sapien in lobortis pretium. Sed suscipit ipsum dolor, at pellentesque metus auctor quis. Suspendisse rhoncus ultricies mi, nec pharetra turpis tincidunt et.",
      "price": 1780,
      "url": "https://github.com/exORYON/db/blob/main/120139455_115813640270969_2930161371286048021_n.jpg?raw=true"
    },
    {
      "name": "SLICER Black and White",
      "descr": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lobortis dictum neque, at tincidunt eros convallis quis. Donec ultricies sapien in lobortis pretium. Sed suscipit ipsum dolor, at pellentesque metus auctor quis. Suspendisse rhoncus ultricies mi, nec pharetra turpis tincidunt et.",
      "price": 1990,
      "url": "https://github.com/exORYON/db/blob/main/121235325_126877025548567_2222252721004759005_n.jpg?raw=true"
    },
    {
      "name": "SLICER Night",
      "descr": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lobortis dictum neque, at tincidunt eros convallis quis. Donec ultricies sapien in lobortis pretium. Sed suscipit ipsum dolor, at pellentesque metus auctor quis. Suspendisse rhoncus ultricies mi, nec pharetra turpis tincidunt et.",
      "price": 1680,
      "url": "https://github.com/exORYON/db/blob/main/123341033_274418847267096_9129209827290048632_n.jpg?raw=true"
    },
    {
      "name": "SLICER Bloody",
      "descr": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lobortis dictum neque, at tincidunt eros convallis quis. Donec ultricies sapien in lobortis pretium. Sed suscipit ipsum dolor, at pellentesque metus auctor quis. Suspendisse rhoncus ultricies mi, nec pharetra turpis tincidunt et.",
      "price": 1999,
      "url": "https://github.com/exORYON/db/blob/main/123403794_481755306065916_2801586288664686810_n.jpg?raw=true"
    },
    {
      "name": "SLICER Marine",
      "descr": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lobortis dictum neque, at tincidunt eros convallis quis. Donec ultricies sapien in lobortis pretium. Sed suscipit ipsum dolor, at pellentesque metus auctor quis. Suspendisse rhoncus ultricies mi, nec pharetra turpis tincidunt et.",
      "price": 1500,
      "url": "https://github.com/exORYON/db/blob/main/139852253_224291332519618_4265951042297070639_n.jpg?raw=true"
    },
    {
      "name": "SLICER Sneaky",
      "descr": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lobortis dictum neque, at tincidunt eros convallis quis. Donec ultricies sapien in lobortis pretium. Sed suscipit ipsum dolor, at pellentesque metus auctor quis. Suspendisse rhoncus ultricies mi, nec pharetra turpis tincidunt et.",
      "price": 1499,
      "url": "https://github.com/exORYON/db/blob/main/140370870_692321638119443_8194939502407238248_n.jpg?raw=true"
    },
    {
      "name": "SLICER Markne",
      "descr": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lobortis dictum neque, at tincidunt eros convallis quis. Donec ultricies sapien in lobortis pretium. Sed suscipit ipsum dolor, at pellentesque metus auctor quis. Suspendisse rhoncus ultricies mi, nec pharetra turpis tincidunt et.",
      "price": 1500,
      "url": "https://github.com/exORYON/db/blob/main/139852253_224291332519618_4265951042297070639_n.jpg?raw=true"
    },
  ]
}
console.log(objJson);

function changePage(page: any) { //: any
  const table_div: any = document.getElementById('.content');

  if (page < 1) page = 1;
  if (page > numPages()) page = numPages();

  table_div.innerHTML = '';

  for (let i = (page - 1) * records_per_page; i < (page * records_per_page); i++) {
    table_div.innerHTML += objJson.stock[i];
    table_div.appendChild(objJson.stock[i] + '<br>');
  }

}
//numb. pages will be 
function numPages() {
  return Math.ceil(objJson.stock.length / records_per_page);
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    changePage(currentPage);
  }
}

function nextPage() {
  if (currentPage < numPages()) {
    currentPage++;
    changePage(currentPage);
  }
}

window.onload = function () {
  changePage(1);
};


// -----------------------------------------------------------------

const list = [
  {
    "name": "SLICER Light Coral",
    "descr": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lobortis dictum neque, at tincidunt eros convallis quis. Donec ultricies sapien in lobortis pretium. Sed suscipit ipsum dolor, at pellentesque metus auctor quis. Suspendisse rhoncus ultricies mi, nec pharetra turpis tincidunt et.",
    "price": 1950,
    "url": "https://github.com/exORYON/db/blob/main/119905085_323766932189419_4890343778692013862_n.jpg?raw=true"
  },
  {
    "name": "SLICER Titanium White",
    "descr": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lobortis dictum neque, at tincidunt eros convallis quis. Donec ultricies sapien in lobortis pretium. Sed suscipit ipsum dolor, at pellentesque metus auctor quis. Suspendisse rhoncus ultricies mi, nec pharetra turpis tincidunt et.",
    "price": 1780,
    "url": "https://github.com/exORYON/db/blob/main/120139455_115813640270969_2930161371286048021_n.jpg?raw=true"
  },
  {
    "name": "SLICER Black and White",
    "descr": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lobortis dictum neque, at tincidunt eros convallis quis. Donec ultricies sapien in lobortis pretium. Sed suscipit ipsum dolor, at pellentesque metus auctor quis. Suspendisse rhoncus ultricies mi, nec pharetra turpis tincidunt et.",
    "price": 1990,
    "url": "https://github.com/exORYON/db/blob/main/121235325_126877025548567_2222252721004759005_n.jpg?raw=true"
  },
  {
    "name": "SLICER Night",
    "descr": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lobortis dictum neque, at tincidunt eros convallis quis. Donec ultricies sapien in lobortis pretium. Sed suscipit ipsum dolor, at pellentesque metus auctor quis. Suspendisse rhoncus ultricies mi, nec pharetra turpis tincidunt et.",
    "price": 1680,
    "url": "https://github.com/exORYON/db/blob/main/123341033_274418847267096_9129209827290048632_n.jpg?raw=true"
  },
  {
    "name": "SLICER Bloody",
    "descr": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lobortis dictum neque, at tincidunt eros convallis quis. Donec ultricies sapien in lobortis pretium. Sed suscipit ipsum dolor, at pellentesque metus auctor quis. Suspendisse rhoncus ultricies mi, nec pharetra turpis tincidunt et.",
    "price": 1999,
    "url": "https://github.com/exORYON/db/blob/main/123403794_481755306065916_2801586288664686810_n.jpg?raw=true"
  },
  {
    "name": "SLICER Marine",
    "descr": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lobortis dictum neque, at tincidunt eros convallis quis. Donec ultricies sapien in lobortis pretium. Sed suscipit ipsum dolor, at pellentesque metus auctor quis. Suspendisse rhoncus ultricies mi, nec pharetra turpis tincidunt et.",
    "price": 1500,
    "url": "https://github.com/exORYON/db/blob/main/139852253_224291332519618_4265951042297070639_n.jpg?raw=true"
  },
  {
    "name": "SLICER Sneaky",
    "descr": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lobortis dictum neque, at tincidunt eros convallis quis. Donec ultricies sapien in lobortis pretium. Sed suscipit ipsum dolor, at pellentesque metus auctor quis. Suspendisse rhoncus ultricies mi, nec pharetra turpis tincidunt et.",
    "price": 1499,
    "url": "https://github.com/exORYON/db/blob/main/140370870_692321638119443_8194939502407238248_n.jpg?raw=true"
  },
  {
    "name": "SLICER Markne",
    "descr": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lobortis dictum neque, at tincidunt eros convallis quis. Donec ultricies sapien in lobortis pretium. Sed suscipit ipsum dolor, at pellentesque metus auctor quis. Suspendisse rhoncus ultricies mi, nec pharetra turpis tincidunt et.",
    "price": 1500,
    "url": "https://github.com/exORYON/db/blob/main/139852253_224291332519618_4265951042297070639_n.jpg?raw=true"
  },
];

let currentPage = 1;

addEvent
addEvent

getDataFromBe() => list

updateContent()

nextPage()

prevPage()