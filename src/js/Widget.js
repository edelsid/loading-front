/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */

export default class Widget {
  constructor(container, url) {
    this.bindToDOM(container);
    this.url = url;
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
    this.reload = document.querySelector('.reload');
  }

  init() {
    this.onClick = this.onClick.bind(this);
    this.reload.addEventListener('click', this.onClick);
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js', { scope: './' })
          .then(() => {
            console.log('registration complete.');
          }).catch((error) => {
            console.log(`Ошибка: ${error}`);
          });
      });
    }
  }

  onClick() {
    this.createRequest();
  }

  async createRequest() {
    try {
      const res = fetch(`${this.url}/news`, {
        method: 'GET',
      });
      const result = await res;
      location.replace(result.url);
    } catch (error) {
      console.log(error);
    }
  }
}
