async function userLogin() {
    try {
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
        } else {
            const encodedEmail = encodeURIComponent(email); // Codifica l'email per passarla come parametro attraverso la query string
            const userProfileURL = 'userProfile.html?email=' + encodedEmail;
            window.location.href = userProfileURL; // Naviga verso la pagina userProfile.html nella stessa finestra o scheda
        }
    } catch (error) {
        console.error('Errore:', error);
        var loginContainer = document.getElementById('loginInfo');
        loginContainer.innerHTML = '<p>' + error.message + '</p>';
    }
}




async function registerUser() {
    try {
        const name = document.getElementById('firstName').value;
        const lastname = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const response = await fetch('http://localhost:8080/api/utente/registrazione', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "nome": name,
                "cognome":lastname,
                "email": email,
                "password": password
            }),
        });

        if (!response.ok) {
            throw new Error('Inserisci informazioni valide');
        } else {
            const encodedEmail = encodeURIComponent(email); // Codifica l'email per passarla come parametro attraverso la query string
            const userProfileURL = 'userProfile.html?email=' + encodedEmail;
            window.location.href = userProfileURL; // Naviga verso la pagina userProfile.html nella stessa finestra o scheda
        }
    } catch (error) {
        console.error('Errore:', error);
        var loginContainer = document.getElementById('registerInfo');
        loginContainer.innerHTML = '<p>' + error.message + '</p>';
    }
}




async function getAllUsers() {
    try {
        // Effettua una chiamata GET all'endpoint fittizio per ottenere tutti gli utenti
        const response = await fetch('http://localhost:8080/api/utente/tutti_gli_utenti');
        // Verifica che la risposta sia ok (status 200)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Estrae il JSON dalla risposta
        const users = await response.json();

        //stampa la tabella degli utenti sulla pagina html
        var userListContainer = document.getElementById('userList');
        var userListHTML = '<table class="table table-bordered">';
        userListHTML += '<thead><tr><th>ID</th><th>Nome</th><th>Cognome</th><th>Email</th><th>Corsi</th><th>Dettagli</th></tr></thead>';
        userListHTML += '<tbody>';
        users.forEach(function (user) {
            userListHTML += '<tr>'
                        +'<td>' + user.id + '</td>'
                        +'<td>' + user.nome + '</td>'
                        +'<td>' + user.cognome + '</td>'
                        +'<td>' + user.email + '</td>';

            // Se l'utente ha corsi associati, li aggiunge alla riga della tabella
            if (user.corsi.length > 0) {
                var corsiHTML = '';
                user.corsi.forEach(function (corso) {
                    corsiHTML += '<li>'
                                +'Corso: ' + corso.nomeCorso +'<br>'
                                + 'Descrizione: ' + corso.descrizioneBreve +'<br>'
                                +'Durata: ' + corso.durata+' ore' +'<br>'
                                + '</li>';
                });
                userListHTML += '<td><ul>' + corsiHTML + '</ul></td>';
            } else {
                userListHTML += '<td> nessuno </td>';
            }

           // Aggiungi un pulsante "Dettagli" per visualizzare le informazioni dettagliate dell'utente
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




async function userInfo(){
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
                                
        // Aggiungi le informazioni sui ruoli dell'utente alla lista
        user.ruoli.forEach(function (ruolo) {
            userInfoHTML += `<li class="list-group-item">${ruolo.tipologia}</li>`;
        });
        
        userInfoHTML += `       </ul>
                                <p class="card-text mt-3"><strong>Corsi:</strong></p>`;
                                
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

        userInfoHTML += `       </div>
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


//SIMILE A "userInfo"
async function userProfile(){
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
                    <div class="col-md-8 offset-md-2">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Profilo di ${user.nome} ${user.cognome}</h5>
                                <p class="card-text"><strong>Email:</strong> ${user.email}</p>
                                <p class="card-text"><strong>Ruoli:</strong></p>
                                <ul class="list-group">`;
                                
        // Aggiungi le informazioni sui ruoli dell'utente alla lista
        user.ruoli.forEach(function (ruolo) {
            userInfoHTML += `<li class="list-group-item">${ruolo.tipologia}</li>`;
        });
        
        userInfoHTML += `       </ul>
                                <p class="card-text mt-3"><strong>Corsi:</strong></p>`;
                                
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

        // Aggiungi i pulsanti "Elimina utente" e "Modifica utente"
        userInfoHTML += `
                <div class="mt-4 text-center">
                    <button class="btn btn-danger mr-2" onclick="deleteUser('${user.id}')">Elimina utente</button>
                    <button class="btn btn-primary" onclick="editUser('${user.id}')">Modifica utente</button>
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
