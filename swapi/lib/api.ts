import type { ApiResponse, Person, Planet, Starship } from "./types"

const BASE_URL = "https://swapi.dev/api"

export async function fetchPeople(page = 1): Promise<ApiResponse<Person>> {
  const response = await fetch(`${BASE_URL}/people/?page=${page}`)
  if (!response.ok) {
    throw new Error("Failed to fetch people")
  }
  return response.json()
}

export async function fetchPerson(id: string): Promise<Person> {
  const response = await fetch(`${BASE_URL}/people/${id}/`)
  if (!response.ok) {
    throw new Error("Failed to fetch person")
  }
  return response.json()
}

export async function fetchPlanets(page = 1): Promise<ApiResponse<Planet>> {
  const response = await fetch(`${BASE_URL}/planets/?page=${page}`)
  if (!response.ok) {
    throw new Error("Failed to fetch planets")
  }
  return response.json()
}

export async function fetchPlanet(id: string): Promise<Planet> {
  const response = await fetch(`${BASE_URL}/planets/${id}/`)
  if (!response.ok) {
    throw new Error("Failed to fetch planet")
  }
  return response.json()
}

export async function fetchStarships(page = 1): Promise<ApiResponse<Starship>> {
  const response = await fetch(`${BASE_URL}/starships/?page=${page}`)
  if (!response.ok) {
    throw new Error("Failed to fetch starships")
  }
  return response.json()
}

export async function fetchStarship(id: string): Promise<Starship> {
  const response = await fetch(`${BASE_URL}/starships/${id}/`)
  if (!response.ok) {
    throw new Error("Failed to fetch starship")
  }
  return response.json()
}

export function extractIdFromUrl(url: string): string {
  const matches = url.match(/\/(\d+)\/$/)
  return matches ? matches[1] : ""
}

