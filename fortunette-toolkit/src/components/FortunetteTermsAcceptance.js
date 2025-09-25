import { Fortunette } from "../core/Fortunette.js"

export function FortunetteTermsAcceptance(checkbox, button, termsText, groupName) {
  const toHex = (value) => value.toString(16).padStart(2, '0');
  
  const defaultOptions = {
    checkedColor: '#28a745',
    uncheckedColor: '#ba0013',
    enabledColor: '#007bff',
    disabledColor: '#dc3545',
    opacity: 0.1,
    insertTextAfter: true // Se true inserisce il testo prima del checkbox, altrimenti dopo
  };
  
  // const config = { ...defaultOptions, ...options };
  
  // Inserisco il testo accanto al checkbox
  const textElement = document.createElement('span');
  textElement.textContent = termsText;
  textElement.style.marginLeft = defaultOptions.insertTextBefore ? '0' : '8px';
  textElement.style.marginRight = defaultOptions.insertTextBefore ? '8px' : '0';
  textElement.style.userSelect = 'none';
  textElement.style.cursor = 'pointer';
  
  if (defaultOptions.insertTextAfter) {
    checkbox.parentNode.insertBefore(textElement, checkbox.nextSibling);
  } else {
    checkbox.parentNode.insertBefore(textElement, checkbox);
  }
  
  // Stato iniziale del bottone
  const updateButtonState = () => {
    button.disabled = !checkbox.checked;
    button.style.opacity = checkbox.checked ? '1' : '0.5';
    button.style.cursor = checkbox.checked ? 'pointer' : 'not-allowed';
  };
  
  // Imposto stato iniziale
  updateButtonState();
  
  // Istanza Fortunette per il checkbox
  const checkboxInstance = new Fortunette(checkbox, {
    istanceName: `${groupName}_checkbox`,
    predictFutureState: (el) => ({
      checked: !el.checked,
    }),
    renderFeedforward: (layer, state, fortunetteInstance) => {
      layer.classList.add('show');
      
      // Feedforward del checkbox
      const checkboxColor = state.checked ? fortunetteInstance.options.checkedColor : fortunetteInstance.options.uncheckedColor;
      const checkboxBgColor = checkboxColor + toHex(Math.round(fortunetteInstance.options.opacity * 255));
      
      layer.style.borderColor = checkboxColor;
      layer.style.backgroundColor = checkboxBgColor;
      
      // Feedforward del bottone (si abilita/disabilita)
      const buttonInstance = Fortunette.instances[`${groupName}_button`];
      if (buttonInstance) {
        const buttonLayer = buttonInstance.feedforwardLayer;
        buttonLayer.classList.add('show');
        
        const buttonColor = state.checked ? fortunetteInstance.options.enabledColor : fortunetteInstance.options.disabledColor;
        const buttonBgColor = buttonColor + toHex(Math.round(fortunetteInstance.options.opacity * 255));
        
        buttonLayer.style.borderColor = buttonColor;
        buttonLayer.style.backgroundColor = buttonBgColor;
      }
    },
    onFeedforwardEnd: (fortunetteInstance) => {
      // Nascondo feedforward del bottone
      const buttonInstance = Fortunette.instances[`${groupName}_button`];
      if (buttonInstance) {
        buttonInstance.feedforwardLayer.classList.remove('show');
      }
    },
    onConfirm: (el, state, event, fortunetteInstance) => {
      //el.checked = !el.checked;
      updateButtonState();
    },
    ...defaultOptions,
  });
  
  // Istanza Fortunette per il bottone
  const buttonInstance = new Fortunette(button, {
    istanceName: `${groupName}_button`,
    predictFutureState: (el) => ({
      enabled: checkbox.checked,
      willExecute: checkbox.checked
    }),
    renderFeedforward: (layer, state, fortunetteInstance) => {
      layer.classList.add('show');
      
      // Se il bottone è abilitato, feedforward verde, altrimenti rosso
      const buttonColor = state.enabled ? fortunetteInstance.options.enabledColor : fortunetteInstance.options.disabledColor;
      const buttonBgColor = buttonColor + toHex(Math.round(fortunetteInstance.options.opacity * 255));
      
      layer.style.borderColor = buttonColor;
      layer.style.backgroundColor = buttonBgColor;
      
      // Non mostrare feedforward sul checkbox perché non cambierà
    },
    onFeedforwardEnd: (fortunetteInstance) => {
      // Non c'è bisogno di nascondere altri feedforward
    },
    onConfirm: (el, state, event, fortunetteInstance) => {
      // Esegui l'azione solo se il checkbox è selezionato
      if (!checkbox.checked) {
        event.preventDefault();
        return false;
      }   
      return true;
    },
    ...defaultOptions,
  });
  
  textElement.addEventListener('click', () => {
    checkbox.checked = !checkbox.checked;
    updateButtonState();
  });
  
  // Listener per cambiamenti esterni al checkbox
  checkbox.addEventListener('change', updateButtonState);
  
  return {
    checkboxInstance: checkboxInstance,
    buttonInstance: buttonInstance,
    textElement: textElement,
    elementCheckbox: checkbox,
    elementButton: button,
    elementText: termsText,
    isAccepted: () => checkbox.checked,
    setAccepted: (accepted) => {
      checkbox.checked = !!accepted;
      updateButtonState();
    },
    onButtonClick: (callback) => {
      button.addEventListener('click', (e) => {
        if (checkbox.checked && callback) {
          callback(e);
        }
      });
    },
    setText: (newText) => {
      textElement.textContent = newText;
    },
    setCheckColor: (newCheckedColor) => {
      checkboxInstance.options.checkedColor = newCheckedColor;
    },
    setUncheckColor: (newUncheckedColor) => {
      checkboxInstance.options.uncheckedColor = newUncheckedColor;
    },
    setEnabledColor: (newEnabledColor) => {
      buttonInstance.options.enabledColor = newEnabledColor;
    },
    setDisabledColor: (newDisabledColor) => {
      buttonInstance.options.disabledColor = newDisabledColor;
    },
    setOpacity: (newOpacity) => {
      checkboxInstance.options.opacity = newOpacity;
      buttonInstance.options.opacity = newOpacity;

    },
    updateOptions: (newOptions) => {
      checkboxInstance.options = {...checkboxInstance.options, ...newOptions};
      buttonInstance.options = {...buttonInstance.options, ...newOptions};
    }
  };
}
