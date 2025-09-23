import * as FortunetteToolkit from "./fortunette-toolkit/src/index.js"

const sizes = Array.from(document.querySelectorAll('#sizes input[type="checkbox"]'));
const sizes_fortunette = FortunetteToolkit.FortunetteRadioGroup(sizes,"sizes");
sizes_fortunette.setOpacity(0.4);
sizes_fortunette.updateOptions({feedforwardOffset: 3});

const bases = Array.from(document.querySelectorAll('#bases input[type="checkbox"]'));
const bases_fortunette = FortunetteToolkit.FortunetteRadioGroup(bases,"bases");
bases_fortunette.setOpacity(0.4);
bases_fortunette.updateOptions({feedforwardOffset: 3});

const proteins = Array.from(document.querySelectorAll('#proteins input[type="checkbox"]'));
const protein_fortunette = FortunetteToolkit.FortunetteExclusiveCheckboxes(proteins, 0, "protein");
protein_fortunette.setOpacity(0.4);
protein_fortunette.updateOptions({feedforwardOffset: 3});

const toppings = Array.from(document.querySelectorAll('#toppings input[type="checkbox"]'));
const toppings_fortunette = FortunetteToolkit.FortunetteExclusiveCheckboxes(toppings, 2, "toppings");
toppings_fortunette.setOpacity(0.4);
toppings_fortunette.updateOptions({feedforwardOffset: 3});

const salse = Array.from(document.querySelectorAll('#salse input[type="checkbox"]'));
const salse_fortunette = FortunetteToolkit.FortunetteExclusiveCheckboxes(salse, 2, "salse");
salse_fortunette.setOpacity(0.4);
salse_fortunette.updateOptions({feedforwardOffset: 3});


function allRequirementsMet() {
  return sizes_fortunette.getSelected() != null &&
  bases_fortunette.getSelected() != null &&
  protein_fortunette.getSelected().length == sizes_fortunette.getSelectedIndex() + 1 &&
  toppings_fortunette.getSelected().length == 2 &&
  salse_fortunette.getSelected().length == 2
}
  
const button = document.getElementById("ordina");
button.disabled = true;
button.textContent = "Completa le scelte"

// Aggiorna lo stato del bottone quando cambia un checkbox
document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
  cb.addEventListener('change', () => {
    const flag = allRequirementsMet();
    button.disabled = !flag;
    button.textContent = flag ? 'Pronto a ordinare!' : 'Completa le scelte';
  });
});

// Custom Fortunette Button
new FortunetteToolkit.Fortunette(button, {
  istanceName: 'orderBtn',
  hoverDelay: 200,
  opacity: 0.5,
  predictFutureState: () => {
    return {
      ready: allRequirementsMet()
    };
  },
  renderFeedforward: (layer, state, fortunetteInstance) => {
    const toHex = (value) => value.toString(16).padStart(2, '0');
    const color = state.ready ? '#28a745' : '#dc3545';
    const buttonBgColor = color + toHex(Math.round(fortunetteInstance.options.opacity * 255));   
    layer.style.borderColor = color;
    layer.style.backgroundColor = buttonBgColor;
    layer.classList.add('show');
  },
  onConfirm: (el, state) => {
    if (state.ready) {
      alert('Ordine confermato!');
    } else {
      alert('Seleziona tutti gli ingredienti richiesti prima di ordinare.');
    }
  }
});



// Needed to change max for protein_fortunette and protein Title name
sizes.forEach(cb => {
  cb.addEventListener('change', _ => {
    console.log(sizes_fortunette.getSelectedIndex() + 1)
    const selected = sizes_fortunette.getSelected();
    if(selected != null){
      const number = parseInt(selected.id.replace("size-", ""));
      const title_proteins = document.getElementById("title-proteins");

      title_proteins.textContent = "Proteins (max "+number+")";
      protein_fortunette.setMax(number);
    }
  });
});
