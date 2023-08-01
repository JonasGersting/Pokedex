let currentPokemon;
allPokemons = [];
let min = 1;
let max = 20;
let url = 'https://pokeapi.co/api/v2/pokemon/';

async function loadPokemon() {
    for (let i = min; i < max; i++) {
        url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        allPokemons.push(currentPokemon);
    }
    renderPokemon();
    console.log(allPokemons)
}

function renderPokemon() {
    let pokemonContainer = document.getElementById('pokemonContainer');
    for (let i = min - 1; i < max - 1; i++) {
        console.log(i)
        let currentPokemon = allPokemons[i];
        let pokemonName = (currentPokemon['name']).charAt(0).toUpperCase() + (currentPokemon['name']).slice(1);
        let imgUrl = currentPokemon['sprites']['other']['official-artwork']['front_default'];
        let number = ("000" + (i + 1)).slice(-3);
        pokemonContainer.innerHTML += `
        <div id="pokemon${i}" class="pokemonCell" onclick="showInfo(${i})">
            <h2 id="name${i}">${pokemonName}</h2>
            <img class="pokemonImg" src="${imgUrl}">
            <div class="types" id="types${i}"></div>
            <h3 id="id${i}">#${number}</h3>
        </div>
        `
        for (let j = 0; j < currentPokemon['types'].length; j++) {
            const type = currentPokemon['types'][j]['type']['name'];
            let typeBanner = document.getElementById(`types${i}`);
            typeBanner.innerHTML += `
                <div class="banner">${type}</div>
            `
        }
        setBackgroundColor(currentPokemon, i,);
    }
}




function searchPokemon() {
    let loadBtn = document.getElementById('loadBtn');
    const searchInput = document.getElementById('search').value.toLowerCase();
    if (searchInput.length != 0) {
        loadBtn.style.display = 'none';
        for (let i = 0; i < allPokemons.length; i++) {
            let pokemonName = document.getElementById(`name${i}`).innerHTML.toLowerCase();
            if (!pokemonName.startsWith(searchInput)) {
                let pokemonCell = document.getElementById(`pokemon${i}`);
                pokemonCell.style.display = 'none';
            } else {
                    let pokemonCell = document.getElementById(`pokemon${i}`);
                    pokemonCell.style.display = 'flex';
            }
        }
    }
    else {
        loadBtn.style.display = 'block';
        for (let i = 0; i < allPokemons.length; i++) {
            let pokemonCell = document.getElementById(`pokemon${i}`);
            pokemonCell.style.display = 'flex';
        }
    }
}


function showInfo(i) {
    let pokemonInfoContainer = document.getElementById('infoContainer');
    pokemonInfoContainer.classList.remove('d-none');
    let overlay = document.getElementById('overlay');
    overlay.classList.remove('d-none');
    currentPokemon = allPokemons[i];
    let name = document.getElementById('infoName');
    name.innerHTML = (currentPokemon['name']).charAt(0).toUpperCase() + (currentPokemon['name']).slice(1);
    let infoNumber = document.getElementById('infoNumber');
    infoNumber.innerHTML = `#${("000" + (i + 1)).slice(-3)}`;
    let infoImg = document.getElementById('infoImg');
    infoImg.src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    let typesBackgroundColor = document.getElementById(`types${i}`).firstElementChild.style.backgroundColor;
    let backgroundColor = document.getElementById(`pokemon${i}`).style.backgroundColor;
    let infoTop = document.getElementById('infoTop');
    infoTop.style.backgroundColor = `${backgroundColor}`;
    setNextBtn(i);
    let typeBanner = document.getElementById('infoTypes');
    typeBanner.innerHTML = '';
    for (let j = 0; j < currentPokemon['types'].length; j++) {
        const type = currentPokemon['types'][j]['type']['name'];
        typeBanner.innerHTML += `
            <div class="banner" style="background-color:${typesBackgroundColor}">${type}</div>
        `
    }
    createCanvas(backgroundColor, i);
}

function loadMore() {
    min = min + 19;
    max = max + 19;
    loadPokemon();
}


function setNextBtn(i) {
    if ((i + 1) === allPokemons.length) {
        i = 0;
    }
    let next = document.getElementById('next');
    let nextPokemon = allPokemons[i + 1];
    next.innerHTML = `${(nextPokemon['name']).charAt(0).toUpperCase() + (nextPokemon['name']).slice(1)}`;
    if (i === 0) {
        i = allPokemons.length;
    }
    let last = document.getElementById('back');
    let lastPokemon = allPokemons[i - 1];
    last.innerHTML = `${(lastPokemon['name']).charAt(0).toUpperCase() + (lastPokemon['name']).slice(1)}`;
}


function closeInfo() {
    let pokemonInfoContainer = document.getElementById('infoContainer');
    pokemonInfoContainer.classList.add('d-none');
    let overlay = document.getElementById('overlay');
    overlay.classList.add('d-none');
    const canvas = document.getElementById('statChart');
    canvas.remove();
    let stats = document.getElementById('stats');
    stats.innerHTML += `<canvas width="200px" height="200px" id="statChart"></canvas>`;
}


function goNext(currentPokemon) {
    const canvas = document.getElementById('statChart');
    canvas.remove();
    let stats = document.getElementById('stats');
    stats.innerHTML += `<canvas width="200px" height="200px" id="statChart"></canvas>`;
    let i = currentPokemon['id'] - 1;
    if ((i + 1) === allPokemons.length) {
        i = -1;
    }
    showInfo(i + 1);
}

