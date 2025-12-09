// Weather Service Types
export interface GeoLocation {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
}

export interface WeatherData {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
  isDay: boolean;
  locationName: string;
}

// Gemini Service Types
export interface AIStyleAdvice {
  vibeDescription: string;
  outfitSuggestion: string;
  activityRecommendation: string;
  colorPalette: string[]; // Hex codes
  emoji: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING_LOCATION = 'LOADING_LOCATION',
  LOADING_WEATHER = 'LOADING_WEATHER',
  GENERATING_AI = 'GENERATING_AI',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}