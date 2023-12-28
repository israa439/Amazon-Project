let main = document.getElementById("main");
let modifiedLS = JSON.parse(sessionStorage.getItem("modifiedLS"));
let modifiedItem = JSON.parse(sessionStorage.getItem("modifiedItem"));
console.log(modifiedItem, modifiedLS);

let last_element = modifiedLS.length - 1;
let dateOfOrder = modifiedLS[last_element].dateOfOrder;
let dateOfArrival = modifiedItem.deliveryOptionId;

main.innerHTML += `
<h2 class="date-header">Arriving on:
 <span class="date">${dateOfArrival}</span>
</h2>
<p class="item">${modifiedItem.productName}</p>`;

if (modifiedItem.selectedColor) {
  main.innerHTML += `<p class="item">${modifiedItem.colorHeader}:
         <span class="color">${modifiedItem.selectedColor}</span>
         </p>`;
}
if (modifiedItem.selectedSize) {
  main.innerHTML += `<p class="item">${modifiedItem.sizeHeader}:
         <span class="color">${modifiedItem.selectedSize}</span>
         </p>`;
}
main.innerHTML += `
<p class="item"> Quantity: <span class="arrival-date">${modifiedItem.quantity}</span></p>
<div class="image-container">
      <img class="img" src="${modifiedItem.image}" />
    </div>
<div class="timing-headers">
 <span class="preparing">Preparing</span>
 <span class="Shipped">Shipped</span>
 <span class="Delivered">Delivered</span>
</div>
<div class="timing-container">
<div class="timing"></div>
</div>
`;
function timeCalculation() {
  let currentDate = new Date();
  let startDate = new Date(dateOfOrder + " " + currentDate.getFullYear());
  let endDate = new Date(dateOfArrival);
  if (startDate.getMonth() > endDate.getMonth()) {
    endDate = new Date(
      dateOfArrival + " " + parseInt(currentDate.getFullYear() + 1)
    );
  } else {
    endDate = new Date(
      dateOfArrival + " " + parseInt(currentDate.getFullYear())
    );
  }

  let timePassed = currentDate - startDate;
  let totalTime = endDate - startDate;

  const percentagePassed = (timePassed / totalTime) * 100;
  const roundedPercentage = Math.round(percentagePassed * 100) / 100;
  return roundedPercentage;
}

function tracking() {
  let width = timeCalculation();
  let div = main.querySelector(".timing");

  console.log(width);
  if (width >= 98 && width >= 100) {
    width = 100;
    let header = main.querySelector(".Delivered");
    header.style.color = "green";
  } else if (width >= 0 && width < 45) {
    let header = main.querySelector(".preparing");
    header.style.color = "green";
  } else if (width >= 45 && width < 98) {
    let header = main.querySelector(".Shipped");
    header.style.color = "green";
  }
  div.style.width = width + "%";
}
setTimeout(tracking, 100);
