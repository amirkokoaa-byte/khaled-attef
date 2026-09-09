/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { AboutMe } from './components/AboutMe';
import { Footer } from './components/Footer';
import { Navigation } from './components/Navigation';
import { PortfolioSection } from './components/PortfolioSection';
import { StudioSection } from './components/StudioSection';
import { ExhibitionSection } from './components/ExhibitionSection';
import { AdminAuth } from './components/AdminAuth';
import { useLocalStorage } from './hooks/useLocalStorage';
import { defaultPortfolioData, PortfolioData, MediaItem, ExhibitionItem } from './types';

export default function App() {
  const [data, setData] = useLocalStorage<PortfolioData>('portfolio-data-v1', defaultPortfolioData);
  const [activeTab, setActiveTab] = useState('portfolio');
  const [selectedCountry, setSelectedCountry] = useState('الكل');
  const [isAdmin, setIsAdmin] = useState(false);

  // Extract unique countries from the gallery AND exhibitions
  const countries = useMemo(() => {
    const uniqueCountries = new Set<string>();
    data.gallery.forEach(item => uniqueCountries.add(item.country));
    data.exhibitions.forEach(ex => uniqueCountries.add(ex.country));
    return Array.from(uniqueCountries);
  }, [data.gallery, data.exhibitions]);

  const handleAddGalleryItem = (item: MediaItem) => {
    setData({
      ...data,
      gallery: [item, ...data.gallery]
    });
  };

  const handleAddStudioItem = (item: MediaItem) => {
    setData({
      ...data,
      studio: [item, ...data.studio]
    });
  };

  const handleAddExhibition = (item: ExhibitionItem) => {
    setData({
      ...data,
      exhibitions: [item, ...data.exhibitions]
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <AdminAuth isAdmin={isAdmin} setIsAdmin={setIsAdmin} />

      <Header 
        bannerImage={data.bannerImage}
        profileImage={data.profileImage}
      />
      
      <main className="flex-grow flex flex-col items-center w-full">
        <AboutMe data={data.aboutMe} />
        
        {/* Navigation / Filter */}
        <div className="w-full mt-12 mb-6">
          <Navigation 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            countries={countries}
          />
        </div>

        {/* Dynamic Main Content based on Active Tab */}
        <div className="w-full min-h-[500px]">
          {activeTab === 'portfolio' && (
            <PortfolioSection 
              gallery={data.gallery} 
              selectedCountry={selectedCountry} 
              isAdmin={isAdmin}
              onAddMedia={handleAddGalleryItem}
              uniqueCountries={countries}
            />
          )}

          {activeTab === 'studio' && (
            <StudioSection
              studio={data.studio}
              isAdmin={isAdmin}
              onAddMedia={handleAddStudioItem}
              uniqueCountries={countries}
            />
          )}

          {activeTab === 'exhibitions' && (
            <ExhibitionSection
              exhibitions={data.exhibitions}
              selectedCountry={selectedCountry}
              isAdmin={isAdmin}
              onAddExhibition={handleAddExhibition}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
