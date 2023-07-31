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
    for (let i = 0; i < allPokemons.length; i++) {
        let pokemon = allPokemons[i];
        let pokemonName = (pokemon['name']).charAt(0).toUpperCase() + (pokemon['name']).slice(1);
        let imgUrl = pokemon['sprites']['other']['official-artwork']['front_default'];
        let number = ("000" + (i+1)).slice(-3);
        pokemonContainer.innerHTML += `
        <div id="pokemon${i}" class="pokemonCell" onclick="showInfo('${i}','${imgUrl}','${number}')">
            <h2>${pokemonName}</h2>
            <img class="pokemonImg" src="${imgUrl}">
            <div class="types" id="types${i}"></div>
            <h3>#${number}</h3>
        </div>
        `
        for (let j = 0; j < pokemon['types'].length; j++) {
            const type = pokemon['types'][j]['type']['name'];
            let typeBanner = document.getElementById(`types${i}`);
            typeBanner.innerHTML += `
                <div class="banner">${type}</div>
            `    
        }
        setBackgroundColor(pokemon, i,);
    }
}

function showInfo(pokemonName, imgUrl, number ){
    let pokemonInfoContainer = document.getElementById('infoContainer');
    pokemonInfoContainer.classList.remove('d-none');
    let overlay = document.getElementById('overlay');
    overlay.classList.remove('d-none');
    let name = document.getElementById('infoName');
    name.innerHTML = pokemonName;
    let infoNumber = document.getElementById('infoNumber');
    infoNumber.innerHTML = `#${number}`;
    let infoImg = document.getElementById('infoImg');
    infoImg.src = imgUrl;


}



function setBackgroundColor(pokemon, i) {
    const pokemonCell = document.getElementById(`pokemon${i}`);
    const banner = pokemonCell.getElementsByClassName('banner');
    const type = pokemon['types'][0]['type']['name'];
    if (type === 'grass') {
        pokemonCell.style.backgroundColor = "#47d1af";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor="rgb(83 197 170)";
        }
    }
    if (type === 'bug') {
        pokemonCell.style.backgroundColor = "#bad146";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor="#98af26";
        }
    }
    if (type === 'dragon') {
        pokemonCell.style.backgroundColor = "#f6b523";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor="#d19716";
        }
    }
    if (type === 'electric') {
        pokemonCell.style.backgroundColor = "#f6d829";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor="#ddc221";
        }
    }
    if (type === 'fighting') {
        pokemonCell.style.backgroundColor = "#e39f57";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor="#bf7b32";
        }
    }
    if (type === 'fire') {
        pokemonCell.style.backgroundColor = "#eb6b33";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor="#bb4917";
        }
    }
    if (type === 'flying') {
        pokemonCell.style.backgroundColor = "#d1d4d6";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor="#b5babd";
        }
    }
    if (type === 'ghost') {
        pokemonCell.style.backgroundColor = "#a06ca8";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor="#814d89";
        }
    }
    if (type === 'ground') {
        pokemonCell.style.backgroundColor = "#eac389";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor="#bb9356";
        }
    }
    if (type === 'ice') {
        pokemonCell.style.backgroundColor = "#4fb6df";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor="#3594b9";
        }
    }
    if (type === 'normal') {
        pokemonCell.style.backgroundColor = "#e0dcdb";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor="#b5b0af";
        }
    }
    if (type === 'poison') {
        pokemonCell.style.backgroundColor = "#ad71ac";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor="#8d538c";
        }
    }
    if (type === 'psychic') {
        pokemonCell.style.backgroundColor = "#5b0f32";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor="#771341";
        }
    }
    if (type === 'rock') {
        pokemonCell.style.backgroundColor = "#6e3d17";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor="#854b1e";
        }
    }
    if (type === 'water') {
        pokemonCell.style.backgroundColor = "#4db2e0";
        for (let i = 0; i < banner.length; i++) {
            banner[i].style.backgroundColor="#3199c9";
        }
    }
    


}

