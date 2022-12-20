import { priceFormatter as formatter } from "../utils/helpers.js";
import { showModal } from "../modal.js";

import { BooksApi } from "./getBooksFromApi.js";

export class Books {
  constructor(author, title, price, category, date, publisherName, rate) {
    this.author = author;
    this.title = title;
    this.price = price;
    this.category = category;
    this.date = date;
    this.publisherName = publisherName;
    this.rate = rate;
  }

  renderBooks(arr, loading, books_content) {
    let result = loading
      ? `<div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
</div>`
      : arr.length === 0
      ? "<p>No content</p>"
      : "";

    arr.forEach((element) => {
      result += `
        <div class="cost">
        <img src="./img/garri.webp" alt="" class="garri" />
        <div>
        <h3>${element.title}</h3>
          <p>
           ${element.desc}
          </p>
          <p>by  ${element.author}, et al. | Apr 24, ${element.publishyear}</p>
          <img src="./img/i.png" alt="i" />
          <p>Cost: ${formatter(element.price)} so'm</p>
          <div class="button">
            <button class="Edit" data-id=${element.id}>Edit</button>
            <button class="Delete"  data-id=${element.id}>Delete</button>
          </div>
        </div>
      </div>
        

        `;
    });

    const editCardFunc = new BooksApi(
      "https://test-book-e1835-default-rtdb.firebaseio.com"
    );

    books_content.innerHTML = result;

    const cardsEditBtns = document.querySelectorAll(".Edit");

    cardsEditBtns.forEach((item) => {
      item.addEventListener(
        "click",
        editCardFunc.editCard.bind(editCardFunc, item.dataset.id)
      );
    });
  }
}
