let currentPokemon;
allPokemons = [];
let currentEvolutionChain = [];
let min = 1;
let max = 20;
let url = 'https://pokeapi.co/api/v2/pokemon/';
window.onload = function () {
    window.addEventListener('scroll', handleScroll);
}
/**
 * Loads Pokemon data by fetching a specific range of Pokemon, then renders them on the page.
 * Toggles a loading overlay while fetching data.
 */
async function loadPokemon() {
    toggleLoadingOverlay(true);
    await fetchPokemons(min, max);
    toggleLoadingOverlay(false);
    adjustContainers();
    renderPokemon();
}
/**
 * Toggles the visibility of the loading overlay.
 * @param {boolean} show - Determines whether to show or hide the loading overlay.
 */
function toggleLoadingOverlay(show) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = show ? 'flex' : 'none';
    if (show && min > 1) loadingOverlay.style.zIndex = '997';
}
/**
 * Fetches Pokemon data from the API for a given range and stores the results in the `allPokemons` array.
 * @param {number} min - The starting index for the Pokemon.
 * @param {number} max - The ending index for the Pokemon.
 */
async function fetchPokemons(min, max) {
    for (let i = min; i < max; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        const response = await fetch(url);
        allPokemons.push(await response.json());
    }
}
/**
 * Adjusts the height of the top and bottom containers after a short delay.
 */
function adjustContainers() {
    const top = document.getElementById('headContainer');
    const bottom = document.getElementById('bottomContainer');
    setTimeout(() => {
        top.style.height = '60px';
        bottom.style.height = '60px';
    }, 500);
}
/**
 * Renders a list of Pokemon by generating their HTML, displaying their types, 
 * and setting the background color for each Pokemon.
 */
function renderPokemon() {
    const pokemonContainer = document.getElementById('pokemonContainer');
    for (let i = min - 1; i < max - 1; i++) {
        const currentPokemon = allPokemons[i];
        const pokemonHTML = createPokemonHTML(currentPokemon, i);
        pokemonContainer.innerHTML += pokemonHTML;
        renderPokemonTypes(currentPokemon, i);
        setBackgroundColor(currentPokemon, i);
    }
}
/**
 * Generates HTML for a specific Pokemon, including its name, image, and ID number.
 * @param {Object} pokemon - The Pokemon object containing data for the Pokemon.
 * @param {number} index - The index of the Pokemon in the array.
 * @returns {string} - The HTML string representing the Pokemon.
 */
function createPokemonHTML(pokemon, index) {
    const name = capitalizeFirstLetter(pokemon.name);
    const imgUrl = pokemon.sprites.other['official-artwork'].front_default;
    const number = ("000" + (index + 1)).slice(-3);
    return returnContainer(index, name, imgUrl, number);
}
/**
 * Renders the types of a Pokemon by adding banners for each type to the UI.
 * @param {Object} pokemon - The Pokemon object containing type information.
 * @param {number} index - The index of the Pokemon in the array.
 */
function renderPokemonTypes(pokemon, index) {
    const typeBanner = document.getElementById(`types${index}`);
    pokemon.types.forEach(typeInfo => {
        const type = typeInfo.type.name;
        typeBanner.innerHTML += `<div class="banner">${type}</div>`;
    });
}
/**
 * Capitalizes the first letter of a given string.
 * @param {string} str - The string to be capitalized.
 * @returns {string} - The string with the first letter capitalized.
 */
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
/**
 * Returns the HTML structure for a single Pokemon cell, including its name, image, 
 * types, and ID number. The cell also includes an event listener to show more information when clicked.
 * @param {number} i - The index of the Pokemon in the array.
 * @param {string} pokemonName - The name of the Pokemon.
 * @param {string} imgUrl - The URL of the Pokemon's image.
 * @param {string} number - The formatted ID number of the Pokemon.
 * @returns {string} - The HTML structure for the Pokemon cell.
 */
function returnContainer(i, pokemonName, imgUrl, number) {
    return `
    <div id="pokemon${i}" class="pokemonCell" onclick="showInfo(${i})">
        <h2 id="name${i}">${pokemonName}</h2>
        <img class="pokemonImg" src="${imgUrl}">
        <div class="types" id="types${i}"></div>
        <h3 id="id${i}">#${number}</h3>
    </div>
    `
}
/**
 * Searches for Pokemon by name based on the user's input and filters them accordingly.
 * It also toggles the visibility of the load button based on the input.
 */
