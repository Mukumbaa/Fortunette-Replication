import * as FortunetteToolkit from "./fortunette-toolkit/src/index.js"

const BASE_PRICE = 8;
const maxToppings = 3;
const totalPriceDisplay = document.getElementById('total-price');
const futurePriceDisplay = document.getElementById('future-price');
const checkboxes = document.querySelectorAll('.topping');

function getTotalPrice() {
  const selected = Array.from(checkboxes).filter(cb => cb.checked);
  const toppingTotal = selected.reduce((sum, cb) => sum + parseFloat(cb.dataset.price), 0);
  return BASE_PRICE + toppingTotal;
}

function updateTotalDisplay() {
  totalPriceDisplay.textContent = `€${getTotalPrice().toFixed(2)}`;
  futurePriceDisplay.textContent = ''; // clear on action
}

const checkbox_fortunette = FortunetteToolkit.FortunetteExclusiveCheckboxes(checkboxes, 3, "toppings")
checkbox_fortunette.updateOptions({
  onConfirm: (el, state) => {
    if (state.blocked) {
      el.checked = false;
      alert("You can only select up to 3 toppings.");
      return;
    }
    setTimeout(() => {
      updateTotalDisplay();
    }, 0);
  }
})


updateTotalDisplay(); // initial
