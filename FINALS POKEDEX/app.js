const API_URL = 'http://localhost:8080/pokemon';  // address backend

let allPokemon = [];
let currentPokemonId = null;
let currentPokemonName = null;

let pendingUpdateId = null;
let pendingUpdateName = null;


//  LOGIN/REGISTER
async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
        showNotification('ENTER CREDENTIALS!', 'error');
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/auth/login', { // login req to backend
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) { // if login successful
            const user = await response.json();  // Convert JSON response into js object

            localStorage.setItem('currentUser', user.username); // Save username in browser storage
            closeLoginForm();

            document.getElementById('pokedex-content').style.display = 'block';
            document.getElementById('login-form').classList.remove('show');
            document.getElementById('logout-btn').style.display = 'block';

            showNotification('WELCOME ' + user.username + '!', 'success');
            fetchPokemon();

        } else {
            const errorMessage = await response.text();

            // ERROR MESSAGES
            if (errorMessage.includes('User not found')) {
                showNotification('TRAINER NOT FOUND!', 'error');
            }
            else if (errorMessage.includes('Incorrect password')) {
                showNotification('User not found!', 'error');
            }
            else {
                showNotification('User not found!', 'error');
            }
        }

    } catch (error) {
        showNotification('SERVER ERROR!', 'error');
    }
}

async function register() {
    const username = document.getElementById('reg-username').value; // get user/ps
    const password = document.getElementById('reg-password').value;


    if (!username) {
        showNotification('USERNAME REQUIRED!', 'error');
        return;
    }

    if (!password) {
        showNotification('PASSWORD REQUIRED!', 'error');
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            showNotification('REGISTERED SUCCESSFULLY!', 'success');
            closeRegisterForm();
            showLoginFromRegister();
        } else {
            const errorMessage = await response.text();

            if (errorMessage.includes('already') || errorMessage.includes('exists')) {
                showNotification('TRAINER ALREADY REGISTERED!', 'error');
            }
            else {
                showNotification('REGISTRATION FAILED!', 'error');
            }
        }

    } catch (error) {
        showNotification('SERVER ERROR!', 'error');
    }
}

// Show login form
function showLoginForm() {
    document.getElementById('login-form').classList.add('show');
}

function logout() {

    localStorage.removeItem('currentUser'); // Remove saved login session
    showNotification('Logged out!', 'success');

    document.getElementById('pokedex-content').style.display = 'none';
    document.getElementById('login-form').classList.add('show');
    document.getElementById('logout-btn').style.display = 'none';
}

function closeLoginForm() { // closes login form
    document.getElementById('login-form').classList.remove('show');
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
}

function showRegisterForm() { // Switch from login form to register
    document.getElementById('login-form').classList.remove('show');
    document.getElementById('register-form').classList.add('show');
}

function closeRegisterForm() { // closes register form
    document.getElementById('register-form').classList.remove('show');
    document.getElementById('reg-username').value = '';
    document.getElementById('reg-password').value = '';
}

function showLoginFromRegister() { // go back to login from register
    document.getElementById('register-form').classList.remove('show');
    document.getElementById('login-form').classList.add('show');
}

function logout() { // logout function
    localStorage.removeItem('currentUser');  // remove user from storage
    showNotification('Logged out!', 'success');

    // Hide Pokedex after logout (shows login, hides Pokedex)
    document.getElementById('pokedex-content').style.display = 'none';
    document.getElementById('login-form').classList.add('show');
    document.getElementById('logout-btn').style.display = 'none';
}

function checkLogin() { // Check if user is already logged in
    const user = localStorage.getItem('currentUser'); // Get saved username from browser storage

    if (user) { // if user is logged in
        document.getElementById('pokedex-content').style.display = 'block';
        document.getElementById('login-form').classList.remove('show');
        document.getElementById('register-form').classList.remove('show');
        document.getElementById('logout-btn').style.display = 'block';

        fetchPokemon();
    } else {
        document.getElementById('pokedex-content').style.display = 'none';
        document.getElementById('login-form').classList.add('show');
        document.getElementById('logout-btn').style.display = 'none';
    }
}

