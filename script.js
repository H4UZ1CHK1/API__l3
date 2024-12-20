console.log("SPA script loaded");

const app = document.getElementById('app');

const userNames = {};

function showUsers() {
  app.innerHTML = `
    <h1>Список пользователей</h1>
    <ul id="usersList"></ul>
    <div id="commentsSection"></div>
  `;

  axios.get('https://jsonplaceholder.typicode.com/users')
    .then(response => {
      const users = response.data;
      const usersList = document.getElementById('usersList');

      users.forEach(user => {
        userNames[user.id] = user.name; 

        const li = document.createElement('li');
        const span = document.createElement('span'); 

        span.textContent = user.name;
        span.style.cursor = "pointer";
        span.style.color = "black"; 
        span.style.textDecoration = "none"; 

        span.addEventListener('click', () => {
          showUserComments(user.id, user.name); 
        });

        li.appendChild(span);
        usersList.appendChild(li);
      });
    })
    .catch(console.error);
}

function showUserComments(userId, userName) {
  const commentsSection = document.getElementById('commentsSection');
  commentsSection.innerHTML = `<h2>Комментарии пользователя: ${userName}</h2><ul id="commentsList">Загрузка комментариев...</ul>`;

  axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
    .then(response => {
      const posts = response.data;
      const postIds = posts.map(post => post.id);

      if (postIds.length > 0) {
        axios.get('https://jsonplaceholder.typicode.com/comments')
          .then(commentResponse => {
            const comments = commentResponse.data.filter(comment => postIds.includes(comment.postId));
            const commentsList = document.getElementById('commentsList');

            commentsList.innerHTML = ""; 
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

showUsers();
