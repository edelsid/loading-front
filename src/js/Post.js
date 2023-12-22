export default class Post {
  constructor(data, header) {
    this.data = data;
    this.header = header;
  }

  create() {
    const post = document.createElement('li');
    post.className = 'post';
    post.innerHTML = this.construct();
    return post;
  }

  construct() {
    const inner = `
      <h2 class="post_name">${this.data}</h2>
      <div class="post_body">
         <span class="avatar"></span>
         <div class="post_desc_body">
            <span class="line">${this.header}</span>
         </div>
      </div>
      `;
    return inner;
  }
}
