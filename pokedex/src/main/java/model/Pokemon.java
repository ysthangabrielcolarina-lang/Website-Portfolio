package com.pokedex.pokedex.model;

public class Pokemon {

    private int id;
    private String name;
    private String type;
    private String description;
    private double height; // in meters
    private double weight; // in kg

    public Pokemon() {}

    public Pokemon(int id, String name, String type, String description, double height, double weight) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.description = description;
        this.height = height;
        this.weight = weight;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getHeight() { return height; }
    public void setHeight(double height) { this.height = height; }

    public double getWeight() { return weight; }
    public void setWeight(double weight) { this.weight = weight; }
}