function searchPokemon() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    toggleLoadButton(searchInput);
    allPokemons.forEach((_, i) => togglePokemonDisplay(i, searchInput));
}
/**
 * Toggles the visibility of the load button depending on the search input.
 * If there is search input, the load button is hidden.
 * @param {string} searchInput - The current search input from the user.
 */
function toggleLoadButton(searchInput) {
    const loadBtn = document.getElementById('loadBtn');
    loadBtn.style.display = searchInput.length ? 'none' : 'block';
}
/**
 * Toggles the display of individual Pokemon cells based on whether their name 
 * matches the search input.
 * @param {number} index - The index of the Pokemon in the array.
 * @param {string} searchInput - The search input entered by the user.
 */
function togglePokemonDisplay(index, searchInput) {
    const pokemonCell = document.getElementById(`pokemon${index}`);
    const pokemonName = document.getElementById(`name${index}`).innerHTML.toLowerCase();
    pokemonCell.style.display = pokemonName.startsWith(searchInput) || !searchInput ? 'flex' : 'none';
}
/**
 * Displays detailed information about a specific Pokemon, including its stats, evolution, 
 * navigation buttons, and banners. This function is triggered when a Pokemon is clicked.
 * @param {number} i - The index of the selected Pokemon.
 */
function showInfo(i) {
    toggleStatOrEvolution('stats', i);
    prepareInfoDisplay(i);
    setNextBtn(i);
    setBackBtn(i);
    updateInfoBanners(i);
    updateInfoCanvas(i);
}
/**
 * Prepares and displays the information for the selected Pokemon by updating the UI and 
 * changing the display state. It also updates the current Pokemon object.
 * @param {number} i - The index of the selected Pokemon.
 */
function prepareInfoDisplay(i) {
    changeDNone();
    currentPokemon = allPokemons[i];
    updateInfoContent(i);
    updateInfoStyle(i);
}
/**
 * Updates the content of the Pokemon's detailed info section, including its name, ID number, 
 * and image. It populates the appropriate elements with the information from the current Pokemon.
 * @param {number} i - The index of the selected Pokemon.
 */
function updateInfoContent(i) {
    document.getElementById('infoName').innerHTML = capitalize(allPokemons[i]['name']);
    document.getElementById('infoNumber').innerHTML = `#${("000" + (i + 1)).slice(-3)}`;
    document.getElementById('infoImg').src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
}
/**
 * Updates the style of the info display, setting the background color based on the selected 
 * Pokemon's cell background color.
 * @param {number} i - The index of the selected Pokemon.
 */
function updateInfoStyle(i) {
    const backgroundColor = document.getElementById(`pokemon${i}`).style.backgroundColor;
    document.getElementById('infoTop').style.backgroundColor = backgroundColor;
}
/**
 * Capitalizes the first letter of a string and returns the modified string.
 * @param {string} str - The string to capitalize.
 * @returns {string} - The input string with the first letter capitalized.
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
/**
 * Updates the information banners of the selected Pokemon by changing their content.
 * This function is called to update any banners associated with the detailed view.
 * @param {number} i - The index of the selected Pokemon.
 */
function updateInfoBanners(i) {
    changeBanner(i);
}
/**
 * Updates the canvas associated with the detailed view of the selected Pokemon, 
 * setting the canvas background color based on the selected Pokemon's color.
 * @param {number} i - The index of the selected Pokemon.
 */
function updateInfoCanvas(i) {
    const backgroundColor = document.getElementById(`pokemon${i}`).style.backgroundColor;
    createCanvas(backgroundColor, i);
}
/**
 * Displays basic information about the selected Pokemon in the detailed view, 
 * including the Pokemon's name, ID number, image, and background color.
 * It also sets up buttons for evolution and navigation.
 * @param {object} pokemon - The Pokemon object containing the detailed data.
 * @param {number} i - The index of the selected Pokemon.
 */
