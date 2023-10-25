const listaPokemon = document.getElementById('listaPokemon');
const botonesHeader = document.querySelectorAll(".btn-header");
const cabecera = document.querySelector('header');
const pokeData = document.getElementById('data');
const cmain = document.querySelector('main');

document.addEventListener("DOMContentLoaded", function() {
    const yearSpan = document.getElementById("year");
    const currentYear = new Date().getFullYear();
    yearSpan.textContent = currentYear;
    yearSpan.style.color="white";
  });

import { num_min, num_max, gen } from "./generation.js";

let url = "https://pokeapi.co/api/v2/pokemon/";
let urlSpecie = "https://pokeapi.co/api/v2/pokemon-species/"
gen.addEventListener("change", function () {
  cabecera.style.backgroundColor="#f7f7f7";
  cmain.style.backgroundImage="none";
    listaPokemon.innerHTML = "";
    pokeData.innerHTML = "";
    pokeData.style.display = "none";
    for (let i = num_min; i <= num_max; i++) {
        fetch(url + i)
            .then(data => {
                return data.json();
            })
            .then(dataJSON => {
                mostrarPokemon(dataJSON);
            });
    }

});

function mostrarPokemon(data) {
    let tipos = data.types.map((type) =>
        `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join('');
    let pokeId = data.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }

    const div = document.createElement("div");
    const altura = data.height / 10;
    const peso = data.weight / 10;
    div.classList.add("pokemon");
    div.innerHTML = `<p class="pokemon-id-back">#${pokeId}</p>
                    <div class="pokemon-imagen">
                        <img src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}" srcset="">
                    </div>
                    <div class="pokemon-info">
                        <div class="nombre-contenedor">
                            <p class="pokemon-id">#${pokeId}</p>
                            <h2 class="pokemon-nombre">${data.name}</h2>
                        </div>
                        <div class="pokemon-tipos">
                            ${tipos}
                        </div>
                        <div class="pokemon-stats">
                            <p class="stat">${altura}M</p>
                            <p class="stat">${peso}KG</p>
                        </div>
                    </div>`
    listaPokemon.append(div);

    div.addEventListener("click", (e) => {
        listaPokemon.innerHTML = "";
        //pantallaEspera();
        pokeData.innerHTML = "";
        pokeData.style.display = "grid";
        let pokeInfo = e.currentTarget;
        const img_poke = pokeInfo.querySelector('.pokemon-imagen img');
        let nom_poke = pokeInfo.querySelector('.pokemon-info h2');

        if (nom_poke) { nom_poke.textContent = nom_poke.textContent.toUpperCase(); }

        let pTipo = data.types.map((type) =>
        `<div class="poke-type ${type.type.name}">
        ${type.type.name.toUpperCase()}
        </div>`);
        pTipo = pTipo .join('');

        //PokeData contiene a Dexter, DexterData, DexterHab y DexterBotones
        const dexter = document.createElement('div');
        dexter.classList.add("dexter");
        const dexterData = document.createElement('div');
        dexterData.classList.add("dexter-data");
        const dexterPokeName = document.createElement('div');//Dentro de DexterData
        dexterPokeName.classList.add("dexter-poke-name");
        
        async function obtenerEspec() {
          try {
              var es_p = await pokemonEspecie(data.id);
              dexterData.innerHTML = `
                            <div class="dexter-poke-name">
                              <div id="poke-name1">
                              <img src="/assets/images/pokebola.png" alt="" srcset="">${pokeId} ${nom_poke.textContent}</div>
                              <div id="poke-name2">${es_p.valor1}</div>
                            </div>
                            <div class="dexter-poke-types">
                              ${pTipo}
                            </div>
                            <div class="dexter-poke-sizes">
                                <div id="poke-sizes-height">Altura ${altura}m</div>
                                <div id="poke-sizes-weight">Peso ${peso} kg</div>
                            </div>
                            <div class="dexter-poke-info">
                                <p>${es_p.valor2}</p>
                            </div>`;
          } catch (error) {
              console.error("Error al obtener la descripción:", error);
          }
          
        }
        obtenerEspec();//Se pone DesterPokeData dentro de DexterData
        
        pokeData.append(dexter);
        pokeData.append(dexterData);
        dexter.append(img_poke);

    });
}

async function pokemonEspecie(pID) {
    try {
        const response = await fetch(urlSpecie + pID);
        const dataJSON = await response.json();
        const { genera } = dataJSON;
        const { flavor_text_entries } = dataJSON;
        const { moves } = dataJSON;
        const genus = genera[5].genus;
        for(let x=0;x<=flavor_text_entries.length;x++){
          let lang=flavor_text_entries[x].language;
          if(lang.name==='es'){
            let det_esp=flavor_text_entries[x].flavor_text;
            return {valor1:genus,valor2:det_esp,valor3:moves};
          }
        }
    } catch (error) {
        console.error("Error al obtener la especie del Pokémon:", error);
        throw error;
    }
}

async function obtenerPokemon(pkID) {
  try {
      const response = await fetch(url + pkID);
      const dataJSON = await response.json();
      const { moves } = dataJSON;
      return {val1:moves};
  } catch (error) {
      console.error("Error al obtener DATOS Pokémon:", error);
      throw error;
  }
}

async function nuevoAttak(Rnd,atk){
  try{
      while(Rnd.length<4){
        const RndAl = Math.floor(Math.random()* atk+1);
        if(!Rnd.includes(RndAl)){
          Rnd.push(RndAl);
        }
      }
      return Rnd;
  }catch(error){
    console.error("Error al obtener RANDOM ATAQUES Pokémon:", error);
      throw error;
  }
}

botonesHeader.forEach(boton => boton.addEventListener("click", (e) => {
    const botonId = e.currentTarget.id;
    let estilos = window.getComputedStyle(document.getElementById(botonId));
    listaPokemon.innerHTML = "";
    for (let i = num_min; i <= num_max; i++) {
        fetch(url + i)
            .then(data => {
                return data.json();
            })
            .then(dataJSON => {
                pokeData.innerHTML = "";
                pokeData.style.display = "none";
                if (botonId === "ver-todos") {
                    cmain.style.backgroundImage="none";
                    mostrarPokemon(dataJSON);
                } else {
                    cmain.style.backgroundImage = `url("/assets/images/fondo${botonId}.png")`;
                    const tipos = dataJSON.types.map(type => type.type.name);
                    if (tipos.some(tipo => tipo.includes(botonId))) {
                        mostrarPokemon(dataJSON);
                    }
                }
            });
    }

    let valorPropiedad = estilos.getPropertyValue('background-color');
    cabecera.style.backgroundColor = `${valorPropiedad}`;
}));

/*function pantallaEspera(){

}*/

