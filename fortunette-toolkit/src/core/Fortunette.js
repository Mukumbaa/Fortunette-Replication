export class Fortunette {
  static instances = {};

  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      hoverDelay: 300,
      useDefaultStyle: true,
      istanceName: '',
      wrapperClassName: 'fortunette-wrapper',
      feedforwardClassName: 'fortunette-feedforward',
      feedforwardOffset: 2,
      predictFutureState: () => { },
      renderFeedforward: () => { },
      onFeedforwardEnd: () => { },
      onConfirm: () => { },
      ...options
    };

    if (this.options.useDefaultStyle) {
      Fortunette._injectDefaultStyles();
    }

    if (this.options.istanceName != '') {
      Fortunette.instances[this.options.istanceName] = this;
    }

    this.hoverTimeout = null;
    this._setupWrapper();
    this._setupEvents();
  }
  static _injectDefaultStyles() {
    if (document.getElementById('fortunette-default-style')) return;
    const style = document.createElement('style');
    style.id = 'fortunette-default-style';
    style.textContent = `
        .fortunette-wrapper {
          position: relative;
          display: inline-block;
        }
        .fortunette-feedforward {
          position: absolute;
          border: 2px dashed transparent;
          border-radius: 4px;
          pointer-events: none;
          opacity: 0;
          transition: all 0.2s ease;
          z-index: 1;
          text-align: center;
          font-weight: bold;
          color: #333;
        }
        .fortunette-feedforward.show {
          opacity: 1;
        }
      `;
    document.head.appendChild(style);
  }
  _setupWrapper() {
    this.wrapper = document.createElement('div');
    this.wrapper.className = this.options.wrapperClassName;

    this.element.parentNode.insertBefore(this.wrapper, this.element);
    this.wrapper.appendChild(this.element);
    this.feedforwardLayer = document.createElement('div');
    this.feedforwardLayer.className = this.options.feedforwardClassName;
    this.wrapper.appendChild(this.feedforwardLayer);
    this._positionFeedforward();
  }
  _setupEvents() {
    this.element.addEventListener('mouseenter', () => this._startFeedforward());
    this.element.addEventListener('mouseleave', () => this._stopFeedforward());
    this.element.addEventListener('click', (e) => this._confirmAction(e));
  }
  _startFeedforward() {
    this.hoverTimeout = setTimeout(() => {
      this._positionFeedforward();
      //NUOVO
      // Passa l'istanza Fortunette come terzo parametro
      const futureState = this.options.predictFutureState(this.element, this);
      // Passa l'istanza Fortunette come terzo parametro
      this.options.renderFeedforward(this.feedforwardLayer, futureState, this);
    }, this.options.hoverDelay);
  }
  _stopFeedforward() {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
    this.feedforwardLayer.classList.remove('show');
    if (this.options.onFeedforwardEnd) {
      // Passa l'istanza Fortunette come terzo parametro
      this.options.onFeedforwardEnd(this);
    }
  }
  _confirmAction(event) {
    this._stopFeedforward();
    // Passa l'istanza Fortunette come terzo parametro
    const futureState = this.options.predictFutureState(this.element, this);
    // Passa l'istanza Fortunette come terzo parametro
    this.options.onConfirm(this.element, futureState, event, this);
  }
  _positionFeedforward() {
    const elementRect = this.element.getBoundingClientRect();
    const wrapperRect = this.wrapper.getBoundingClientRect();

    const offset = this.options.feedforwardOffset;

    const top = Math.round(elementRect.top - wrapperRect.top - offset);
    const left = Math.round(elementRect.left - wrapperRect.left - offset);
    const width = Math.round(elementRect.width + offset * 2);
    const height = Math.round(elementRect.height + offset * 2);

    this.feedforwardLayer.style.boxSizing = 'border-box'; // importante!
    this.feedforwardLayer.style.top = `${top}px`;
    this.feedforwardLayer.style.left = `${left}px`;
    this.feedforwardLayer.style.width = `${width}px`;
    this.feedforwardLayer.style.height = `${height}px`;
  }
  // Metodo per aggiornare le opzioni dinamicamente
  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
  }
}