function displayBasicInfo(pokemon, i) {
    const name = document.getElementById('infoName');
    name.innerHTML = (pokemon['name']).charAt(0).toUpperCase() + (pokemon['name']).slice(1);
    const infoNumber = document.getElementById('infoNumber');
    infoNumber.innerHTML = `#${("000" + (i + 1)).slice(-3)}`;
    const infoImg = document.getElementById('infoImg');
    infoImg.src = pokemon['sprites']['other']['official-artwork']['front_default'];
    const typesBackgroundColor = document.getElementById(`types${i}`).firstElementChild.style.backgroundColor;
    const backgroundColor = document.getElementById(`pokemon${i}`).style.backgroundColor;
    const infoTop = document.getElementById('infoTop');
    infoTop.style.backgroundColor = backgroundColor;
    setEvolutionBtn(i);
    setNextBtn(i);
    setBackBtn(i);
}
/**
 * Displays type banners for the selected Pokemon in the detailed view.
 * The banners represent the types of the Pokemon and are displayed with a specific background color.
 * @param {object} pokemon - The Pokemon object containing its type information.
 * @param {number} i - The index of the selected Pokemon.
 */
function displayTypeBanners(pokemon, i) {
    const typeBanner = document.getElementById('infoTypes');
    typeBanner.innerHTML = '';
    for (let j = 0; j < pokemon['types'].length; j++) {
        const type = pokemon['types'][j]['type']['name'];
        typeBanner.innerHTML += `
            <div class="banner" style="background-color:${typesBackgroundColor}">${type}</div>
        `;
    }
}
/**
 * Creates a canvas for the selected Pokemon in the detailed view and sets its background color.
 * @param {object} pokemon - The Pokemon object.
 * @param {number} i - The index of the selected Pokemon.
 */
function createCanvasForPokemon(pokemon, i) {
    const backgroundColor = document.getElementById(`pokemon${i}`).style.backgroundColor;
    createCanvas(backgroundColor, i);
}
/**
 * Displays the detailed Pokemon information container by removing the 'd-none' class 
 * and applies a slide-in animation from the bottom. The overlay is also displayed.
 */
function changeDNone() {
    let pokemonInfoContainer = document.getElementById('infoContainer');
    pokemonInfoContainer.classList.remove('d-none');
    pokemonInfoContainer.style.animation = 'slideInFromBottom 0.5s ease-out'; // Animation activation
    let overlay = document.getElementById('overlay');
    overlay.classList.remove('d-none');
    document.body.style.overflow = 'hidden';
}
/**
 * Changes the type banners in the detailed view based on the selected Pokemon's type.
 * This function updates the banners to reflect the current Pokemon's types.
 * @param {number} i - The index of the selected Pokemon.
 */
function changeBanner(i) {
    let typesBackgroundColor = document.getElementById(`types${i}`).firstElementChild.style.backgroundColor;
    let typeBanner = document.getElementById('infoTypes');
    typeBanner.innerHTML = '';
    for (let j = 0; j < currentPokemon['types'].length; j++) {
        const type = currentPokemon['types'][j]['type']['name'];
        typeBanner.innerHTML += `
            <div class="banner" style="background-color:${typesBackgroundColor}">${type}</div>
        `;
    }
}
/**
 * Loads more Pokemon by incrementing the `min` and `max` values and then calling the `loadPokemon()` function.
 * This is typically used for pagination or infinite scrolling.
 */
function loadMore() {
    min = min + 19;
    max = max + 19;
    loadPokemon();
}
/**
 * Sets up the "Next" button to navigate to the next Pokemon in the list. 
 * If the current Pokemon is the last one, it cycles back to the first one.
 * @param {number} i - The index of the current Pokemon.
 */
function setNextBtn(i) {
    if ((i + 1) === allPokemons.length) {
        i = -1;
    }
    let next = document.getElementById('next');
    let nextPokemon = allPokemons[i + 1];
    next.innerHTML = `${(nextPokemon['name']).charAt(0).toUpperCase() + (nextPokemon['name']).slice(1)}`;
}
/**
 * Sets up the "Back" button to navigate to the previous Pokemon in the list. 
 * If the current Pokemon is the first one, it cycles back to the last one.
 * @param {number} i - The index of the current Pokemon.
 */
