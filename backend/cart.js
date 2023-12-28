let cart = JSON.parse(localStorage.getItem("Cart")) || null;


if(!cart){
  cart = [
    {
      deliveryOptionId: "1",
      image:"http://127.0.0.1:5500/images/products/intermediate-composite-basketball.jpg",
      priceCents: "20.95",
      productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      productName: "Intermediate Size Basketball",
      quantity: 1,
    },
  ];
addToStorage(cart);
}


export async function addToStorage(c) {
  localStorage.setItem("Cart", JSON.stringify(c));
}
await addToStorage(cart);

export function removeFromStorage(product, productsInCart) {
  let id = product.productId;
  let selectedColor;
  let selectedSize;
  if (product.selectedColor) {
    selectedColor = product.selectedColor;
  }
  if (product.selectedSize) {
    selectedSize = product.selectedSize;
  }
  let result = checkItem(id, selectedColor, selectedSize, productsInCart);
  let matchingItem = result.item;
  let matchingItemIndex = result.index;
  console.log(matchingItem, matchingItemIndex);
  let newCart = [];
  for (let i = 0; i < productsInCart.length; i++) {
    if (productsInCart[i] !== matchingItem) {
      newCart.push(productsInCart[i]);
    }
  }
  cart = newCart;

  addToStorage(cart);
}
export function addToCart(
  productid,
  productName,
  selectedQuantity,
  selectedColor,
  selectedSize,
  imageURL,
  price,
  colorHeader,
  sizeHeader
) {
  let result = checkItem(productid, selectedColor, selectedSize, cart);

  let matchingItem = result.item;
  let matchingItemIndex = result.index;
  if (matchingItem) {
    cart[matchingItemIndex].quantity += selectedQuantity;
  } else {
    cart.push({
      productName: productName,
      productId: productid,
      quantity: selectedQuantity,
      deliveryOptionId: "1",
      selectedColor: selectedColor,
      selectedSize: selectedSize,
      priceCents: price,
      image: imageURL,
      colorHeader: colorHeader,
      sizeHeader: sizeHeader,
    });
  }
  addToStorage(cart);
}

export { cart };

function checkItem(productid, selectedColor, selectedSize, cart) {
  let matchingItem;
  let matchingItemIndex;
  if (selectedColor && selectedSize) {
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].productId === productid) {
        if (
          cart[i].selectedColor === selectedColor &&
          cart[i].selectedSize === selectedSize
        ) {
          matchingItem = cart[i];
          matchingItemIndex = i;
        }
      }
    }
  } else if (selectedColor) {
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].productId === productid) {
        if (cart[i].selectedColor === selectedColor) {
          matchingItem = cart[i];
          matchingItemIndex = i;
        }
      }
    }
  } else if (selectedSize) {
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].productId === productid) {
        if (cart[i].selectedSize === selectedSize) {
          matchingItem = cart[i];
          matchingItemIndex = i;
        }
      }
    }
  } else {
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].productId === productid) {
        matchingItem = cart[i];
        matchingItemIndex = i;
      }
    }
  }

  return { item: matchingItem, index: matchingItemIndex };
}
