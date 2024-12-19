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

        link.href = `/user/${user.id}`;
        link.textContent = `${user.name} (${user.email})`;

        li.appendChild(link);
        usersList.appendChild(li);
      });

      const links = document.querySelectorAll('#usersList a');
      links.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const href = e.target.getAttribute('href');
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

  axios.get('https://jsonplaceholder.typicode.com/comments')
    .then(response => {
      const comments = response.data.filter(comment => comment.postId == userId);
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
}

page('/', showUsers);
page('/user/:userId', showUserComments);
page();

page('/');
