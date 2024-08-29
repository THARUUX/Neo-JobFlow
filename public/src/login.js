function login(event){
    loaderHandling('show');

    event.preventDefault();

    const username = document.getElementById('username');
    const password = document.getElementById('password');

    const data = {
        username: username,
        password: password
    };

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        //console.log('Data updated successfully:', result);
        refreshPage();
    })
    .catch(error => {
        console.error('Error updating status:', error);
    });
}

function loaderHandling(status) {
    const loader = document.getElementById('loader');
    
    if (!loader) {
        console.error('Loader element not found in the DOM');
        return;
    }

    if (status === 'show') {
        loader.classList.remove('hidden');
        loader.classList.add('flex');
    } else if (status === 'hide') {
        loader.classList.remove('flex');
        loader.classList.add('hidden');
    } else {
        console.error('Invalid status value. Use "show" or "hide".');
    }
}