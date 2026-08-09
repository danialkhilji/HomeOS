import apiClient from "./client";
import type { Weather } from "../types";

export async function fetchWeather(): Promise<Weather> {
  const response = await apiClient.get<Weather>("/weather");
  return response.data;
}