function setBackBtn(i) {
    if (i === 0) {
        i = allPokemons.length;
    }
    let last = document.getElementById('back');
    let lastPokemon = allPokemons[i - 1];
    last.innerHTML = `${(lastPokemon['name']).charAt(0).toUpperCase() + (lastPokemon['name']).slice(1)}`;
}
/**
 * Closes the detailed Pokemon information container by adding the 'd-none' class 
 * and removing any applied animations. Also resets the overlay and canvas.
 */
function closeInfo() {
    let pokemonInfoContainer = document.getElementById('infoContainer');
    pokemonInfoContainer.style.animation = '';
    pokemonInfoContainer.classList.add('d-none');
    let overlay = document.getElementById('overlay');
    overlay.classList.add('d-none');
    document.body.style.overflow = 'auto';
    const canvas = document.getElementById('statChart');
    canvas.remove();
    let stats = document.getElementById('stats');
    stats.innerHTML += `<canvas class="statCanvas" id="statChart"></canvas>`;
}
/**
 * Navigates to the next Pokemon by removing the existing stat chart, resetting the evolution chain, 
 * and displaying the next Pokemon's details along with the new stat chart.
 * It also triggers a sliding animation for the image.
 * @param {object} currentPokemon - The currently displayed Pokemon object.
 */
function goNext(currentPokemon) {
    toggleStatOrEvolution('stats');
    currentEvolutionChain = [];
    const canvas = document.getElementById('statChart');
    canvas.remove();
    let stats = document.getElementById('stats');
    stats.innerHTML += `<canvas class="statCanvas" id="statChart"></canvas>`;
    let i = currentPokemon['id'] - 1;
    if ((i + 1) === allPokemons.length) {
        i = -1;
    }
    showInfo(i + 1);
    triggerSlideIn();
}
/**
 * Navigates to the previous Pokemon by removing the existing stat chart, resetting the evolution chain,
 * and displaying the previous Pokemon's details along with the new stat chart.
 * It also triggers a sliding animation for the image.
 * @param {object} currentPokemon - The currently displayed Pokemon object.
 */
function goBack(currentPokemon) {
    toggleStatOrEvolution('stats');
    currentEvolutionChain = [];
    const canvas = document.getElementById('statChart');
    canvas.remove();
    let stats = document.getElementById('stats');
    stats.innerHTML += `<canvas class="statCanvas" id="statChart"></canvas>`;
    let i = currentPokemon['id'] - 1;
    if (i === 0) {
        i = allPokemons.length;
    }
    showInfo(i - 1);
    triggerSlideIn();
}
/**
 * Triggers a slide-in animation for the Pokemon's image, creating a smooth transition effect.
 */
function triggerSlideIn() {
    const infoImg = document.getElementById('infoImg');
    infoImg.classList.remove('slideInFromRight'); 
    void infoImg.offsetWidth; // Triggers reflow to reset animation
    infoImg.classList.add('slideInFromRight');
}
/**
 * Creates a radar chart displaying the selected Pokemon's stats. The chart's background color and 
 * other chart properties are customized based on the Pokemon's details.
 * @param {string} backgroundColor - The background color to be used in the chart.
 * @param {number} i - The index of the selected Pokemon.
 */
function createCanvas(backgroundColor, i) {
    const ctx = document.getElementById('statChart');
    const stats = extractStats(i);
    const newBackground = adjustRgbaOpacity(backgroundColor, 0.8);
    new Chart(ctx, {
        type: 'radar',
        data: buildChartData(stats, newBackground, backgroundColor),
        options: buildChartOptions(),
    });
}
/**
 * Extracts the base stats of the selected Pokemon and maps them to a simpler object structure.
 * @param {number} i - The index of the selected Pokemon.
 * @returns {object} The extracted stats for the Pokemon.
 */
