document.getElementById("debater-form").addEventListener("submit", function(event) {
    event.preventDefault();
    addDebater();
});

document.getElementById("register-form").addEventListener("submit", function(event) {
    event.preventDefault();
    register();
});

function addDebater() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || !currentUser.isAdmin) {
        alert("You must be logged in as an admin to add a debater.");
        return;
    }

    const name = document.getElementById("name").value;
    const tier = document.getElementById("tier").value;
    const debates = document.getElementById("debates").value;
    const wins = document.getElementById("wins").value;
    const losses = document.getElementById("losses").value;
    const ties = document.getElementById("ties").value;

    // Obtén la lista de debaters de localStorage o inicializa una lista vacía si no existe
    const debaters = JSON.parse(localStorage.getItem("debaters")) || [];

    // Agrega el nuevo debater a la lista
    debaters.push({ name, tier, debates, wins, losses, ties });

    // Guarda la lista actualizada de debaters en localStorage
    localStorage.setItem("debaters", JSON.stringify(debaters));

    // Llama a una función para actualizar la tabla de debaters en la página
    loadDebaters();

    document.getElementById("debater-form").reset();
}



function loadDebaters() {
    const table = document.getElementById("debater-table");

    // Limpiar la tabla
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    // Cargar debaters de localStorage
    const debaters = JSON.parse(localStorage.getItem("debaters")) || [];

    // Agregar cada debater a la tabla
    for (let i = 0; i < debaters.length; i++) {
        const debater = debaters[i];
        const row = table.insertRow();
        
        // Agregar un atributo de datos para identificar el índice del debater
        row.setAttribute("data-index", i);

        const nameCell = row.insertCell(0);
        const tierCell = row.insertCell(1);
        const debatesCell = row.insertCell(2);
        const winsCell = row.insertCell(3);
        const lossesCell = row.insertCell(4);
        const tiesCell = row.insertCell(5);
        const deleteCell = row.insertCell(6);

        nameCell.innerHTML = `<a href="#" onclick="showDetails('${debater.name}')">${debater.name}</a>`;
        tierCell.innerHTML = debater.tier;
        debatesCell.innerHTML = debater.debates;
        winsCell.innerHTML = debater.wins;
        lossesCell.innerHTML = debater.losses;
        tiesCell.innerHTML = debater.ties;
        
        // Agregar un botón de eliminar en la celda
        deleteCell.innerHTML = '<button onclick="deleteDebater(event)">Delete</button>';
    }
}



function deleteDebater(event) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || !currentUser.isAdmin) {
        alert("You must be logged in as an admin to delete a debater.");
        return;
    }

    // Obtener el índice del debater a eliminar
    const rowIndex = event.target.parentElement.parentElement.getAttribute("data-index");

    // Cargar debaters de localStorage
    let debaters = JSON.parse(localStorage.getItem("debaters")) || [];

    // Eliminar el debater de la lista
    debaters.splice(rowIndex, 1);

    // Guardar la lista actualizada en localStorage
    localStorage.setItem("debaters", JSON.stringify(debaters));

    // Recargar la tabla
    loadDebaters();
}



function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push({ username, password, isAdmin: false });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registered successfully!");
}

function login() {
    const username = prompt("Enter your username:");
    const password = prompt("Enter your password:");

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        document.getElementById("user-info").style.display = "block";
        document.getElementById("current-username").innerText = user.username;
        alert("Logged in successfully!");

        if (user.isAdmin) {
            document.getElementById("admin-tools").style.display = "block";
        }
    } else {
        alert("Invalid username or password!");
    }
}




function makeAdmin() {
    const makeAdminUsername = document.getElementById("make-admin-username").value;
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => user.username === makeAdminUsername);

    if (user) {
        user.isAdmin = true;
        localStorage.setItem("users", JSON.stringify(users));
        alert(makeAdminUsername + " is now an admin!");
    } else {
        alert("User not found!");
    }
}

// Verificar si hay un usuario logueado cuando la página se cargue
window.onload = function() {
    loadDebaters();

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
        document.getElementById("user-info").style.display = "block";
        document.getElementById("current-username").innerText = currentUser.username;

        if (currentUser.isAdmin) {
            document.getElementById("admin-tools").style.display = "block";
        }
    }
};


function logout() {
    localStorage.removeItem("currentUser");
    location.reload();
}

function showDetails(name) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || !currentUser.isAdmin) {
        alert("You must be logged in as an admin to view detailed statistics.");
        return;
    }

     
    // Redirigir a la página de detalles con el nombre del debater como parámetro de consulta
    window.location.href = "detalles.html?name=" + encodeURIComponent(name);
    
    // Obtener el debater correspondiente del almacenamiento
    const debaters = JSON.parse(localStorage.getItem("debaters")) || [];
    const debater = debaters.find(debater => debater.name === name);

    if (debater) {
        // Actualizar los elementos en la interfaz de estadísticas detalladas
        document.getElementById("debater-name").textContent = debater.name;
        document.getElementById("debater-average-wins").textContent = calculateAverageWins(debater);
        document.getElementById("debater-defeated-list").innerHTML = generateDefeatedList(debater);

        // Mostrar el diálogo modal
        document.getElementById("modal").style.display = "block";
    } else {
        alert("Debater not found!");
    }
}

function closeModal() {
    // Cerrar el diálogo modal
    document.getElementById("modal").style.display = "none";
}

function calculateAverageWins(debater) {
    // Aquí debes implementar la lógica para calcular el promedio de victorias del debater
    // Retorna el promedio como un número redondeado con 2 decimales
    // Ejemplo:
    return (debater.wins / debater.debates).toFixed(2);
}

function generateDefeatedList(debater) {
    // Aquí debes implementar la lógica para generar la lista de debaters vencidos por el debater actual
    // Retorna una cadena HTML que contiene los elementos de la lista
    // Ejemplo:
    let listHTML = "";
    for (const defeated of debater.defeated) {
        listHTML += `<li>${defeated}</li>`;
    }
    return listHTML;
}

