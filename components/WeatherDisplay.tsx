import React from 'react';
import { WeatherData } from '../types';
import { getWeatherDescription } from '../services/weatherService';

interface WeatherDisplayProps {
  data: WeatherData;
}

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ data }) => {
  const description = getWeatherDescription(data.weatherCode);

  return (
    <div className="text-center py-8 animate-fade-in-up">
      <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight mb-2 drop-shadow-lg">
        {data.locationName}
      </h2>
      <p className="text-lg text-gray-300 font-light mb-8 uppercase tracking-widest text-sm">
        {description}
      </p>

      <div className="relative inline-block">
        <h1 className="text-8xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 drop-shadow-2xl">
          {Math.round(data.temperature)}°
        </h1>
      </div>

      <div className="flex justify-center gap-6 mt-8">
        <div className="glass-panel px-4 py-2 rounded-2xl flex flex-col items-center min-w-[80px]">
          <span className="material-icons-round text-blue-300 mb-1">water_drop</span>
          <span className="text-sm font-semibold">{data.humidity}%</span>
          <span className="text-[10px] text-gray-400 uppercase">Humidity</span>
        </div>
        <div className="glass-panel px-4 py-2 rounded-2xl flex flex-col items-center min-w-[80px]">
          <span className="material-icons-round text-gray-300 mb-1">air</span>
          <span className="text-sm font-semibold">{data.windSpeed}</span>
          <span className="text-[10px] text-gray-400 uppercase">km/h Wind</span>
        </div>
      </div>
    </div>
  );
};