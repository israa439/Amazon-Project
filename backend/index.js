import products from "../data/products.js";
import { cart, addToCart } from "../backend/cart.js";

let searchBar = document.getElementById("searchbar");
let searchBtn = document.getElementById("searchbtn");
let container = document.getElementById("products");
let burgerIcon = document.getElementById("bg-icon");
let ratings;

searchBar.addEventListener("input", getInput);
searchBar.addEventListener("keypress", handleKeyPress);
searchBtn.addEventListener("click", searchItems);
burgerIcon.addEventListener("click", burgerClick);

for (let i = 0; i < products.length; i++) {
  renderItems(products[i], i);
}
function getInput() {
  let typedText = searchBar.value;
  return typedText;
}
function searchItems() {
  let res = getInput();
  let filteredProducts = products.filter((product) => {
    let hasMatchingKeyword = product.keywords.some((keyword) => {
      return keyword.toLocaleLowerCase().includes(res);
    });
    return hasMatchingKeyword;
  });
  renderSearchedItems(filteredProducts);
}
function renderSearchedItems(p) {
  container.innerHTML = ``;
  if (p.length > 0) {
    for (let i = 0; i < p.length; i++) {
      renderItems(p[i], i);
    }
    modifyImage(p);
    sizeFocus();
    colorFocus();
    addToCartFun();
  } else {
    container.innerHTML = "no products matched your search.";
  }
}
function handleKeyPress(event) {
  if (event.key === "Enter") {
    searchItems();
  }
}
function renderItems(item, i) {
  ratings = `${item.rating.stars}`;

  let dives = document.createElement("div");
  dives.classList.add("container");
  dives.setAttribute("data-index", `${i}`);
  dives.innerHTML = `
    <div class="product-image-container">
            <img class="product-image" src="${item.image}">
    </div>
    <div class="product-name">${item.name}</div>
    
    <div class="product-rating-container">
        <img class="product-rating-stars"
            src="images/ratings/rating-${ratings * 10}.png">
         <div class="product-rating-count link-primary">${
           item.rating.count
         }</div>
    </div>
     <div class="product-price">$ <span class="price-nb">${
       item.priceCents / 100
     }</span></div>
             <div class="product-quantity-container">
            <select class="quantity-select"> ${generateQuantityOptions()}</select>
          </div> 
            <div class="product-spacer"></div>

    `;

  if (item.colorVariations) {
    let buttonsHTML = "";
    let variation = item.colorVariations[0];
    let firstKey = Object.keys(variation)[0];
    for (let i = 0; i < item.colorVariations.length; i++) {
      buttonsHTML += `<button class="colorBtn">${item.colorVariations[i][firstKey]}</button>`;
    }

    dives.innerHTML += `<p class="btn-header-color">${firstKey}</p><div class="colored-btn-container">${buttonsHTML}</div> `;
  }
  if (item.sizeVariation) {
    let buttonsHTML = "";
    let variation = item.sizeVariation[0];
    let firstKey = Object.keys(variation)[0];
    let sizes = Object.values(variation)[0];
    let formattedString = firstKey.replace(/_/g, " ");
    for (let i = 0; i < sizes.length; i++) {
      buttonsHTML += `<button class="sizeBtn">${sizes[i]}</button>`;
    }
    dives.innerHTML += `<p class="btn-header-size">${formattedString}</p><div class="Sized-btn-container">${buttonsHTML}</div>`;
  }

  dives.innerHTML += `
        <div class="added-to-cart">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary" data-product-name="${item.name}" data-product-id="${item.id}">
            Add to Cart
          </button>
        `;

  container.appendChild(dives);
}
async function modifyImage(products) {
  let parentDiv = document.querySelectorAll(".container");
  parentDiv.forEach((div) => {
    div.addEventListener("click", (e) => {
      let i = div.getAttribute("data-index");
      let btns = div.querySelectorAll(".colorBtn");
      btns.forEach((btn, index) => {
        btn.addEventListener("click", () => {
          let newImg = div.querySelector(".product-image");
          newImg.src = `${products[i].colorVariations[index].image}`;
        });
      });
    });
  });
}
modifyImage(products);
function generateQuantityOptions() {
  let options = "";
  for (let i = 1; i <= 10; i++) {
    options += `<option value="${i}">${i}</option>`;
  }
  return options;
}

