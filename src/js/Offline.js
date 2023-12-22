export default class Offline {
  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'replaced';
    this.element.innerHTML = Offline.construct();
  }

  static construct() {
    const inner = `
      <text class="warning">Не удалось загрузить данные. Проверьте подключение и обновите страницу.</text>
      `;
    return inner;
  }
}