function goBack(currentPokemon) {
    const canvas = document.getElementById('statChart');
    canvas.remove();
    let stats = document.getElementById('stats');
    stats.innerHTML += `<canvas width="200px" height="200px" id="statChart"></canvas>`;
    let i = currentPokemon['id'] - 1;
    if (i === 0) {
        i = allPokemons.length;
    }
    showInfo(i - 1);
}



function setBackgroundColor(pokemon, i) {
    const pokemonCell = document.getElementById(`pokemon${i}`);
    const banner = pokemonCell.getElementsByClassName('banner');
    const type = pokemon['types'][0]['type']['name'];
    if (type === 'grass') {
        pokemonCell.style.backgroundColor = "#47d1af";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor = "rgb(83 197 170)";
        }
    }
    if (type === 'bug') {
        pokemonCell.style.backgroundColor = "#bad146";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor = "#98af26";
        }
    }
    if (type === 'dragon') {
        pokemonCell.style.backgroundColor = "#f6b523";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor = "#d19716";
        }
    }
    if (type === 'electric') {
        pokemonCell.style.backgroundColor = "#f6d829";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor = "#ddc221";
        }
    }
    if (type === 'fighting') {
        pokemonCell.style.backgroundColor = "#e39f57";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor = "#bf7b32";
        }
    }
    if (type === 'fire') {
        pokemonCell.style.backgroundColor = "#eb6b33";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor = "#bb4917";
        }
    }
    if (type === 'flying') {
        pokemonCell.style.backgroundColor = "#d1d4d6";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor = "#b5babd";
        }
    }
    if (type === 'ghost') {
        pokemonCell.style.backgroundColor = "#a06ca8";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor = "#814d89";
        }
    }
    if (type === 'ground') {
        pokemonCell.style.backgroundColor = "#eac389";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor = "#bb9356";
        }
    }
    if (type === 'ice') {
        pokemonCell.style.backgroundColor = "#4fb6df";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor = "#3594b9";
        }
    }
    if (type === 'normal') {
        pokemonCell.style.backgroundColor = "#e0dcdb";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor = "#b5b0af";
        }
    }
    if (type === 'poison') {
        pokemonCell.style.backgroundColor = "#ad71ac";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor = "#8d538c";
        }
    }
    if (type === 'psychic') {
        pokemonCell.style.backgroundColor = "#5b0f32";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor = "#771341";
        }
    }
    if (type === 'rock') {
        pokemonCell.style.backgroundColor = "#6e3d17";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor = "#854b1e";
        }
    }
    if (type === 'water') {
        pokemonCell.style.backgroundColor = "#4db2e0";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor = "#3199c9";
        }
    }
    if (type === 'fairy') {
        pokemonCell.style.backgroundColor = "#e1c0b5";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor = "#d1ab9f";
        }
    }
}


function createCanvas(backgroundColor, i) {
    const ctx = document.getElementById('statChart');
    currentPokemon = allPokemons[i];
    const hp = currentPokemon['stats'][0]['base_stat'];
    const attack = currentPokemon['stats'][1]['base_stat'];
    const defense = currentPokemon['stats'][2]['base_stat'];
    const spAttack = currentPokemon['stats'][3]['base_stat'];
    const spDefense = currentPokemon['stats'][4]['base_stat'];
    const speed = currentPokemon['stats'][5]['base_stat'];
    const newBackground = adjustRgbaOpacity(backgroundColor, 0.8);

    const data = {
        labels: [
            'HP',
            'Attack',
            'Defense',
            'Sp. Attack',
            'Sp. Defense',
            'Speed',
        ],
        datasets: [{
            label: 'Base stats',
            data: [hp, attack, defense, spAttack, spDefense, speed],
            fill: true,
            backgroundColor: `${newBackground}`,
            borderColor: `${backgroundColor}`,
            pointBackgroundColor: `${backgroundColor}`,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
        }]
    };
    new Chart(ctx, {
        type: 'radar',
        data: data,
        options: {
            scales: {
                r: {
                    suggestedMin: 50,
                    suggestedMax: 100
                }
            }
        }
    });
}

function adjustRgbaOpacity(rgbColor, opacity) {
    // Extrahieren der RGB-Komponenten und der aktuellen Opacity
    const match = rgbColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    if (!match) {
        throw new Error('Ungültiger RGBA-Farbcode. Erwartet wird ein Format wie "rgba(r, g, b, a)".');
    }

    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    const currentOpacity = parseFloat(match[4]);

    // Anpassen der Opacity auf 0.8 (maximal 1, mindestens 0)
    const newOpacity = Math.min(1, Math.max(0, opacity));

    // Zusammenstellen des neuen RGBA-Strings
    return `rgba(${r}, ${g}, ${b}, ${newOpacity})`;
}


// Zeige den Button erst, wenn der Benutzer heruntergescrollt hat
window.addEventListener('scroll', function () {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (window.scrollY > 0) {
        scrollToTopBtn.classList.add('show');
        scrollToTopBtn.classList.remove('hide');
    } else {
        scrollToTopBtn.classList.add('hide');
        scrollToTopBtn.classList.remove('show');
    }
});

// Funktion, die zum Anfang der Seite scrollt
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}











