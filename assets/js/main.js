document.addEventListener("DOMContentLoaded", function() {
    const pokemonList = document.getElementById("pokemonList");
    const loadMoreButton = document.getElementById("loadMoreButton");

    let offset = 0;
    const limit = 12;

    function convertPokemonHtml(pokemon) {
        const typeClasses = pokemon.types.map(type => type.type.name).join(" ");
        
        return `
            <li class="pokemon ${typeClasses}">
                <span class="number">#${pokemon.id.toString().padStart(3, "0")}</span>
                <span class="name">${pokemon.name}</span>
                
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map(type => `<li class="type">${type.type.name}</li>`).join("")}
                    </ol>

                    <img src="${pokemon.sprites.other.dream_world.front_default}" alt="${pokemon.name}">
                </div>
            </li>
        `;
    }

    function loadPokemons() {
        const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

        fetch(url)
            .then(response => response.json())
            .then(jsonbody => jsonbody.results)
            .then(pokemonList => {
                const pokemonPromises = pokemonList.map(pokemon => fetch(pokemon.url).then(response => response.json()));
                return Promise.all(pokemonPromises);
            })
            .then(pokemons => {
                const pokemonHtmlArray = pokemons.map(pokemon => convertPokemonHtml(pokemon));
                pokemonList.innerHTML += pokemonHtmlArray.join("");
            })
            .catch(error => {
                console.error("Houve um erro:", error);
            });
    }

    loadMoreButton.addEventListener("click", function() {
        offset += limit;
        loadPokemons();
    });

    loadPokemons(); // Carrega os Pokémon iniciais
});