async function fetchPokemon() {
    try {
        const response = await fetch(API_URL);
        allPokemon = await response.json();
        displayPokemon(allPokemon);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayPokemon(pokemonList) { // pk container
    const container = document.getElementById('pokemon-container');
    container.innerHTML = ''; //

    if (pokemonList.length === 0) {
        container.innerHTML = '<p style="color:#666;font-size:0.7rem;grid-column:1/-1;text-align:center;">No Pokemon Found</p>';
        return;
    }

    pokemonList.forEach(pokemon => { // runs for every pk
        const card = document.createElement('div');
        card.className = 'pokemon-card'; // css styling
        card.onclick = () => showPopup(pokemon);

        card.innerHTML = `
            <p class="id">#${pokemon.id}</p>
            <img src="${pokemon.imageUrl}" alt="${pokemon.name}">
            <h3>${pokemon.name}</h3>
            <p class="type">${pokemon.type}</p>
        `;

        container.appendChild(card);
    });
}


function filterPokemon() {
    const search = document.getElementById('search').value.toLowerCase();
    const typeFilter = document.getElementById('type-filter').value;

    let filtered = allPokemon; // creates variable "filtered"

    if (search) {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(search)
        );
    }

    if (typeFilter) {
        filtered = filtered.filter(p =>
            p.type && p.type.includes(typeFilter)
        );
    }

    displayPokemon(filtered);
}


function showPopup(pokemon) {
    currentPokemonId = pokemon.id;   // gets ID for delete
    currentPokemonName = pokemon.name; // stores the clicked pk name for notif

    document.getElementById('popup-image').src = pokemon.imageUrl;
    document.getElementById('popup-name').textContent = pokemon.name;
    document.getElementById('popup-id').textContent = '#' + pokemon.id;
    document.getElementById('popup-type').textContent = pokemon.type;
    document.getElementById('popup-height').textContent = pokemon.height;
    document.getElementById('popup-weight').textContent = pokemon.weight;
    document.getElementById('popup-description').textContent = pokemon.description;

    document.getElementById('popup').classList.add('show');
}

function closePopup() {
    document.getElementById('popup').classList.remove('show');
    currentPokemonId = null; // clears pk ID/name
    currentPokemonName = null;
}


function showAddForm() {
    document.getElementById('add-form').classList.add('show');
}

function closeAddForm() {
    document.getElementById('add-form').classList.remove('show'); // close pag cancel/click outside/afteradd

    document.getElementById('new-name').value = '';
    document.getElementById('new-type').value = '';
    document.getElementById('new-height').value = '';
    document.getElementById('new-weight').value = '';
    document.getElementById('new-image').value = '';
    document.getElementById('new-description').value = '';
}

function showNotification(message, type) {
    const notif = document.getElementById('notification'); // It grabs the notif box so JavaScript can control it easily.
    document.getElementById('notif-message').textContent = message; // Set the message text

    notif.classList.remove('success', 'error'); // remove old colors
    notif.classList.add(type); // change color notif (green and red)
    notif.classList.add('show'); // Show the notification

    setTimeout(() => {
        notif.classList.remove('show');
    }, 3000);
}

async function addPokemon() {
    const name = document.getElementById('new-name').value;
    const type = document.getElementById('new-type').value;
    const height = document.getElementById('new-height').value;
    const weight = document.getElementById('new-weight').value;
    const imageUrl = document.getElementById('new-image').value ||
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';
    const description = document.getElementById('new-description').value ||
        'A mysterious Pokemon.';

    // Validation: Check if name and type are filled
    if (!name) {
        showNotification('POKEMON NAME REQUIRED!', 'error');
        return;
    }

    if (!type) {
        showNotification('POKEMON TYPE REQUIRED!', 'error');
        return;
    }

    if (!height) {
        showNotification('HEIGHT REQUIRED!', 'error');
        return;
    }

    if (parseFloat(height) <= 0) {
        showNotification('HEIGHT MUST BE > 0!', 'error');
        return;
    }

    if (!weight) {
        showNotification('WEIGHT REQUIRED!', 'error');
        return;
    }

    if (parseFloat(weight) <= 0) {
        showNotification('WEIGHT MUST BE > 0!', 'error');
        return;
    }

    const defaultImage = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';
// IMAGE URL VALIDATION
    if (imageUrl && imageUrl !== defaultImage) {
        try {
            new URL(imageUrl);
        } catch (e) {
            showNotification('INVALID IMAGE URL!', 'error');
            return;
        }

        if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
            showNotification('URL MUST START WITH HTTP/HTTPS!', 'error');
            return;
        }
    }

    const newPokemon = { // holds all the object in one package
        name,
        type,
        height: parseFloat(height),
        weight: parseFloat(weight),
        imageUrl,
        description
    };

    try {
        await fetch(API_URL, {  // sends new pk to server
            method: 'POST',  // creates new data
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPokemon)
        });

        closeAddForm();
        fetchPokemon();
        showNotification(name + ' Added!', 'success');

    } catch (error) {
        console.error('Error adding Pokemon:', error);
    }
}

