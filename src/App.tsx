/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
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
import { db, saveToFirebase } from './lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { AppProvider, useAppContext } from './context';
import { Moon, Sun, Globe } from 'lucide-react';

function TopBar() {
  const { lang, setLang, theme, setTheme } = useAppContext();

  return (
    <div className="absolute top-4 left-16 md:left-20 z-50 flex gap-2">
      <button 
        onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        className="p-2 bg-white/90 hover:bg-white text-slate-700 rounded-full shadow-lg backdrop-blur-sm transition-transform hover:scale-110 flex items-center justify-center font-bold text-xs w-9 h-9"
        title="تغيير اللغة"
      >
        {lang === 'ar' ? 'EN' : 'عربي'}
      </button>
      <button 
        onClick={() => setTheme(theme === 'default' ? 'navy' : 'default')}
        className="p-2 bg-white/90 hover:bg-white text-slate-700 rounded-full shadow-lg backdrop-blur-sm transition-transform hover:scale-110 flex items-center justify-center w-9 h-9"
        title="تغيير المظهر"
      >
        {theme === 'default' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-500" />}
      </button>
    </div>
  );
}

function MainApp() {
  const { theme } = useAppContext();
  const [data, setData] = useLocalStorage<PortfolioData>('portfolio-data-v1', defaultPortfolioData);
  const [activeTab, setActiveTab] = useState('portfolio');
  const [selectedCountry, setSelectedCountry] = useState('الكل');
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch data from Firebase on mount (stale-while-revalidate pattern)
  useEffect(() => {
    const fetchData = async () => {
      if (!db) return; 
      try {
        const docRef = doc(db, 'siteData', 'portfolio-data-v1');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const firebaseData = docSnap.data() as PortfolioData;
          setData(firebaseData);
        }
      } catch (error: any) {
        if (error.message?.includes('offline')) {
          console.warn("Firebase is offline or unavailable. Using local storage.");
        } else {
          console.error("Error fetching data from Firebase:", error);
        }
      }
    };
    fetchData();
  }, [setData]);

  // Extract unique countries from the gallery AND exhibitions
  const countries = useMemo(() => {
    const uniqueCountries = new Set<string>();
    data.gallery.forEach(item => uniqueCountries.add(item.country));
    data.exhibitions.forEach(ex => uniqueCountries.add(ex.country));
    return Array.from(uniqueCountries);
  }, [data.gallery, data.exhibitions]);

  const updateDataAndSync = (newData: PortfolioData) => {
    setData(newData);
    saveToFirebase('siteData', 'portfolio-data-v1', newData); 
  };

  // --- Callbacks for Edits ---
  
  const handleUpdateAboutMe = (aboutMe: PortfolioData['aboutMe']) => {
    updateDataAndSync({ ...data, aboutMe });
  };

  const handleUpdateProfile = (url: string) => {
    updateDataAndSync({ ...data, profileImage: url });
  };

  const handleUpdateBanners = (urls: string[]) => {
    updateDataAndSync({ ...data, bannerImages: urls });
  };

  const handleEditGalleryItem = (updatedItem: MediaItem) => {
    updateDataAndSync({
      ...data,
      gallery: data.gallery.map(item => item.id === updatedItem.id ? updatedItem : item)
    });
  };

  const handleDeleteGalleryItem = (id: string) => {
    updateDataAndSync({
      ...data,
      gallery: data.gallery.filter(item => item.id !== id)
    });
  };

  const handleAddGalleryItem = (item: MediaItem) => {
    updateDataAndSync({ ...data, gallery: [item, ...data.gallery] });
  };

  const handleAddStudioItem = (item: MediaItem) => {
    updateDataAndSync({ ...data, studio: [item, ...data.studio] });
  };

  const handleAddExhibition = (item: ExhibitionItem) => {
    updateDataAndSync({ ...data, exhibitions: [item, ...data.exhibitions] });
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${theme === 'navy' ? 'bg-gray-100 text-slate-900' : 'bg-slate-50 text-slate-800'}`}>
      <AdminAuth isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      <TopBar />

      <Header 
        bannerImages={data.bannerImages || [data.bannerImage]}
        profileImage={data.profileImage}
        isAdmin={isAdmin}
        onUpdateBanners={handleUpdateBanners}
        onUpdateProfile={handleUpdateProfile}
      />
      
      <main className="flex-grow flex flex-col items-center w-full">
        <AboutMe 
          data={data.aboutMe} 
          isAdmin={isAdmin}
          onUpdate={handleUpdateAboutMe}
        />
        
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
              onEditMedia={handleEditGalleryItem}
              onDeleteMedia={handleDeleteGalleryItem}
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

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
