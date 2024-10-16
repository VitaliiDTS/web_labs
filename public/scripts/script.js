let stadiums = [];
let isSorted = false;
const originalOrder = [];

async function fetchStadiums() {
    try {
        const response = await fetch('http://localhost:5000/stadiums');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        stadiums = await response.json();
        originalOrder.push(...stadiums.map(stadium => stadium.id));
        renderStadiumCards(stadiums);
    } catch (error) {
        console.error('Fetch error: ', error);
    }
}

function renderStadiumCards(stadiums) {
    const container = document.getElementById('stadium-data-container');
    container.innerHTML = '';
    stadiums.forEach(stadium => {
        const cardHTML = `
            <div class="card m-2 col-md-4 shadow-sm" id="stadium-${stadium._id}">
                <img src="${stadium.image}" class="card-img-top" alt="${stadium.name}">
                <div class="card-body">
                    <h5 class="card-title">${stadium.name}</h5>
                    <p class="card-text">Capacity: ${stadium.capacity}</p>
                    <p class="card-text">Viewers: ${stadium.viewers}</p>
                    <button class="btn btn-primary" onclick="editStadium('${stadium._id}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteStadium('${stadium._id}')">Delete</button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    })
}


function calculateTotalViewers() {
    const total = stadiums.reduce((sum, stadium) => sum + stadium.viewers, 0);
    document.querySelector('.text-secondary').textContent = `Total viewers: ${total}`;
}

function StadiumsSort() {
    if (!isSorted) {
        stadiums.sort((a, b) => b.viewers - a.viewers);
    } else {
        resetStadiumsOrder();
    }
    isSorted = !isSorted;
    renderStadiumCards(stadiums);
}

function resetStadiumsOrder() {
    stadiums.sort((a, b) => originalOrder.indexOf(a.id) - originalOrder.indexOf(b.id));
}

function searchStadiums() {
    const searchInput = document.querySelector('input[type="search"]');
    const query = searchInput.value.toLowerCase();

    const filteredStadiums = stadiums.filter(stadium =>
        stadium.name.toLowerCase().includes(query)
    );

    renderStadiumCards(filteredStadiums);
}

async function deleteStadium(stadiumId) {
    try {
        const response = await fetch(`http://localhost:5000/stadiums/${stadiumId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete the stadium');
        }

        stadiums = stadiums.filter(stadium => stadium._id !== stadiumId);

        renderStadiumCards(stadiums);
        calculateTotalViewers();
    } catch (error) {
        console.error('Delete error: ', error);
    }
}


function editStadium(stadiumId) {
    window.location.href = `page/form.html?stadiumId=${stadiumId}`;
}


document.getElementById('calculate-summary-weight-btn').addEventListener('click', calculateTotalViewers);
document.getElementById('sort-by-number-people-btn').addEventListener('change', StadiumsSort);
document.querySelector('input[type="search"]').addEventListener('input', searchStadiums);

fetchStadiums();
