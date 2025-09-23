import { Fortunette } from "../core/Fortunette.js"

export function FortunetteSelectBox(choises, groupName) {


  const toHex = (value) => value.toString(16).padStart(2, '0');
  const defaultOptions = {
    checkedColor: '#28a745',
    uncheckedColor: '#ba0013',
    maintainColor: '#007bff', // Nuovo colore per "mantieni selezione"
    opacity: 0.1,
  }
  
  _injectSelectBoxStyles();
  const instances = [];
  
  choises.forEach((choise, index) => {

    const instanceName = `${groupName}_${index}`;
    const fortunetteInstance = new Fortunette(choise, {

      istanceName: instanceName,
      
      wrapperClassName: 'fortunette-wrapper fortunette-selectbox-wrapper', // Classe aggiuntiva
      predictFutureState: (el) => ({
        selected: !el.selected,
      }),

      renderFeedforward: (layer, state, fortunetteInstance) => {
        layer.classList.add('show');
        
        // Se il checkbox è già selezionato, mostra solo il suo feedforward in blu
        if (choise.selected) {
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
        choises.forEach((otherChoises, otherIndex) => {
          if (otherIndex !== index && otherChoises.selected) {
            // console.log(otherIndex, index,otherChoises);
            const otherInstanceName = `${groupName}_${otherIndex}`;
            const otherInstance = Fortunette.instances[otherInstanceName];
            // console.log(Fortunette.instances);
            
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
        choises.forEach((otherChoises, otherIndex) => {
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
        if (state.selected) {
          event.preventDefault();
          return;
        }
        
        // Attiva il checkbox corrente
        el.selected = true;
        
        // Disattiva tutti gli altri checkbox del gruppo
        choises.forEach((otherChoises, otherIndex) => {
          if (otherIndex !== index) {
            otherChoises.selected = false;
          }
        });
      },
      
      ...defaultOptions,
    });


    instances.push(fortunetteInstance);
    
  })
  return {
    instances: instances,
    updateOptions: (newOptions) => {
      instances.forEach(inst => {
        inst.options = {...inst.options,...newOptions};
      })
    }
  }
}
// Funzione privata per iniettare gli stili CSS specifici per SelectBox
function _injectSelectBoxStyles() {
  if (document.getElementById('fortunette-selectbox-style')) return;
  
  const style = document.createElement('style');
  style.id = 'fortunette-selectbox-style';
  // style.textContent = `
  //   .fortunette-selectbox-wrapper {
  //     display: block !important;
  //   }
    
  //   /* Stili aggiuntivi per migliorare l'aspetto delle select box */
  //   .fortunette-selectbox-wrapper option {
  //     padding: 4px 8px;
  //     margin: 1px 0;
  //   }
    
  //   .fortunette-selectbox-wrapper select {
  //     outline: none;
  //   }
  // `;
 style.textContent = `
    .fortunette-selectbox-wrapper {
      display: block !important;
      z-index: 9998;
      position: relative;
      isolation: isolate;
    }
    
    .fortunette-selectbox-wrapper .fortunette-feedforward {
      z-index: 9999 !important;
      position: absolute !important;
      pointer-events: none !important;
    }
    
    .fortunette-selectbox-wrapper select {
      position: relative;
      z-index: 1;
    }
    
    /* Stili aggiuntivi per migliorare l'aspetto delle select box */
    .fortunette-selectbox-wrapper option {
      padding: 4px 8px;
      margin: 1px 0;
    }
    
    .fortunette-selectbox-wrapper select {
      outline: none;
    }
  `;  document.head.appendChild(style);
  
}
