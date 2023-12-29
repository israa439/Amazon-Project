import { cart, addToCart } from "../backend/cart.js";

let cartnb = document.getElementById("cartnb");
let orderNb = document.getElementById("ordersAmount");
let container = document.getElementById("main");
let counter = 0;

function cartNb() {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total += parseInt(cart[i].quantity, 10);
  }
  cartnb.innerHTML = total;
}
cartNb();
for (let i = localStorage.length - 1; i >= 0; i--) {
  let key = localStorage.key(i);

  if (key.startsWith("order")) {
    let values = localStorage.getItem(key);
    let data = JSON.parse(values);
    renderOrders(data, i);
    counter += 1;
  }
  ordersAmount(counter);
}

function ordersAmount(total) {
  orderNb.innerHTML = total;
}
function renderOrders(data, j) {
  let lastElement = data.length - 1;
  let card = document.createElement("div");
  card.classList.add("cards");
  card.setAttribute("data-index", `${j}`);
  card.innerHTML += `
  <div class="upper-part">
        <div class="date-price-container">
          <div class="date-container">
            <div class="date-header">Order Placed:</div>
            <div class="date">${data[lastElement].dateOfOrder}</div>
          </div>

          <div class="price-container">
            <div class="price-header">Total:</div>
            <div class="total">
              $<span class="total-price">${data[lastElement].total}</span>
            </div>
          </div>
        </div>

        <div class="order-id-container">
          <div class="order-id-header">Order ID:</div>
          <div class="order-id">${data[lastElement].orderID}</div>
        </div>
      </div>
     
    `;
  let lowerPart = document.createElement("div");
  lowerPart.classList.add("lower-part");
  for (let i = 0; i < data.length - 1; i++) {
    let itemContainer = document.createElement("div");
    itemContainer.classList.add("item-container");
    itemContainer.setAttribute("data-index", `${i}`);
    itemContainer.innerHTML += `
     <div class="image-container">
      <img class="img" src="${data[i].image}" />
    </div>
    <div class="item-tracking-container">
      <div class="item-details">
        <h3 class="item-name">${data[i].productName}</h3>

        <p class="arrival-header">
          Arriving on:
          <span class="arrival-date">${data[i].deliveryOptionId}</span>
        </p>

        <p class="arrival-header">
          Quantity: <span class="arrival-date">${data[i].quantity}</span>
        </p>

         ${
           data[i].selectedColor
             ? `<p class="color-selection">${data[i].colorHeader}:
         <span class="color">${data[i].selectedColor}</span>
         </p>`
             : ""
         }

          ${
            data[i].selectedSize
              ? `<p class="color-selection">${data[i].sizeHeader}:
         <span class="color">${data[i].selectedSize}</span>
         </p>`
              : ""
          }
          <button class="button-primary order-again">
          <img src="images/icons/buy-again.png"  />
          <p>Buy it again</p>
          </button>
      </div>

      <div class="tracking-container">
      <button class="track-btn">Track Package</button>
      </div>
    </div>
  
    `;
    lowerPart.appendChild(itemContainer);
  }
  card.appendChild(lowerPart);

  container.appendChild(card);
}

container.addEventListener("click", (event) => {
  let card = event.target.closest(".cards");
  let item = event.target.closest(".item-container");
  let iLocalStorage = card.getAttribute("data-index");
  let iData = item.getAttribute("data-index");
  if (event.target.closest(".button-primary")) {
    let modifiedItem = buyAgain(iLocalStorage, iData);
    updatingCart(modifiedItem);
    cartNb();
  } else if (event.target.closest(".tracking-container")) {
    let modifiedLS = localStorage.getItem(localStorage.key(iLocalStorage));
    let modifiedItem = buyAgain(iLocalStorage, iData);
    console.log(modifiedLS, modifiedItem);
    console.log(typeof(modifiedLS))
    sessionStorage.setItem("modifiedLS", modifiedLS);
    sessionStorage.setItem("modifiedItem", JSON.stringify(modifiedItem));
   let arr = window.location.href.split("/");
   arr[arr.length - 1] = "tracking.html";
   window.location.href = arr.join("/");
  }
});
function buyAgain(iLocalStorage, iData) {
  let modifiedLS = localStorage.getItem(localStorage.key(iLocalStorage));

  let items = JSON.parse(modifiedLS);
  let modifiedItem = items[iData];
  return modifiedItem;
}
function updatingCart(modifiedItem) {
  addToCart(
    modifiedItem.productId,
    modifiedItem.productName,
    1,
    modifiedItem.selectedColor,
    modifiedItem.selectedSize,
    modifiedItem.image,
    modifiedItem.priceCents,
    modifiedItem.colorHeader,
    modifiedItem.sizeHeader
  );
}


