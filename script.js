console.log("Скрипт загружен"); 

axios.get('https://jsonplaceholder.typicode.com/users')
  .then(response => {
    console.log(response.data); 
    const users = response.data;
    const usersList = document.getElementById('usersList');

    if (!usersList) {
      console.error("usersList not found");
      return;
    }

    users.forEach(user => {
      const li = document.createElement('li');
      const link = document.createElement('a');

      link.href = "javascript:void(0)";
      link.textContent = `${user.name} (${user.email})`;
      link.dataset.userId = user.id; 

      link.addEventListener('click', (e) => {
        e.preventDefault();
        console.log(user.name);
        loadUserComments(user.id);
      });

      li.appendChild(link);
      usersList.appendChild(li);
    });
  })
  .catch(error => {
    console.error(error);
  });

function loadUserComments(userId) {
  console.log(userId);
  axios.get('https://jsonplaceholder.typicode.com/comments')
    .then(response => {
      console.log(response.data);
      const comments = response.data;
      const filteredComments = comments.filter(comment => comment.postId === userId);
      const commentsList = document.getElementById('commentsList');

      if (!commentsList) {
        console.error("commentsList not found");
        return;
      }

      commentsList.innerHTML = '';

      if (filteredComments.length > 0) {
        filteredComments.forEach(comment => {
          const li = document.createElement('li');
          li.textContent = `${comment.name}: ${comment.body}`;
          commentsList.appendChild(li);
        });
      } else {
        commentsList.innerHTML = '<li>Комментарии отсутствуют</li>';
      }
    })
    .catch(error => {
      console.error('Ошибка при получении комментариев:', error);
    });
}
