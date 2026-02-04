document.addEventListener("DOMContentLoaded", () => {
  const booksContainer = document.querySelector("#books-container");
  const cardTemplate = document.querySelector("#card-template");
  const fragment = document.createDocumentFragment();
  const shuffleButton = document.querySelector("#shuffle");

  let books = [];

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  function sortAndShuffle(items) {
    const groups = {};

    items.forEach((item) => {
      let key;
      if (item.sort !== null && item.sort !== undefined) {
        key = item.sort;
      } else {
        key = Infinity;
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });

    const orderedKeys = Object.keys(groups).sort((a, b) => {
      return Number(a) - Number(b);
    });

    let result = [];
    orderedKeys.forEach((key) => {
      const group = groups[key];
      const shuffledGroup = shuffleArray([...group]);
      result.push(...shuffledGroup);
    });

    return result;
  }

  const render = () => {
    if (!books.length) return;
    let soredBooks = sortAndShuffle(books);
    soredBooks.forEach((book) => {
      const newCard = cardTemplate.content.cloneNode(true);

      const article = newCard.querySelector(".card");
      const titleLink = newCard.querySelector(".card__link");
      const author = newCard.querySelector(".card__author");
      const description = newCard.querySelector(".card__description");
      const image = newCard.querySelector("img");

      titleLink.textContent = book.title;
      titleLink.href = book.link;
      author.textContent = book.author;
      description.textContent = book.description;
      image.src = book.cover;
      image.alt = `Обложка книги «${book.title}»`;

      if (Object.hasOwn(book, "sort") && book.sort !== null) {
        article.setAttribute("data-sort", book.sort);
      }

      fragment.appendChild(newCard);
    });
    booksContainer.innerHTML = "";
    booksContainer.appendChild(fragment);
  };

  fetch("./books.json")
    .then((res) => res.json())
    .then((data) => {
      books = data;
      render();
      booksContainer.classList.add("loaded");
    })
    .catch((err) => console.log(err.message));

  shuffleButton.addEventListener("click", function () {
    render();
  });

  document.addEventListener("click", function (e) {
    const href = e.target.closest("a")?.getAttribute("href");
    if (href === "#" || href === "") {
      e.preventDefault();
    }
  });
});