function extractStats(i) {
    const stats = allPokemons[i]['stats'].map(stat => stat['base_stat']);
    return {
        hp: stats[0],
        defense: stats[1],
        spDefense: stats[2],
        speed: stats[5],
        spAttack: stats[3],
        attack: stats[4],
    };
}
/**
 * Builds the data required for the radar chart, including the stat values, chart colors, and point properties.
 * @param {object} stats - The extracted stats of the Pokemon.
 * @param {string} backgroundColor - The background color for the chart.
 * @param {string} borderColor - The border color for the chart.
 * @returns {object} The data structure used for rendering the radar chart.
 */
function buildChartData(stats, backgroundColor, borderColor) {
    return {
        labels: ['HP', 'DEF', 'Sp. DEF', 'SPEED', 'Sp. ATT', 'ATT'],
        datasets: [{
            data: [stats.hp, stats.defense, stats.spDefense, stats.speed, stats.spAttack, stats.attack],
            fill: true,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            pointBackgroundColor: borderColor,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)',
        }],
    };
}
/**
 * Returns the options for customizing the appearance and behavior of the radar chart.
 * @returns {object} The chart options.
 */
function buildChartOptions() {
    return {
        plugins: {
            legend: { display: false },
        },
        scales: {
            r: {
                suggestedMin: 50,
                suggestedMax: 100,
                pointLabels: {
                    color: 'black',
                    font: { size: 20 },
                },
            },
        },
    };
}
/**
 * Adjusts the opacity of an RGB color value to create an RGBA value.
 * @param {string} rgbColor - The RGB color value (e.g., "rgb(255, 99, 132)").
 * @param {number} opacity - The desired opacity level (between 0 and 1).
 * @returns {string} The RGBA color string with the adjusted opacity.
 */
function adjustRgbaOpacity(rgbColor, opacity) {
    const match = rgbColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) {
        throw new Error('Invalid RGB color format. Expected "rgb(r, g, b)".');
    }
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    const newOpacity = Math.min(1, Math.max(0, opacity));
    return `rgba(${r}, ${g}, ${b}, ${newOpacity})`;
}
/**
 * Handles the visibility of the "Scroll to Top" button based on the user's scroll position.
 */
function handleScroll() {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (window.scrollY > 0) {
        scrollToTopBtn.classList.remove('hide');
    } else {
        scrollToTopBtn.classList.add('hide');
    }
}
/**
 * Scrolls the page to the top with a smooth scrolling effect when the "Scroll to Top" button is clicked.
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
/**
 * Sets the background color of the Pokemon's cell and its banner based on its type.
 * The colors are predefined for each Pokemon type.
 * @param {Object} pokemon - The Pokemon object containing the type information.
 * @param {number} i - The index of the current Pokemon.
 */
function setBackgroundColor(pokemon, i) {
    const pokemonCell = document.getElementById(`pokemon${i}`);
    const banner = pokemonCell.getElementsByClassName('banner');
    const type = pokemon['types'][0]['type']['name'];
    const colors = {
        grass: ["#47d1af", "#83c5aa"], bug: ["#bad146", "#98af26"], dragon: ["#f6b523", "#d19716"],
        electric: ["#f6d829", "#ddc221"], fighting: ["#e39f57", "#bf7b32"], fire: ["#eb6b33", "#bb4917"],
        flying: ["#d1d4d6", "#b5babd"], ghost: ["#a06ca8", "#814d89"], ground: ["#eac389", "#bb9356"],
        ice: ["#4fb6df", "#3594b9"], normal: ["#e0dcdb", "#b5b0af"], poison: ["#ad71ac", "#8d538c"],
        psychic: ["#5b0f32", "#771341"], rock: ["#6e3d17", "#854b1e"], water: ["#4db2e0", "#3199c9"],
        fairy: ["#e1c0b5", "#d1ab9f"]
    };
    setColors(pokemonCell, banner, colors[type]);
}
/**
 * Applies the specified colors to the given Pokemon cell and its banners.
 * @param {HTMLElement} cell - The Pokemon cell element.
 * @param {HTMLCollection} banner - A collection of the banner elements inside the cell.
 * @param {Array} colorPair - An array containing two color values for the background.
 */
function setColors(cell, banner, colorPair) {
    cell.style.backgroundColor = colorPair[0];
    for (let i = 0; i < banner.length; i++) {
        banner[i].style.backgroundColor = colorPair[1];
    }
}
/**
 * Toggles between the "stats" and "evolution" views when clicked.
 * Shows the selected view and hides the other.
 * @param {string} id - The ID of the section to display ('stats' or 'evolution').
 * @param {number} i - The index of the current Pokemon to fetch its evolution.
 */
