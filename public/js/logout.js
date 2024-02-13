document.getElementById('logoutbutton').addEventListener('click', () => {
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log('byebye');
            window.location.href = '/login.html';
        }
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
});