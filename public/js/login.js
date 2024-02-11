
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent the default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
        Swal.fire({
            icon: 'success',
            title: 'התחברות מוצלחת',
            text: 'תועבר בקרוב.',
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            document.getElementById('userinfo').style.display = 'block';
            document.getElementById('uname').textContent = data.username 
            document.getElementById('loginForm').style.display = 'none';
        });
    }
    else {
        Swal.fire({
            icon: 'error',
            title: 'התחברות נכשלה',
            text: 'נסיון ההתחברות שלך לא הצליח. אנא נסה שנית.',
            confirmButtonText: 'סגור'
          });
    }
});

document.getElementById('logout-button').addEventListener('click', () => {
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
            document.getElementById('userinfo').style.display = 'none';
            document.getElementById('loginForm').style.display = 'block';
            
        }
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
});