function toggleStatOrEvolution(id, i) {
    let stats = document.getElementById('stats');
    let evolution = document.getElementById('evolution');
    if (id === 'stats') {
        stats.classList.remove('d-none');
        evolution.classList.add('d-none');
    }
    else {
        stats.classList.add('d-none');
        evolution.classList.remove('d-none');
        searchEvolution(i);
    }
}
/**
 * Fetches the evolution chain of a Pokemon using its species ID, 
 * and displays a loading spinner while fetching the data.
 * Once the data is received, the evolution chain is fetched.
 * @param {number} i - The ID of the Pokemon whose evolution chain is to be fetched.
 */
async function searchEvolution(i) {
    const evolutionContainer = document.getElementById('evolution');
    evolutionContainer.innerHTML = '';
    evolutionContainer.innerHTML += `<div class="loadingSpinner" id="loadingSpinner2"></div>`
    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${i}/`;
    fetch(speciesUrl)
        .then(response => response.json())
        .then(data => {
            const evolutionChainId = data.evolution_chain.url.split('/').filter(Boolean).pop();
            getEvolutionChain(evolutionChainId);
        });
}
/**
 * Fetches the evolution chain of a Pokemon using its ID, and updates the evolution container with a loading spinner.
 * Once the evolution chain is fetched, it triggers the process to get the evolution chain's details.
 * @param {number} i - The ID of the Pokemon whose evolution chain is to be fetched.
 */
async function searchEvolution(i) {
    const evolutionContainer = document.getElementById('evolution');
    evolutionContainer.innerHTML = '';
    evolutionContainer.innerHTML += `<div class="loadingSpinner" id="loadingSpinner2"></div>`
    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${i}/`;
    fetch(speciesUrl)
        .then(response => response.json())
        .then(data => {
            const evolutionChainId = data.evolution_chain.url.split('/').filter(Boolean).pop();
            getEvolutionChain(evolutionChainId);
        });
}
/**
 * Fetches the evolution chain of a Pokemon based on the provided evolution chain ID.
 * It populates the currentEvolutionChain array with the names of the evolved Pokemon and fetches their sprites.
 * @param {string} id - The ID of the evolution chain.
 */
async function getEvolutionChain(id) {
    currentEvolutionChain = [];
    const url = `https://pokeapi.co/api/v2/evolution-chain/${id}/`;
    const response = await fetch(url);
    const evolutionChainData = await response.json();
    let evolution = evolutionChainData.chain;
    while (evolution) {
        currentEvolutionChain.push(evolution.species.name);
        evolution = evolution.evolves_to[0];
    }
    await fetchEvolutionSprites(); 
    renderEvolutionChain();
}
/**
 * Fetches the sprite images of each Pokemon in the current evolution chain and updates the evolution chain array 
 * to include the Pokemon names and their respective images.
 */
async function fetchEvolutionSprites() {
    for (let i = 0; i < currentEvolutionChain.length; i++) {
        const name = currentEvolutionChain[i];
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const pokemonData = await response.json();
        currentEvolutionChain[i] = {
            name: pokemonData.name,
            image: pokemonData.sprites.other['official-artwork'].front_default
        };
    }
}
/**
 * Renders the evolution chain in the evolution container, displaying each Pokemon's image and name.
 * Arrows are displayed between the evolutionary stages, except for the last Pokemon in the chain.
 */
function renderEvolutionChain() {
    const evolutionContainer = document.getElementById('evolution');
    evolutionContainer.innerHTML = '';
    currentEvolutionChain.forEach((pokemon, index) => {
        const formattedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        const isLast = index === currentEvolutionChain.length - 1;
        evolutionContainer.innerHTML += `
            <div class="evolution-step">
                <img src="${pokemon.image}" alt="${formattedName}" class="evolution-image">
                <span class="noTextShadow">${formattedName}</span>
            </div>
             ${!isLast ? '<span class="arrow noTextShadow">→</span>' : ''}
        `;
    });
}