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
        <div id="pokemon${i}" class="pokemonCell">
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
    }
}





function checkBackgroundColor() {





}

