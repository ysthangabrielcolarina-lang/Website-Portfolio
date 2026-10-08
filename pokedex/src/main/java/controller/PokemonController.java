package com.pokedex.pokedex.controller;

import com.pokedex.pokedex.model.Pokemon;
import com.pokedex.pokedex.service.PokemonService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pokedex")
public class PokemonController {

    private final PokemonService service;

    public PokemonController(PokemonService service) {
        this.service = service;
    }

    // Optional home endpoint
    @GetMapping
    public String home() {
        return "grp2 Pokedex API is running";
    }

    // GET all or filter by type
    @GetMapping("/list")
    public List<Pokemon> showPokemon(@RequestParam(required = false) String type) {

        if (type == null || type.equalsIgnoreCase("all")) {
            return service.getAllPokemon();
        } else {
            return service.getPokemonByType(type);
        }
    }
}