import { Fortunette } from "../core/Fortunette.js"

export function FortunetteCheckbox(checkbox){
  const toHex = (value) => value.toString(16).padStart(2, '0');
  const defaultOptions = {
    checkedColor: '#28a745',
    uncheckedColor: '#ba0013',
    opacity: 0.1
  }
  
  const checkboxInstance =  new Fortunette(checkbox, {
    predictFutureState: (el) => ({
      checked: !el.checked,
    }),
    renderFeedforward: (layer, state, fortunetteInstance) => {
      layer.classList.add('show');
      
      const currentC1 = fortunetteInstance.options.checkedColor;
      const currentC2 = fortunetteInstance.options.uncheckedColor;
      const currentOpacity = fortunetteInstance.options.opacity;
      
      layer.style.borderColor = state.checked ? currentC1 : currentC2;
      layer.style.backgroundColor = state.checked ? 
        currentC1 + toHex(Math.round(currentOpacity * 255)) : 
        currentC2 + toHex(Math.round(currentOpacity * 255));
    },
    ...defaultOptions,
  });
  return {
    checkboxInstance: checkboxInstance,
    element: checkbox,
    isAccepted: () => checkbox.checked,
    setAccepted: (accepted) => {
      checkbox.checked = !!accepted;
      updateButtonState();
    },
    setCheckColor: (newCheckedColor) => {
      checkboxInstance.options.checkedColor = newCheckedColor;
    },
    setUncheckColor: (newUncheckedColor) => {
      checkboxInstance.options.uncheckedColor = newUncheckedColor;
    },
    setOpacity: (newOpacity) => {
      checkboxInstance.options.opacity = newOpacity;
    },
    updateOptions: (newOptions) => {
      checkboxInstance.options = {...checkboxInstance.options, ...newOptions};
    }
  }
}