async function addToCartFun() {
  let cartBtns = document.querySelectorAll(".add-to-cart-button");
  cartBtns.forEach((btn) => {
    let colorSelect = btn.parentElement.querySelectorAll(".colorBtn");
    let sizeSelect = btn.parentElement.querySelectorAll(".sizeBtn");
    let selectedColor;
    let selectedSize;
    let colorHeader;
    let sizeHeader;
    btn.addEventListener("click", () => {
      if (colorSelect.length > 1) {
        selectedColor = getColor(colorSelect);
        colorHeader = getColorHeader(btn);
      }
      if (sizeSelect.length > 1) {
        selectedSize = getColor(sizeSelect);
        sizeHeader = getSizeHeader(btn);
      }
      let imageUrl = getImage(btn);
      let selectedQuantity = getQuantity(btn);
      let price = getPrice(btn);

      let productid = btn.getAttribute("data-product-id");
      let productName = btn.getAttribute("data-product-name");

      renderText(btn);

      addToCart(
        productid,
        productName,
        selectedQuantity,
        selectedColor,
        selectedSize,
        imageUrl,
        price,
        colorHeader,
        sizeHeader
      );
      updateCartQuantity();
    });
  });
}
addToCartFun();

function getColorHeader(btn) {
  let parentElement = btn.parentElement.querySelector(".btn-header-color");
  let colorHeader = parentElement.innerHTML;
   let formattedString = colorHeader.replace(/_/g, " ");
   return formattedString;
 
}
function getSizeHeader(btn) {
  let parentElement = btn.parentElement.querySelector(".btn-header-size");
  let sizeHeader = parentElement.innerHTML;
  let formattedString = sizeHeader.replace(/_/g, " ");
  return formattedString;
}

function getPrice(btn) {
  let parent = btn.parentElement.querySelector(".price-nb");
  let price = parent.innerHTML;
  return price;
}
function getImage(btn) {
  let selectedImage = btn.parentElement.querySelector(".product-image");
  let url = selectedImage.src;
  return url;
}
function getQuantity(btn) {
  const quantitySelect = btn.parentElement.querySelector(".quantity-select");
  let selectedQuantity = parseInt(quantitySelect.value) || 1;
  quantitySelect.addEventListener("change", function () {
    selectedQuantity = parseInt(this.value);
  });
  return selectedQuantity;
}
function getColor(colorBtns) {
  let specifiedBtn;
  colorBtns.forEach((button) => {
    let computedStyle = getComputedStyle(button);
    let borderColor = computedStyle.borderColor;
    if (borderColor === "rgb(255, 145, 0)") {
      specifiedBtn = button.textContent;
    }
  });
  return specifiedBtn;
}
function updateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  document.getElementById("cartamount").innerHTML = cartQuantity;
  document.getElementById("cartamount-mobile").innerHTML = cartQuantity;

  return cartQuantity;
}
updateCartQuantity();
function renderText(btn) {
  let message = btn.parentElement.querySelector(".added-to-cart");
  message.style.opacity = "1";
  setTimeout(() => {
    message.style.opacity = "0";
  }, 3000);
}
async function colorFocus() {
  document.querySelectorAll(".container").forEach((card) => {
    card
      .querySelectorAll(".colored-btn-container button")
      .forEach((button, index) => {
        button.addEventListener("click", () => {
          button.classList.add("focused");
          card
            .querySelectorAll(".colored-btn-container button:not(:focus)")
            .forEach((otherButton) => {
              otherButton.classList.remove("focused");
            });
        });
        if (index === 0) {
          button.classList.add("focused");
        }
      });
  });
}
colorFocus();

async function sizeFocus() {
  document.querySelectorAll(".container").forEach((card) => {
    card
      .querySelectorAll(".Sized-btn-container button")
      .forEach((button, index) => {
        button.addEventListener("click", () => {
          button.classList.add("focused");
          card
            .querySelectorAll(".Sized-btn-container button:not(:focus)")
            .forEach((otherButton) => {
              otherButton.classList.remove("focused");
            });
        });
        if (index === 0) {
          button.classList.add("focused");
        }
      });
  });
}
sizeFocus();

function burgerClick() {
  let amazonHeader = document.getElementById("amazon-header");
  let ordersSection = document.getElementById("orders");
  let cartsSection = document.getElementById("cart");

  if (window.innerWidth > 575) {
    amazonHeader.classList.remove("active");
    ordersSection.classList.remove("active");
    cartsSection.classList.remove("active");
  } else {
    amazonHeader.classList.toggle("active");
    ordersSection.classList.toggle("active");
    cartsSection.classList.toggle("active");
  }
}
