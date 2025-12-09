import React, { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { WeatherDisplay } from './components/WeatherDisplay';
import { InsightCard } from './components/InsightCard';
import { GeoLocation, WeatherData, AIStyleAdvice, LoadingState } from './types';
import { getWeatherData } from './services/weatherService';
import { generateStyleAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [aiData, setAiData] = useState<AIStyleAdvice | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initial load - try to get user location or default to New York
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    handleLocationSelect({ name: "New York", latitude: 40.71, longitude: -74.01, country: "USA" });
  }, []);

  const handleLocationSelect = async (loc: GeoLocation) => {
    setErrorMsg(null);
    setLoadingState(LoadingState.LOADING_WEATHER);
    setWeatherData(null);
    setAiData(null);

    try {
      // 1. Fetch Weather
      const weather = await getWeatherData(loc.latitude, loc.longitude, loc.name);
      setWeatherData(weather);

      // 2. Fetch AI Advice
      setLoadingState(LoadingState.GENERATING_AI);
      const advice = await generateStyleAdvice(weather);
      setAiData(advice);
      
      setLoadingState(LoadingState.SUCCESS);
    } catch (err) {
      console.error(err);
      setLoadingState(LoadingState.ERROR);
      setErrorMsg("Failed to connect to the sky. Please try again.");
    }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser");
      return;
    }

    setLoadingState(LoadingState.LOADING_LOCATION);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // We need a name for the coords. We'll let the weather fetch happen, 
        // but for the name we might just use "Current Location" if we don't reverse geocode.
        // For simplicity in this spec, we pass a generic name, or could add reverse geocoding in service.
        handleLocationSelect({
          name: "Current Location",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      () => {
        setLoadingState(LoadingState.ERROR);
        setErrorMsg("Unable to retrieve your location");
      }
    );
  };

  const isLoading = loadingState !== LoadingState.IDLE && loadingState !== LoadingState.SUCCESS && loadingState !== LoadingState.ERROR;

  return (
    <div className="min-h-screen w-full relative overflow-hidden transition-colors duration-1000">
      {/* Dynamic Background Gradient based on Vibe if available, else default dark */}
      <div 
        className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-slate-800 to-black transition-all duration-1000"
        style={aiData ? {
          background: `radial-gradient(circle at 50% 0%, ${aiData.colorPalette[0]}40 0%, transparent 60%), 
                       radial-gradient(circle at 0% 100%, ${aiData.colorPalette[1]}20 0%, transparent 50%),
                       #0f172a`
        } : {}}
      />

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl flex flex-col min-h-screen">
        
        {/* Header / Search */}
        <header className="flex flex-col items-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <h1 className="text-xl font-bold tracking-widest uppercase">VibeCast</h1>
          </div>
          
          <div className="w-full flex gap-2 justify-center max-w-md">
             <SearchBar onLocationSelect={handleLocationSelect} disabled={isLoading} />
             <button 
               onClick={handleGeolocation}
               disabled={isLoading}
               className="glass-panel p-3 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
               title="Use Current Location"
             >
               <span className="material-icons-round text-white">my_location</span>
             </button>
          </div>

          {errorMsg && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg text-sm">
              {errorMsg}
            </div>
          )}
        </header>

        {/* Main Content Area */}
        <main className="flex-grow flex flex-col items-center justify-center">
          
          {loadingState === LoadingState.LOADING_LOCATION && (
             <div className="text-center animate-pulse">
               <p className="text-xl font-light">Locating you...</p>
             </div>
          )}

          {loadingState === LoadingState.LOADING_WEATHER && (
            <div className="text-center animate-pulse">
               <p className="text-xl font-light">Reading the clouds...</p>
            </div>
          )}
          
          {loadingState === LoadingState.GENERATING_AI && weatherData && (
             <div className="w-full max-w-md">
                <WeatherDisplay data={weatherData} />
                <div className="mt-8 flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-purple-200 font-medium animate-pulse">Consulting the AI Stylist...</p>
                </div>
             </div>
          )}

          {loadingState === LoadingState.SUCCESS && weatherData && aiData && (
            <div className="w-full animate-[fadeIn_0.8s_ease-out]">
              <WeatherDisplay data={weatherData} />
              
              <div className="mt-4 text-center mb-12">
                <div className="inline-flex items-center gap-2 glass-panel px-6 py-2 rounded-full border-purple-500/30">
                  <span className="text-2xl">{aiData.emoji}</span>
                  <span className="text-lg italic font-serif text-purple-100">"{aiData.vibeDescription}"</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <InsightCard 
                  title="Fit Check" 
                  content={aiData.outfitSuggestion} 
                  icon="checkroom" 
                  delay="0.1s"
                />
                <InsightCard 
                  title="The Move" 
                  content={aiData.activityRecommendation} 
                  icon="local_activity" 
                  delay="0.2s"
                />
              </div>

              {/* Color Palette Strip */}
              <div className="mt-8 flex justify-center gap-4 opacity-80">
                {aiData.colorPalette.map((color, idx) => (
                  <div 
                    key={idx} 
                    className="w-12 h-12 rounded-full shadow-lg border border-white/10"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </main>

        <footer className="mt-12 text-center text-xs text-gray-500">
          <p>Powered by Open-Meteo & Gemini 2.5 Flash</p>
        </footer>
      </div>
    </div>
  );
};

export default App;