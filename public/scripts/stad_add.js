let form = document.getElementById("createForm");
let submitButton = document.getElementById("submit-button");
let formTitle = document.getElementById("form-title");
let stadiumIdToEdit = null;

let showAlert = (message, type = 'warning') => {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show fixed-bottom w-75`;
    alertDiv.style.bottom = '0';
    alertDiv.style.left = '50%';
    alertDiv.style.transform = "translateX(-50%)";
    alertDiv.style.zIndex = '1050';

    alertDiv.innerHTML = `
        <div class="container">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
};

let createStadium = (data) => {
    fetch("http://localhost:5000/stadiums/bulk", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ stadiums: [data] })
    })
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) {
                showAlert("Стадіон успішно створено", "success");
                form.reset();
            } else {
                showAlert("Виникла помилка при створенні стадіону", "warning");
            }
        })
        .catch(e => {
            console.error(e);
            showAlert(`Виникла помилка: ${String(e)}`, "error");
        });
};

function updateStadium(stadiumId, data) {
    fetch(`http://localhost:5000/stadiums/${stadiumId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(updatedStadium => {
            showAlert('Стадіон успішно оновлено', 'success');
            form.reset();
            stadiumIdToEdit = null;
        })
        .catch(e => {
            console.error(e);
            showAlert(`Помилка при оновленні стадіону: ${String(e)}`, 'error');
        });
}

window.addEventListener('DOMContentLoaded', (event) => {
    const params = new URLSearchParams(window.location.search);
    const stadiumId = params.get('stadiumId');

    if (stadiumId) {
        fetch(`http://localhost:5000/stadiums/${stadiumId}`)
            .then(response => response.json())
            .then(stadium => {
                document.getElementById('name-stadium').value = stadium.name;
                document.getElementById('capacity').value = stadium.capacity;
                document.getElementById('viewers').value = stadium.viewers;
                document.getElementById('image').value = stadium.image;


                stadiumIdToEdit = stadiumId;
            })
            .catch(error => console.error('Error fetching stadium data:', error));
    }
});


form.addEventListener('submit', (e) => {
    e.preventDefault();

    let formData = new FormData(form);
    const stadiumData = {
        name: formData.get('name'),
        capacity: Number(formData.get('capacity')),
        viewers: Number(formData.get('viewers')),
        image: formData.get('image')
    };

    if (stadiumIdToEdit) {
        updateStadium(stadiumIdToEdit, stadiumData);
    } else {
        createStadium(stadiumData);
    }
});
