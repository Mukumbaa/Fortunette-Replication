import { Fortunette } from "../core/Fortunette.js"

export function FortunetteRadioGroup(checkboxes, groupName) {
  const toHex = (value) => value.toString(16).padStart(2, '0');
  
  const defaultOptions = {
    checkedColor: '#28a745',
    uncheckedColor: '#ba0013',
    maintainColor: '#007bff', // Nuovo colore per "mantieni selezione"
    opacity: 0.1,
  };
  
  // const config = { ...defaultOptions};
  const instances = [];
  
  checkboxes.forEach((checkbox, index) => {
    const instanceName = `${groupName}_${index}`;
    
    const fortunetteInstance = new Fortunette(checkbox, {
      istanceName: instanceName,
      predictFutureState: (el) => ({
        checked: !el.checked,
      }),
      renderFeedforward: (layer, state, fortunetteInstance) => {
        layer.classList.add('show');
        
        // Se il checkbox è già selezionato, mostra solo il suo feedforward in blu
        if (checkbox.checked) {
          const maintainBgColor = fortunetteInstance.options.maintainColor + toHex(Math.round(fortunetteInstance.options.opacity * 255));
          
          layer.style.borderColor = fortunetteInstance.options.maintainColor;
          layer.style.backgroundColor = maintainBgColor;
          
          // Non mostrare feedforward per gli altri poiché non cambieranno
          return;
        }
        
        // Colore del feedforward per l'elemento corrente (non selezionato che si sta per selezionare)
        const currentColor = fortunetteInstance.options.checkedColor;
        const currentBgColor = currentColor + toHex(Math.round(fortunetteInstance.options.opacity * 255));
        
        layer.style.borderColor = currentColor;
        layer.style.backgroundColor = currentBgColor;
        
        // Mostra il feedforward solo per gli altri checkbox che CAMBIERANNO stato (attualmente selezionati)
        checkboxes.forEach((otherCheckbox, otherIndex) => {
          if (otherIndex !== index && otherCheckbox.checked) {
            const otherInstanceName = `${groupName}_${otherIndex}`;
            const otherInstance = Fortunette.instances[otherInstanceName];
            
            if (otherInstance) {
              const otherLayer = otherInstance.feedforwardLayer;
              otherLayer.classList.add('show');
              
              // Questo checkbox si deselezionerà
              const otherColor = fortunetteInstance.options.uncheckedColor;
              const otherBgColor = otherColor + toHex(Math.round(fortunetteInstance.options.opacity * 255));
              
              otherLayer.style.borderColor = otherColor;
              otherLayer.style.backgroundColor = otherBgColor;
            }
          }
        });
      },
      onFeedforwardEnd: (fortunetteInstance) => {
        // Nascondi il feedforward di tutti gli altri checkbox del gruppo
        checkboxes.forEach((otherCheckbox, otherIndex) => {
          if (otherIndex !== index) {
            const otherInstanceName = `${groupName}_${otherIndex}`;
            const otherInstance = Fortunette.instances[otherInstanceName];
            
            if (otherInstance) {
              otherInstance.feedforwardLayer.classList.remove('show');
            }
          }
        });
      },
      onConfirm: (el, state, event, fortunetteInstance) => {
        // Se il checkbox era già selezionato, non fare nulla (comportamento radio)
        if (state.checked) {
          event.preventDefault();
          return;
        }
        
        // Attiva il checkbox corrente
        el.checked = true;
        
        // Disattiva tutti gli altri checkbox del gruppo
        checkboxes.forEach((otherCheckbox, otherIndex) => {
          if (otherIndex !== index) {
            otherCheckbox.checked = false;
          }
        });
      },
      ...defaultOptions,

    });
    
    instances.push(fortunetteInstance);
  });


  return {
    instances: instances,
    elements: checkboxes,
    getSelected: () => {
      return checkboxes.find(cb => cb.checked) || null;
    },
    getSelectedIndex: () => {
      return checkboxes.findIndex(cb => cb.checked);
    },
    setSelected: (index) => {
      if (index >= 0 && index < checkboxes.length) {
        checkboxes.forEach((cb, i) => {
          cb.checked = i === index;
        });
      }
    },
    clearSelection: () => {
      checkboxes.forEach(cb => cb.checked = false);
    },
    setCheckedColor: (newColor) => {
      instances.forEach(inst => {
        inst.options.checkedColor = newColor;
      })
    },
    setUncheckedColor: (newColor) => {
      instances.forEach(inst => {
        inst.options.uncheckedColor = newColor;
      })
    },
    setMaintainColor: (newColor) => {
      instances.forEach(inst => {
        inst.options.maintainColor = newColor;
      })
    },
    setOpacity: (newOpacity) => {
      instances.forEach(inst => {
        inst.options.opacity = newOpacity;
      })
    },
    updateOptions: (newOptions) => {
      instances.forEach(inst => {
        inst.options = {...inst.options,...newOptions};
      })
    }
  };
}
