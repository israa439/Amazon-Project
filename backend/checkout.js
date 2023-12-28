import { removeFromStorage } from "../backend/cart.js";
let generatedIds = [];
let value = localStorage.getItem("Cart");
let paymentContainer = document.getElementById("paymentSummary");
let productsInCart = JSON.parse(value);
let conatiner = document.getElementById("orderSummary");

if (productsInCart.length === 0) {
  emptyCart();
} else {
  for (let i = 0; i < productsInCart.length; i++) {
    renderItems(productsInCart[i], i);
  }
}
function renderItems(item, i) {
  let card = document.createElement("div");
  card.classList.add("cards");
  card.setAttribute("card-index", i);

  card.innerHTML = `
  <div class="delivery-date-header">Delivery date:
    <span class="chosen-date-header">${getDate(7)}</span>
  </div>
    <div class="item">
      <div class="item-info">
         <div class="image-container"><img class="item-image" src="${
           item.image
         }"></div>
         <div class="item-details">
            <h4 class="item-name">${item.productName}</h4>
            <p class="item-price">$ 
               <span class="price">${item.priceCents}</span>
            </p>
          </div>  
      </div>
    </div> 

  `;
  if (item.selectedColor) {
    let itemDetails = card.querySelector(".item-details");
    itemDetails.innerHTML += `
    <p class="color-info">
    <span class="color-header">${item.colorHeader}:</span>
    <span class="color-value">${item.selectedColor}</span>
    </p>
    `;
  }
  if (item.selectedSize) {
    let itemDetails = card.querySelector(".item-details");
    itemDetails.innerHTML += `
    <p class="size-info">
    <span class="size-header">${item.sizeHeader}:</span>
    <span class="size-value">${item.selectedSize}</span>
    </p>
    `;
  }
  let itemDetails = card.querySelector(".item-details");
  itemDetails.innerHTML += `
     <p class="quantity-info">
        <span class="item-quantity"> Quantity:</span>
        <span class="edit-container"><span class="qty" > ${item.quantity}</span>
        <button class="edit-btn">Edit</button></span>
        <button class="delete-btn">Delete</button>

     </p>
     `;

  let itemDiv = card.querySelector(".item");
  itemDiv.innerHTML += `
  <div class="date-info">
      <h4 class="date_options_header">choose a delivery option:</h4>
      <form>
        <div class="options-container">
          <input type="radio" id="7BD" name="choose_date" checked class="radio-btn"/>
          <label for="7bd">
            <span class="shipping-date">${getDate(7)}</span>
            <span class="shipping-price-container">Free Shipping</span>
          </label>
        
        </div>
        <div class="options-container">
          <input type="radio" id="3BD" name="choose_date"class="radio-btn" />
          <label for="3bd">
            <span class="shipping-date">${getDate(3)}</span>
            <span class="shipping-price-container">$
            <span class="shipping-price">4.99</span>- Shipping
            </span>
          </label>
        </div>
        <div class="options-container">
          <input type="radio" id="1BD" name="choose_date" class="radio-btn"/>
          <label for="1bd">
            <span class="shipping-date">${getDate(1)}</span>
            <span class="shipping-price-container">$
             <span class="shipping-price">9.99</span> - Shipping
            </span>
          </label>
        </div>
      </form>
    </div>
      `;

  conatiner.appendChild(card);
}
function updateCartnb() {
  let qty = 0;
  let parents = document.querySelectorAll(".cards");
  parents.forEach((parent) => {
    let qtyParent = parent.querySelector(".qty");
    let parseqty = parseInt(qtyParent.innerHTML, 10);
    qty += parseqty;
  });
  let cart = document.getElementById("cartamount");
  cart.innerHTML = qty;
  return qty;
}
document.addEventListener("DOMContentLoaded", () => {
  updateCartnb();
  payment();
  shippingPrices();
  totalPrice();
  taxes();
  oredrTotal();
  emptyOrder();
});
conatiner.addEventListener("click", (event) => {
  let card = event.target.closest(".cards");
  if (event.target.classList.contains("edit-btn")) {
    let cardIndex = card.getAttribute("card-index");
    quantityEdit(event.target, cardIndex);
  } else if (event.target.classList.contains("delete-btn")) {
    let cardIndex = card.getAttribute("card-index");
    deletBtn(cardIndex);
  } else if (event.target.classList.contains("radio-btn")) {
    getSelectedDate(card, event.target);
  }
  totalPrice();
  taxes();
  oredrTotal();
});
function quantityEdit(btn, cardIndex) {
  let parent = btn.parentElement;
  let oldValue = parent.parentElement.querySelector(".qty").innerHTML;
  let parsedOldValue = parseInt(oldValue, 10);
  parent.innerHTML = `
    <input type="number" min="1" max="15" value="${parsedOldValue}" class="input">
    <button class="save-btn">Save</button>
    `;

  let saveBtn = parent.querySelector(".save-btn");
  let newValue = parent.querySelector(".input");

  saveBtn.addEventListener("click", () => {
    let NewVal = newValue.value;
    let parsedNewValue = parseInt(NewVal, 10);

    parent.innerHTML = `
      <span class="qty">${parsedNewValue}</span>
      <button class="edit-btn">Edit</button>
      `;

    updateLocalStorage(cardIndex, parsedNewValue);
    payment();
  });
}
function updateLocalStorage(i, newval, newdate) {
  if (newval) {
    productsInCart[i].quantity = newval;
    localStorage.setItem("Cart", JSON.stringify(productsInCart));
    updateCartnb();
  }
  if (newdate) {
    productsInCart[i].deliveryOptionId = newdate;
    localStorage.setItem("Cart", JSON.stringify(productsInCart));
  }
}
function deletBtn(i) {
  removeFromStorage(productsInCart[i], productsInCart);
  location.reload();
}
function getDate(businessDays) {
  let currentDate = new Date();
  let chosenDate = new Date(currentDate);

  let i = 0;
  while (i < businessDays) {
    chosenDate.setDate(chosenDate.getDate() + 1);
    if (chosenDate.getDay() !== 0 && chosenDate.getDay() !== 6) {
      i++;
    }
  }

  let monthAsNb = chosenDate.getMonth();
  let dayAsNb = chosenDate.getDay();
  let dayofMonth = chosenDate.getDate();

  let daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let monthsofYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let day = daysOfWeek[dayAsNb];
  let month = monthsofYear[monthAsNb];

  return `${day},${month} ${dayofMonth}`;
}
function getSelectedDate(card, radioBtn) {
  let parent = radioBtn.parentElement;
  let specifiedDate = parent.querySelector(".shipping-date").innerHTML;
  let dateHeader = card.querySelector(".chosen-date-header");
  dateHeader.innerHTML = specifiedDate;

  payment();
}
function emptyCart() {
  conatiner.innerHTML = `
<p class="empty-cart-header">Your cart is empty.</p>
<a href="index.html">
<button class="empty-cart-btn">view products</button>
</a>
`;
}
function payment() {
  paymentContainer.innerHTML = `
    <h3 class="payment-header">Order Summary</h3>
  <div class="item-shipping-container">
    <div class="items-shipping-details">
      <span class="item-header">
        Items (<span class="item-amount">${updateCartnb()}</span>):
      </span>
      <span>Shipping & handling:</span>
    </div>
    <div class="item-shipping-prices">
      <span class="items-total-price">$${itemsPrices()}</span>
      <span class="shipping-total-price">$${shippingPrices()}</span>
      <div class="short-space-div"></div>
    </div>
  </div>
  <br />

  <div class="item-shipping-container">
    <div class="items-shipping-details">
      <span class="item-header">Total before tax:</span>
      <span>Estimated Tax(10%):</span>
    </div>

    <div class="item-shipping-prices">
      <span class="items-total-price">$${totalPrice()}</span>
      <span class="shipping-total-price">$${taxes()}</span>
    </div>
  </div>
  <div class="space-div"></div>
  <div class="item-shipping-container">
    <p class="total-header">Order total:</p>
    <p class="total-price">$${oredrTotal()}</p>
  </div>
<button class="place-order-btn">Place Your Order</button>
  `;
}
function itemsPrices() {
  let total = 0;
  let parents = document.querySelectorAll(".cards");
  parents.forEach((parent) => {
    let priceParent = parent.querySelector(".price");
    let qtyParent = parent.querySelector(".qty");
    if (qtyParent) {
      let parseprice = parseFloat(priceParent.innerHTML, 10);
      let parseqty = parseInt(qtyParent.innerHTML, 10);
      total += parseprice * parseqty;
    }
  });
  let roundedTotal = parseFloat(total.toFixed(2));

  return roundedTotal;
}
function shippingPrices() {
  let total = 0;
  let parents = document.querySelectorAll(".cards");
  parents.forEach((parent) => {
    let selectedRadioButton = parent.querySelector(
      'input[name="choose_date"]:checked'
    );
    let selectedParent = selectedRadioButton.parentElement;
    let priceContainer = selectedParent.querySelector(".shipping-price");
    let price;
    if (priceContainer) {
      price = parseFloat(priceContainer.innerHTML, 10);
    } else {
      price = 0;
    }

    total += price;
  });
  return total;
}
function totalPrice() {
  let itemToatl = itemsPrices();
  let shippingTotal = shippingPrices();
  let total = itemToatl + shippingTotal;
  let roundedQty = total.toFixed(2);
  return roundedQty;
}
function taxes() {
  let total = totalPrice();
  let tax = 0.1 * total;
  let roundedTax = tax.toFixed(2);
  return roundedTax;
}
function oredrTotal() {
  let tax = parseFloat(taxes(), 10);
  let price = parseFloat(totalPrice(), 10);
  let total = parseFloat(tax + price, 10);
  let roundedTotal = total.toFixed(2);
  return roundedTotal;
}
function emptyOrder() {
  let btn = paymentContainer.querySelector(".place-order-btn");
  if (productsInCart.length === 0) {
    btn.style.cursor = "not-allowed";
    btn.style.opacity = "0.5";
  }
}

paymentContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("place-order-btn")) {
    getDateHeader();
  }
});

function getDateHeader() {
  let cards = conatiner.querySelectorAll(".cards");
  cards.forEach((card, i) => {
    let date = card.querySelector(".chosen-date-header");
    updateLocalStorage(i, undefined, date.innerHTML);
  });
  SavingOrder();
  window.location.href = "../orders.html";
}
function SavingOrder() {
  let orderKeys = [];
  console.log(localStorage.length);
  for (let i = 0; i < localStorage.length; i++) {
    let keys = localStorage.key(i);
    console.log(keys);
    if (keys.startsWith("order")) {
      orderKeys.push(keys);
    }
  }
  console.log(orderKeys);
  let highestNum = 0;
  orderKeys.forEach((key) => {
    let num = parseInt(key.replace("order", ""));
    highestNum = Math.max(highestNum, num);
  });
  highestNum++;
  let nextKey = "order" + highestNum;
  productsInCart.push(addObject());
  console.log(productsInCart);
  localStorage.setItem(nextKey, JSON.stringify(productsInCart));
  let newCart = [];
  localStorage.setItem("Cart", JSON.stringify(newCart));
}
for (let i = 0; i < localStorage.length; i++) {
  let key = localStorage.key(i);
  let values = localStorage.getItem(key);
  let data = JSON.parse(values);
  
}
function addObject() {
  return {
    dateOfOrder: getDateOfOrder(),
    orderID: generateRandomId(),
    total: oredrTotal(),
  };
}
function getDateOfOrder() {
  let wholeDate = getDate(0);
  let parts = wholeDate.split(",");
  let phraseAfterComma = parts[1] ? parts[1].trim() : " ";
  return phraseAfterComma;
}
function generateRandomId() {
  let randomId =
    generateRandomChars(10) +
    "-" +
    generateRandomChars(5) +
    "-" +
    generateRandomChars(2) +
    "-" +
    generateRandomChars(5);
  if (generatedIds.includes(randomId)) {
    return generateRandomId();
  }
  generatedIds.push(randomId);
  return randomId;
}
function generateRandomChars(length) {
  const characters = "YaLaTiF0123456789";
  let randomChars = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomChars += characters.charAt(randomIndex);
  }
  return randomChars;
}
