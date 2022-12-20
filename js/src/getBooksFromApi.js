import { Books } from "./books.js";
import { showModal } from "../modal.js";
const books_content = document.querySelector("#books_content");
const form = document.querySelector("#form");
const book_title = document.querySelector("#book_title");
const author = document.querySelector("#author");
const category = document.querySelector("#category");
const price = document.querySelector("#price");
const date = document.querySelector("#date");
const publisherName = document.querySelector("#publisherName");
const rate = document.querySelector("#rate");
const add_btn = document.querySelector("#add_btn");
const loadingBtn = document.querySelector("#loading");

export class BooksApi {
  constructor(api, arr3) {
    this.api = api;

    this.arr3 = arr3;
  }

  getAllBooks(pageNumber) {
    const bookRender = new Books();

    bookRender.renderBooks(this.arr3, false, books_content);

    fetch(`${this.api}/books.json`)
      .then((res) => {
        if (!res.ok) throw res;

        return res.json();
      })
      .then((res) => {
        if (!res) bookRender.renderBooks(this.arr3, false, books_content);
        else {
          let arr2 = Object.keys(res).map((item) => {
            return {
              ...res[item],
              id: item,
            };
          });

          this.arr3 = arr2.slice(pageNumber, 4 + pageNumber);

          console.log(this.arr3, "Arr3", pageNumber);

          bookRender.renderBooks(this.arr3, false, books_content);
        }
      });
  }

  sendData(e) {
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
    const METHOD = localStorage.getItem("method") || "POST";
    const GLOBALID = localStorage.getItem("editId");
    fetch(
      METHOD === "PUT"
        ? `${this.api}/books/${GLOBALID}.json`
        : `${this.api}/books.json`,

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
        add_btn.classList.remove("d-none");
        loadingBtn.classList.add("d-none");
        showModal();
        book_title.value = "";

        this.getAllBooks();
      });
  }

  editCard(id) {
    showModal();

    console.log(this, id);
    add_btn.textContent = "Edited";
    localStorage.setItem("editId", id);
    localStorage.setItem("method", "PUT");

    fetch(`${this.api}/books/${id}.json`)
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
}

const bookApi = new BooksApi(
  "https://test-book-e1835-default-rtdb.firebaseio.com",
  []
);

form.addEventListener("submit", bookApi.sendData.bind(bookApi));
