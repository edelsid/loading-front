/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
import Post from './Post';
import Offline from './Offline';

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
    this.news = document.querySelector('.news_list');
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
    // this.createRequest();
  }

  onClick() {
    this.createRequest();
  }

  async createRequest() {
    try {
      const res = await fetch(`${this.url}/news`, {
        method: 'GET',
      });
      try {
        const result = await res.json();
        while (this.news.firstChild) {
          this.news.removeChild(this.news.lastChild);
        }
        result.forEach((element) => {
          const post = new Post(element.date, element.header);
          const postElement = post.create();
          this.news.appendChild(postElement);
        });
      } catch (error) {
        this.warning();
      }
    } catch (error) {
      this.warning();
    }
  }

  warning() {
    this.container.innerHTML = '';
    const warning = new Offline();
    this.container.appendChild(warning.element);
  }
}
