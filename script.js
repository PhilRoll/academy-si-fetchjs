// login utente
async function userLogin() {
    try {
        // prende gli attributi dal form
        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const response = await fetch('http://localhost:8080/api/utente/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email": email,
                "password": password
            }),
        });

        if (!response.ok) {
            throw new Error('Credenziali errate, riprova');
        }

        else {
            const encodedEmail = encodeURIComponent(email); // Codifica l'email per passarla come parametro attraverso la query string
            const userProfileURL = 'userProfile.html?email=' + encodedEmail;
            window.location.href = userProfileURL; // Naviga verso la pagina userProfile.html nella stessa finestra o scheda
        }

    }

    catch (error) {
        console.error('Errore:', error);
        var loginContainer = document.getElementById('loginInfo');
        loginContainer.innerHTML = '<p>' + error.message + '</p>';
    }
}


// registrazione utente
async function registerUser() {
    try {
        const response = await fetch('http://localhost:8080/api/utente/registrazione', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "nome": document.getElementById('firstName').value,
                "cognome": document.getElementById('lastName').value,
                "email": document.getElementById('email').value,
                "password": document.getElementById('password').value
            }),
        });

        if (!response.ok) {
            throw new Error('Dati non validi / utente già registrato.');
        }
        else {
            window.location.href = 'login.html'; // Naviga verso la pagina login.html nella stessa finestra o scheda
        }
    }

    catch (error) {
        console.error('Errore:', error);
        var loginContainer = document.getElementById('registerInfo');
        loginContainer.innerHTML = '<p>' + error.message + '</p>';
    }
}


// tabella lista degli utenti
async function getAllUsers() {
    try {
        const response = await fetch('http://localhost:8080/api/utente/tutti_gli_utenti');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Estrae il JSON dalla risposta
        const users = await response.json();

        //stampa la tabella degli utenti sulla pagina html
        var userListContainer = document.getElementById('userList');
        var userListHTML = '<table class="table table-bordered table-striped">';
        userListHTML += '<thead><tr><th>ID</th><th>Nome</th><th>Cognome</th><th>Email</th><th>Corsi</th><th>Dettagli</th></tr></thead>';
        userListHTML += '<tbody>';
        users.forEach(function (user) {
            userListHTML += '<tr>'
                + '<td>' + user.id + '</td>'
                + '<td>' + user.nome + '</td>'
                + '<td>' + user.cognome + '</td>'
                + '<td>' + user.email + '</td>';

            // Se l'utente ha corsi associati, li aggiunge alla riga della tabella
            if (user.corsi.length > 0) {
                var corsiHTML = '';
                user.corsi.forEach(function (corso) {
                    corsiHTML += '<li>' + corso.nomeCorso + '</li>';
                });
                userListHTML += '<td><ul>' + corsiHTML + '</ul></td>';
            }

            else {
                userListHTML += '<td> nessuno </td>';
            }

            //pulsante "Dettagli" per visualizzare le informazioni dettagliate dell'utente
            userListHTML += '<td><button class="btn btn-primary" onclick="openInfoUserPage(\'' + user.email + '\')">Info Utente</button></td>';

            userListHTML += '</tr>';
        });
        userListHTML += '</tbody></table>';
        userListContainer.innerHTML = userListHTML;

    } catch (error) {
        // Gestisce eventuali errori
        console.error('Errore durante la chiamata REST:', error);
    }
}


//apre la pagina "userInfo.html" con l'email dell'utente come parametro
function openInfoUserPage(email) {
    var encodedEmail = encodeURIComponent(email); // Codifica l'email per passarla come parametro attraverso la query string
    var userInfoURL = 'userInfo.html?email=' + encodedEmail;
    window.open(userInfoURL, '_blank');
}


// stampa le info utente
async function userInfo() {
    try {
        // valore dell'email dai parametri GET nell'URL corrente
        var email = new URLSearchParams(window.location.search).get('email');

        if (!email) {
            throw new Error('Email non trovata nei parametri GET.');
        }

        // Effettua una chiamata GET all'endpoint fittizio
        const response = await fetch(`http://localhost:8080/api/utente/infoutente?email=${email}`);
        // Verifica che la risposta sia ok (status 200)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Estrae il JSON dalla risposta
        const user = await response.json();

        // Crea una stringa HTML per visualizzare le informazioni dell'utente come pagina di profilo personale
        var userInfoHTML = `
            <div class="container mt-5">
                <div class="row">
                    <div class="col-md-6 offset-md-3">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Profilo di ${user.nome} ${user.cognome}</h5>
                                <p class="card-text"><strong>Email:</strong> ${user.email}</p>
                                <p class="card-text"><strong>Ruoli:</strong></p>
                                <ul class="list-group">`;

        // Verifica se l'utente ha ruoli
        if (user.ruoli.length > 0) {
            // Aggiungi le informazioni sui ruoli dell'utente alla lista
            user.ruoli.forEach(function (ruolo) {
                userInfoHTML += `    <li class="list-group-item">${ruolo.tipologia}</li>`;
            });
        } else {
            // Se l'utente non ha ruoli, scrivi "Nessuno"
            userInfoHTML += `       <li class="list-group-item">Nessuno</li>`;
        }

        userInfoHTML += `       </ul>
                                <p class="card-text mt-3"><strong>Corsi:</strong></p>
                                <ul class="list-group">`;

        // Verifica se l'utente ha corsi
        if (user.corsi.length > 0) {
            // Aggiungi le informazioni sui corsi dell'utente alla lista
            user.corsi.forEach(function (corso) {
                userInfoHTML += `
                                <div class="card mt-3">
                                    <div class="card-body">
                                        <ul class="list-group">
                                            <li class="list-group-item">Nome: ${corso.nomeCorso}</li>
                                            <li class="list-group-item">In breve: ${corso.descrizioneBreve}</li>
                                            <li class="list-group-item">Descrizione: ${corso.descrizioneCompleta}</li>
                                            <li class="list-group-item">Durata: ${corso.durata} ore</li>
                                        </ul>
                                    </div>
                                </div>`;
            });
        } else {
            // Se l'utente non ha corsi, scrivi "Nessuno"
            userInfoHTML += `       <li class="list-group-item">Nessuno</li>`;
        }

        userInfoHTML += `           </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        // Visualizza la pagina di profilo nella pagina HTML
        var userContainer = document.getElementById('userInfo');
        userContainer.innerHTML = userInfoHTML;
    }

    catch (error) {
        // Gestisce eventuali errori
        console.error('Errore durante la chiamata REST:', error);
    }
}


async function deleteUser() {
    try {
        // Ottieni l'email dall'URL
        var email = new URLSearchParams(window.location.search).get('email');
        if (!email) {
            throw new Error('Email non trovata nei parametri GET');
        }

        // Effettua la richiesta di eliminazione dell'utente
        const response = await fetch(`http://localhost:8080/api/utente/elimina/${email}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // Controlla se la richiesta è stata completata con successo
        if (!response.ok) {
            // Se la risposta non è OK, gestisci l'errore
            throw new Error('Errore durante l\'eliminazione dell\'utente');
        } else {
            // Se l'eliminazione è avvenuta con successo, reindirizza alla homepage
            window.location.href = 'homepage.html';
        }
    } catch (error) {
        // Gestisci gli errori
        console.error('Errore durante la chiamata REST:', error.message);
    }
}