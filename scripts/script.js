const stadiums = [
    {
        id: 1,
        name: "Santiago Bernabeu",
        capacity: 20000,
        viewers: 75340,
        image: "https://th.bing.com/th/id/OIP.NU4ksUiMsB1Xy_NId9kFHgHaEK?w=258&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
    },
    {
        id: 2,
        name: "Stade de France",
        capacity: 30000,
        viewers: 80698,
        image: "https://th.bing.com/th/id/OIP.W7ZtffnfrT5tFsekLkOh7gHaE7?w=258&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
    },
    {
        id: 3,
        name: "Arena Lviv",
        capacity: 1000,
        viewers: 34915,
        image: "https://th.bing.com/th/id/OIP.4hnVXoxsjgmcoKZ20Y_9DQHaD7?w=258&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
    },
    {
        id: 4,
        name: "Camp Nou",
        capacity: 100000,
        viewers: 99354,
        image: "https://th.bing.com/th/id/OIP.OE7BDkHkN3jGCa6saeh4dQHaE4?w=258&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
    },
    {
        id: 5,
        name: "Wembley",
        capacity: 3000,
        viewers: 90000,
        image: "https://th.bing.com/th/id/OIP.eUvtTvfKdcUfBSIJJVKi4wHaEV?w=258&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
    },
];

let isSorted = false;
const originalOrder = stadiums.map(stadium => stadium.id);

function renderStadiumCards(stadiums) {
    const container = document.getElementById('stadium-data-container');
    container.innerHTML = '';
    stadiums.forEach(stadium => {
        const cardHTML = `
            <div class="card m-2 col-md-4 shadow-sm">
                <img src="${stadium.image}" class="card-img-top" alt="${stadium.name}">
                <div class="card-body">
                    <h5 class="card-title">${stadium.name}</h5>
                    <p class="card-text">Power: ${stadium.capacity} lumens</p>
                    <p class="card-text">Seating capacity: ${stadium.viewers}</p>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
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


document.getElementById('calculate-summary-weight-btn').addEventListener('click', calculateTotalViewers);
document.getElementById('sort-by-number-people-btn').addEventListener('change', StadiumsSort);
document.querySelector('input[type="search"]').addEventListener('input', searchStadiums);

renderStadiumCards(stadiums);

