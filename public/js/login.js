
document.getElementById('loginButton').addEventListener('click', async function(e) {
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
            document.getElementById('email').value='';
            document.getElementById('password').value='';
            if(data.role === 'admin'){
                console.log('you admin!');
                window.location.href = '/manager.html';
            }
            // document.getElementById('userinfo').style.display = 'block';
            // document.getElementById('uname').textContent = data.username 
            // document.getElementById('loginForm').style.display = 'none';

        });
    }
    else {
        Swal.fire({
            icon: 'error',
            title: 'התחברות נכשלה',
            text: 'נסיון ההתחברות שלך לא הצליח. אנא נסה שנית.',
            confirmButtonText: 'סגור'
        }).then(() => {
            document.getElementById('email').value='';
            document.getElementById('password').value='';
        });
    }
});

// document.getElementById('logoutbutton').addEventListener('click', () => {
//     fetch('/logout', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .then(data => {
//         if (data.success) {
//             console.log('byebye');
//             window.location.href = '/login.html';
//         }
//     })
//     .catch(error => {
//         console.error('There has been a problem with your fetch operation:', error);
//     });
// });

