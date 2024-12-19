console.log("SPA script loaded");

const app = document.getElementById('app');

function showUsers() {
  app.innerHTML = `
    <h1>Список пользователей</h1>
    <ul id="usersList"></ul>
  `;

  axios.get('https://jsonplaceholder.typicode.com/users')
    .then(response => {
      const users = response.data;
      const usersList = document.getElementById('usersList');

      users.forEach(user => {
        const li = document.createElement('li');
        const link = document.createElement('a');

        link.href = `#/user/${user.id}`;
        link.textContent = user.name;

        li.appendChild(link);
        usersList.appendChild(li);
      });

      const links = document.querySelectorAll('#usersList a');
      links.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const href = e.target.getAttribute('href').replace('#', '');
          page(href);
        });
      });
    })
    .catch(console.error);
}

function showUserComments(ctx) {
  const userId = ctx.params.userId;
  app.innerHTML = `
    <button id="backButton">Назад</button>
    <h1>Комментарии пользователя ${userId}</h1>
    <ul id="commentsList"></ul>
  `;

  document.getElementById('backButton').addEventListener('click', () => page('/'));

  axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
    .then(response => {
      const posts = response.data;
      const postIds = posts.map(post => post.id);

      if (postIds.length > 0) {
        axios.get('https://jsonplaceholder.typicode.com/comments')
          .then(commentResponse => {
            const comments = commentResponse.data.filter(comment => postIds.includes(comment.postId));
            const commentsList = document.getElementById('commentsList');

            if (comments.length > 0) {
              comments.forEach(comment => {
                const li = document.createElement('li');
                li.textContent = `${comment.name}: ${comment.body}`;
                commentsList.appendChild(li);
              });
            } else {
              commentsList.innerHTML = '<li>Комментарии отсутствуют</li>';
            }
          })
          .catch(console.error);
      } else {
        document.getElementById('commentsList').innerHTML = '<li>Посты отсутствуют</li>';
      }
    })
    .catch(console.error);
}

page.base('/');
page('/', showUsers);
page('/user/:userId', showUserComments);
page({
  hashbang: true 
});
