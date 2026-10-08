package com.pokedex.pokedex.service;

import com.pokedex.pokedex.model.Pokemon;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PokemonService {

    private List<Pokemon> pokemonList = new ArrayList<>();

    public PokemonService() {

        // GRASS
        pokemonList.add(new Pokemon(1, "Bulbasaur", "Grass", "A strange seed was planted on its back at birth.", 0.7, 6.9));
        pokemonList.add(new Pokemon(2, "Oddish", "Grass", "During the day, it buries itself in soil.", 0.5, 5.4));
        pokemonList.add(new Pokemon(3, "Bellsprout", "Grass", "Traps and eats bugs.", 0.7, 4.0));
        pokemonList.add(new Pokemon(4, "Chikorita", "Grass", "Uses leaf to check humidity.", 0.9, 6.4));
        pokemonList.add(new Pokemon(5, "Treecko", "Grass", "Can climb vertical walls.", 0.5, 5.0));

        // FIRE
        pokemonList.add(new Pokemon(6, "Charmander", "Fire", "Obviously prefers hot places.", 0.6, 8.5));
        pokemonList.add(new Pokemon(7, "Vulpix", "Fire", "Has one tail at birth.", 0.6, 9.9));
        pokemonList.add(new Pokemon(8, "Growlithe", "Fire", "Very loyal Pokémon.", 0.7, 19.0));
        pokemonList.add(new Pokemon(9, "Ponyta", "Fire", "Hooves harder than diamonds.", 1.0, 30.0));
        pokemonList.add(new Pokemon(10, "Cyndaquil", "Fire", "Timid but strong.", 0.5, 7.9));

        // WATER
        pokemonList.add(new Pokemon(11, "Squirtle", "Water", "After birth, it sprays water from its mouth.", 0.5, 9.0));
        pokemonList.add(new Pokemon(12, "Psyduck", "Water", "Gets headaches often.", 0.8, 19.6));
        pokemonList.add(new Pokemon(13, "Poliwag", "Water", "Thin transparent skin.", 0.6, 12.4));
        pokemonList.add(new Pokemon(14, "Magikarp", "Water", "Weak but famous.", 0.9, 10.0));
        pokemonList.add(new Pokemon(15, "Totodile", "Water", "Small but strong.", 0.6, 9.5));
    }

    public List<Pokemon> getAllPokemon() {
        return pokemonList;
    }

    public List<Pokemon> getPokemonByType(String type) {
        List<Pokemon> result = new ArrayList<>();
        for (Pokemon p : pokemonList) {
            if (p.getType().equalsIgnoreCase(type)) {
                result.add(p);
            }
        }
        return result;
    }
}