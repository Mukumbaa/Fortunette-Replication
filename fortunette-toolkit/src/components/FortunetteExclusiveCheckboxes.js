import { Fortunette } from "../core/Fortunette.js"

export function FortunetteExclusiveCheckboxes(checkboxes, max, groupName) {
  const toHex = (value) => value.toString(16).padStart(2, '0');
  const defaultOptions = {
    checkedColor: '#28a745',
    uncheckedColor: '#ba0013',
    maxCheckedColor: '#8f00ba',
    opacity: 0.1,
    max: max,
  }
  function getCurrentSelectedCount() {
    return Array.from(checkboxes).filter(cb => cb.checked).length;
  }
  const instances = [];
  checkboxes.forEach((checkbox, index) => {
    const instanceName = `${groupName}_${index}`;
    const fortunetteInstance = new Fortunette(checkbox, {
      istanceName: instanceName,
      predictFutureState: (el) => {
        const isChecked = el.checked;
        if (getCurrentSelectedCount() > fortunetteInstance.options.max) {
          return { blocked: true };
        }
        return { blocked: false, willBeChecked: !isChecked};
      },
      renderFeedforward: (layer, state, fortunetteInstance) => {
        layer.classList.add('show');

        if (getCurrentSelectedCount() == fortunetteInstance.options.max && state.willBeChecked) {
          layer.style.borderColor = fortunetteInstance.options.maxCheckedColor;
          layer.style.backgroundColor = fortunetteInstance.options.maxCheckedColor +
            toHex(Math.round(fortunetteInstance.options.opacity * 255));
        } else if (state.willBeChecked) {
          layer.style.borderColor = fortunetteInstance.options.checkedColor;
          layer.style.backgroundColor = fortunetteInstance.options.checkedColor +
            toHex(Math.round(fortunetteInstance.options.opacity * 255));
        } else {
          layer.style.borderColor = fortunetteInstance.options.uncheckedColor;
          layer.style.backgroundColor = fortunetteInstance.options.uncheckedColor +
            toHex(Math.round(fortunetteInstance.options.opacity * 255));
        }
      },
      onConfirm: (el, state, event, fortunetteInstance) => {
        if (state.blocked) {
            el.checked = false;
            alert(`You can only select up to ${fortunetteInstance.options.max}`);
          return;
        }
      },
      ...defaultOptions,      
    })
    instances.push(fortunetteInstance);
  })

  return {
    instances: instances,
    elements: checkboxes,
    getSelected: () => {
      return checkboxes.filter(cb => cb.checked);
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
    setMax: (newMax) => {
      if(checkboxes.filter(cb => cb.checked).length > newMax){
        checkboxes.forEach(cb => cb.checked = false);
      }
      instances.forEach(inst => {
        inst.options.max = newMax;
      })
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
    setMaxCheckedColor: (newColor) => {
      instances.forEach(inst => {
        inst.options.maxCheckedColor = newColor;
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
    
  }
}
