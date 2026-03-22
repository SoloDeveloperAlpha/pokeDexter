import { num_min, num_max, gen } from "./generation.js";
import { url, urlSpecie } from "./pokemonData.js";

const listaPokemon = document.getElementById("listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const cmain = document.querySelector("main");
const pokeData = document.getElementById("data");

// ✅ Actualiza el año dinámicamente
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  yearSpan.textContent = new Date().getFullYear();
  yearSpan.style.color = "white";
});

// ✅ Evento para cambiar de generación
gen.addEventListener("change", async () => {
  cmain.style.backgroundImage = "none";
  listaPokemon.innerHTML = "";
  pokeData.innerHTML = "";
  pokeData.style.display = "none";


  try {
    const promises = Array.from({ length: num_max - num_min + 1 }, (_, i) => fetchPokemon(num_min + i));
    const results = await Promise.all(promises);

    results
      .filter(Boolean) // Filtrar posibles valores `null` en caso de error
      .sort((a, b) => a.id - b.id)
      .forEach(mostrarPokemon);
  } catch (error) {
    console.error("Error al cargar los Pokémon:", error);
  }
});

// ✅ Función para obtener datos de un Pokémon
async function fetchPokemon(id) {
  try {
    const response = await fetch(`${url}${id}`);
    if (!response.ok) throw new Error(`Error al obtener Pokémon ${id}`);
    return await response.json();
  } catch (error) {
    console.error(`Error en fetchPokemon(${id}):`, error);
    return null;
  }
}

// ✅ Función para mostrar un Pokémon en la lista
function mostrarPokemon(data) {
  const tipos = data.types.map(type => `<p class="${type.type.name} tipo">${type.type.name}</p>`).join("");
  const pokeId = data.id.toString().padStart(3, "0");
  const altura = (data.height / 10).toFixed(1);
  const peso = (data.weight / 10).toFixed(1);

  const div = document.createElement("div");
  div.classList.add("pokemon");
  div.innerHTML = `
    <p class="pokemon-id-back">#${pokeId}</p>
    <div class="pokemon-imagen">
      <img src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}">
    </div>
    <div class="pokemon-info">
      <div class="nombre-contenedor">
        <p class="pokemon-id">#${pokeId}</p>
        <h2 class="pokemon-nombre">${data.name}</h2>
      </div>
      <div class="pokemon-tipos">${tipos}</div>
      <div class="pokemon-stats">
        <p class="stat">${altura}M</p>
        <p class="stat">${peso}KG</p>
      </div>
    </div>`;

  listaPokemon.append(div);

  div.addEventListener("click", () => mostrarDetallesPokemon(data, div));
}

// ✅ Función para mostrar detalles del Pokémon
async function mostrarDetallesPokemon(data, elemento) {
  listaPokemon.innerHTML = "";
  pokeData.innerHTML = "";
  pokeData.style.display = "grid";

  const img_poke = elemento.querySelector(".pokemon-imagen img");
  const nom_poke = elemento.querySelector(".pokemon-info h2");
  if (nom_poke) nom_poke.textContent = nom_poke.textContent.toUpperCase();

  const pTipo = data.types.map(type => `<div class="poke-type ${type.type.name}">${type.type.name.toUpperCase()}</div>`).join("");

  const dexter = document.createElement("div");
  dexter.classList.add("dexter");

  const dexterData = document.createElement("div");
  dexterData.classList.add("dexter-data");

  try {
    const es_p = await obtenerEspecie(data.id);
    await pokemonEvol(data.id);

    dexterData.innerHTML = `
      <div class="dexter-poke-name">
        <div id="poke-name1">
          <img src="assets/images/pokebola.png" alt="">${data.id} ${nom_poke.textContent}
        </div>
        <div id="poke-name2">${es_p.valor1}</div>
      </div>
      <div class="dexter-poke-types">${pTipo}</div>
      <div class="dexter-poke-sizes">
        <div id="poke-sizes-height">Altura ${data.height / 10}m</div>
        <div id="poke-sizes-weight">Peso ${data.weight / 10} kg</div>
      </div>
      <div class="dexter-poke-info">
        <p>${es_p.valor2}</p>
      </div>`;

  } catch (error) {
    console.error("Error al obtener los detalles del Pokémon:", error);
  }

  pokeData.append(dexter);
  pokeData.append(dexterData);
  dexter.append(img_poke);
}

// ✅ Función para obtener información de la especie del Pokémon
async function obtenerEspecie(pID) {
  try {
    const response = await fetch(`${urlSpecie}${pID}`);
    const data = await response.json();

    const genus = data.genera[5]?.genus || "Desconocido";
    const flavor_text = data.flavor_text_entries.find(entry => entry.language.name === "es")?.flavor_text || "Sin descripción";

    return { valor1: genus, valor2: flavor_text };
  } catch (error) {
    console.error(`Error en obtenerEspecie(${pID}):`, error);
    return { valor1: "Desconocido", valor2: "Sin información" };
  }
}

// ✅ Función para obtener la evolución del Pokémon
async function pokemonEvol(pID) {
  try {
    const speciesResponse = await fetch(`${urlSpecie}${pID}`);
    const speciesData = await speciesResponse.json();

    const evolutionChainURL = speciesData.evolution_chain.url;
    const evolutionResponse = await fetch(evolutionChainURL);
    const evolutionData = await evolutionResponse.json();

    if (!evolutionData.chain) {
      console.warn(`No hay evolución para el Pokémon ${pID}`);
      return;
    }

    let evoluciones = [];
    let evolucionActual = evolutionData.chain;

    while (evolucionActual) {
      evoluciones.push(evolucionActual.species.name.toUpperCase());
      evolucionActual = evolucionActual.evolves_to[0];
    }

    const divEvol = document.createElement("div");
    divEvol.classList.add("dexter-evol");
    divEvol.innerHTML = `
      <div class="evolChain">
        <h3>Cadena de evolución:</h3>
        <p>${evoluciones.join(" → ")}</p>
      </div>`;

    pokeData.appendChild(divEvol);
  } catch (error) {
    console.error(`Error en pokemonEvol(${pID}):`, error);
  }
}

//✅ Evento para cambiar de tipo de Pokémon
botonesHeader.forEach(boton =>
  boton.addEventListener("click", async e => {
    const botonId = e.currentTarget.id;
    listaPokemon.innerHTML = "";

    const promises = Array.from({ length: num_max - num_min + 1 }, (_, i) => fetchPokemon(num_min + i));
    const results = await Promise.all(promises);

    results
      .filter(Boolean)
      .forEach(pokemon => {
        if (botonId === "ver-todos") {
          cmain.style.backgroundImage = "none";
          pokeData.innerHTML = "";
          pokeData.style.display = "none";
          mostrarPokemon(pokemon);
        } else if (pokemon.types.some(type => type.type.name === botonId)) {
          let fondo = `fondo${botonId}.png`;
          cmain.style.backgroundImage = `url(./assets/images/${fondo})`;
          pokeData.innerHTML = "";
          pokeData.style.display = "none";
          mostrarPokemon(pokemon);
        }
      });
  })
);

