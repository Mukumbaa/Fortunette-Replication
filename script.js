import * as FortunetteToolkit from "./fortunette-toolkit/src/index.js"

//SIMPLE CHECKBOX
const simple_cbx = document.getElementById("simple_cbx");
const simplecbx = FortunetteToolkit.FortunetteCheckbox(simple_cbx);
simplecbx.updateOptions({feedforwardOffset: 4});
// simplecbx.setCheckColor('#1234ff');

//TERMS ACCEPTANCE
const checkbox = document.getElementById('agree');
const submitBtn = document.getElementById('submit-btn');
const termsacceptance = FortunetteToolkit.FortunetteTermsAcceptance(checkbox, submitBtn, "accetta", 'termsGroup');
termsacceptance.updateOptions({feedforwardOffset: 4});
// termsacceptance.setDisabledColor('#e74cff');

//RAGIO CHECKBOXES
const radiocheckboxes = [
  document.getElementById('option1'),
  document.getElementById('option2'),
  document.getElementById('option3'),
  document.getElementById('option4'),
];

const radioGroup = FortunetteToolkit.FortunetteRadioGroup(radiocheckboxes, 'radioGroup');
radioGroup.updateOptions({feedforwardOffset: 4});
// radioGroup.setOpacity(0.5);

//EXCLUSIVE CHECKBOXES
const exclusiveCheck = [
  document.getElementById('cbx1'),
  document.getElementById('cbx2'),
  document.getElementById('cbx3'),
  document.getElementById('cbx4'),
  document.getElementById('cbx5'),
];

const exclusiveGroup = FortunetteToolkit.FortunetteExclusiveCheckboxes(exclusiveCheck, 2, 'exclusiveGroup');
exclusiveGroup.setMax(3);
// exclusiveGroup.setMaxCheckedColor('#1234ff');
exclusiveGroup.updateOptions({
  feedforwardOffset: 4,
});

const text = document.getElementById('textForCheck');

function updateCheckedText() {
  const checkedCount = exclusiveGroup.elements.filter(cb => cb.checked).length;
  text.textContent = `Checkbox attivi: ${checkedCount}`;
}

// Aggiungi un listener a ogni checkbox
exclusiveGroup.elements.forEach(cb => {
  cb.addEventListener('change', updateCheckedText);
});

// Aggiorna subito all'inizio per mostrare lo stato iniziale
// updateCheckedText();

// const prova = document.getElementById('prova');
// prova.selected = true;
const selection = [
  document.getElementById('choise1'),
  document.getElementById('choise2'),
  document.getElementById('choise3'),
  document.getElementById('choise4'),
  document.getElementById('choise5'),
  document.getElementById('choise6'),
  document.getElementById('choise7'),
];
const selectionBox = FortunetteToolkit.FortunetteSelectBox(selection, 'mySelection');
// selectionBox.updateOptions({opacity: 0.5});