async function deletePokemon() {
    if (!currentPokemonId) {
        alert('No Pokemon selected');
        return;
    }

    if (!confirm('Are you sure you want to delete this Pokemon?')) {
        return;
    }

    try {
        await fetch(`${API_URL}/${currentPokemonId}`, { // delete req
            method: 'DELETE'
        });

        closePopup();
        fetchPokemon();

        showNotification('Deleted!', 'error');

    } catch (error) {
        console.error('Error deleting Pokemon:', error);
        alert('Failed to delete Pokemon');
    }
}

function showUpdateForm() {
    const pokemon = allPokemon.find(p => p.id === currentPokemonId); // Find the pk object from the list
    if (!pokemon) return;

    pendingUpdateId = currentPokemonId;
    pendingUpdateName = currentPokemonName;

    document.getElementById('update-height').value = pokemon.height;
    document.getElementById('update-weight').value = pokemon.weight;
    document.getElementById('update-description').value = pokemon.description;

    document.getElementById('popup').classList.remove('show');
    document.getElementById('update-form').classList.add('show');
}

function clearUpdateForm() {

    document.getElementById('update-height').value = ''; // Clear all input fields
    document.getElementById('update-weight').value = '';
    document.getElementById('update-description').value = '';

    pendingUpdateId = null; // program forgets which Pokemon was selected
    pendingUpdateName = null;
}

function closeUpdateForm() {
    document.getElementById('update-form').classList.remove('show');
    clearUpdateForm();
}

async function updatePokemon() {
    if (!pendingUpdateId) {
        alert('No Pokemon selected');
        return;
    }

    const height = document.getElementById('update-height').value;
    const weight = document.getElementById('update-weight').value;
    const description = document.getElementById('update-description').value;

    // Validation: Check for negative numbers
    if (height && parseFloat(height) < 0) { // convert to number
        alert('Height cannot be negative!');
        return;
    }

    if (weight && parseFloat(weight) < 0) {
        alert('Weight cannot be negative!');
        return;
    }

    // Validation: Check for zero
    if (height && parseFloat(height) === 0) {
        alert('Height must be greater than 0!');
        return;
    }

    if (weight && parseFloat(weight) === 0) {
        alert('Weight must be greater than 0!');
        return;
    }

    if (height === '' && weight === '' && description === '') {
        alert('Please enter at least one field to update!');
        return;
    }

    const updatedPokemon = {
        name: pendingUpdateName,
        type: "",
        imageUrl: "",
        description: description,
        height: height ? parseFloat(height) : null,
        weight: weight ? parseFloat(weight) : null
    };

    try {
        const response = await fetch(`${API_URL}/${pendingUpdateId}`, { // Sends PUT req
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedPokemon)
        });

        if (response.ok) {
            closeUpdateForm();
            fetchPokemon();
            showNotification('Updated!', 'success');
        } else {
            alert('Update failed');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

document.getElementById('popup').addEventListener('click', function(e) {
    if (e.target === this) closePopup(); // prevents closing when clicking inside the popup content
});

document.getElementById('add-form').addEventListener('click', function(e) {
    if (e.target === this) closeAddForm(); // prevents closing when clicking inside inputs or buttons
});

document.getElementById('update-form').addEventListener('click', function(e) {
    if (e.target === this) closeUpdateForm();
});

checkLogin();