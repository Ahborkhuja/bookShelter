const showModalBtn = document.querySelector(".Add_add");
const cancelbtn = document.querySelector("#cancelbtn");
const add_btn = document.querySelector("#add_btn");

import { showModal } from "./modal.js";
import { Books } from "./src/books.js";
import { BooksApi } from "./src/getBooksFromApi.js";
const api = "https://test-book-e1835-default-rtdb.firebaseio.com";
let PAGENumber = 0;

let METHOD = "POST";
let GLOBALID;

const categoryOptions = [
  {
    name: "Comedy",
    value: "comedy",
  },
  {
    name: "Romance",
    value: "romance",
  },
];

let arr3 = [];

const booksApi = new BooksApi(api, arr3);

// booksApi.getAllBooks(PAGENumber);

function sendData(e) {
  e.preventDefault();

  const bookObj = new Books(
    author.value,
    book_title.value,
    price.value,
    category.value,
    date.value,
    publisherName.value,
    rate.value
  );

  add_btn.classList.add("d-none");
  loadingBtn.classList.remove("d-none");

  fetch(
    METHOD === "POST " ? `${api}/books.json` : `${api}/books/${GLOBALID}.json`,
    {
      method: METHOD,
      body: JSON.stringify(bookObj),
    }
  )
    .then((res) => {
      if (!res.ok) throw res;

      return res.json();
    })
    .then((res) => {
      console.log(res);
      add_btn.classList.remove("d-none");
      loadingBtn.classList.add("d-none");
      showModal();
      book_title.value = "";

      booksApi.getAllBooks();
      METHOD = "POST";
    });
}

function showCategoryOptions() {
  let result = "";

  categoryOptions.forEach((item) => {
    result += ` <option value="${item.value}">${item.name}</option>`;
  });

  category.innerHTML = result;
}

function deleteCard(id) {
  const idCard = id;

  fetch(`${api}/books/${idCard}.json`, {
    method: "DELETE",
  })
    .then((res) => {
      if (!res.ok) throw res;

      return res.json();
    })
    .then((res) => {
      console.log(res);
      arr3 = [];
      booksApi.getAllBooks();
    });
}

showCategoryOptions();

function editCard(id) {
  showModal();

  add_btn.textContent = "Edited";
  METHOD = "PUT";
  GLOBALID = id;

  fetch(`${api}/books/${id}.json`)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      console.log(res);

      book_title.value = res.title;
      author.value = res.author;
      price.value = res.price;
      category.value = res.category;
      date.value = res.date;
      publisherName.value = res.publisherName;
      rate.value = res.rate;
    });
}

// fetch(
//   "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD6dI5xg7TXQkd5qW2wlmBB-p7vZ9CFHPo",
//   {
//     method: "POST",
//     body: JSON.stringify({
//       email: "bohodir29102001@gmail.com",
//       password: "bohodir29102001<>",
//       returnSecureToken: true,
//     }),
//   }
// )
//   .then((res) => {
//     console.log;

//     return res.json();
//   })
//   .then((res) => {
//     console.log(res);
//   });

showModalBtn.addEventListener("click", () => {
  showModal();

  add_btn.textContent = "Kitob qoshish";
});
cancelbtn.addEventListener("click", showModal);

function getToken() {
  fetch(
    "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA-lymwE5eyWw5bZF9QP8lcSaw3AFuHL9s",
    {
      method: "POST",
      body: JSON.stringify({
        email: "axbor.yodgorov@gmail.com",
        password: "123456789",
        returnSecureToken: true,
      }),
    }
  )
    .then((res) => {
      if (!res.ok) throw res;
      return res.json();
    })
    .then((res) => {
      console.log(res);
    })
    .catch((value) => {
      console.log(value);
    });
}

getToken();

// navigator.geolocation.getCurrentPosition((res) => {
//   console.log(res);
// });

window.addEventListener("load", () => {
  createObserver();
});

const rootElement = document.querySelector("#showScroll");

function createObserver() {
  let observer;

  let options = {
    root: null,
    rootMargin: "10px",
    threshold: 0,
  };

  observer = new IntersectionObserver((res) => {
    if (PAGENumber > 9) {
      return;
    }

    console.log("Intersection", res[0].boundingClientRect.y);
    // if()

    booksApi.getAllBooks(PAGENumber);
    PAGENumber += 4;
  }, options);
  observer.observe(rootElement);
}
