let currentPokemon;
allPokemons = [];
let min = 1;
let max = 20;
let url = 'https://pokeapi.co/api/v2/pokemon/';

async function loadPokemon(){
    for (let i = min; i < max; i++) {
        url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        console.log(currentPokemon)
    }




}
