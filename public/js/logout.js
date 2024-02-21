
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
            window.location.href = '/login';
        }
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
});