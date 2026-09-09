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
import { ReviewsSection } from "./components/ReviewsSection";
import { useLocalStorage } from './hooks/useLocalStorage';
import { defaultPortfolioData, PortfolioData, MediaItem, ExhibitionItem } from './types';
import { db, saveToFirebase } from './lib/firebase';
import { doc, getDoc, updateDoc, increment, onSnapshot } from 'firebase/firestore';
import { AppProvider, useAppContext } from './context';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

function MainApp() {
  const { lang, setLang } = useAppContext();
  const [data, setData] = useLocalStorage<PortfolioData>('portfolio-data-v1', defaultPortfolioData);
  const [activeTab, setActiveTab] = useState('portfolio');
  const [selectedCountry, setSelectedCountry] = useState('الكل');
  const [isAdmin, setIsAdmin] = useState(false);

  // Real-time Fetch & Visitor Tracking
  useEffect(() => {
    if (!db) return; 

    // Increment visitor count once per session
    const incrementVisitor = async () => {
      const hasVisited = sessionStorage.getItem('hasVisited_v1');
      if (!hasVisited && !isAdmin) {
        try {
          const docRef = doc(db, 'siteData', 'portfolio-data-v1');
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            await updateDoc(docRef, {
              visitorCount: increment(1)
            });
            sessionStorage.setItem('hasVisited_v1', 'true');
          }
        } catch (err: any) {
          if (err.message?.includes('offline')) {
            console.warn("Firebase is offline. Visitor count not updated.");
          } else {
            console.error("Could not increment visitor count:", err);
          }
        }
      }
    };
    
    incrementVisitor();

    // Listen to real-time changes
    const docRef = doc(db, 'siteData', 'portfolio-data-v1');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setData(docSnap.data() as PortfolioData);
      }
    });

    return () => unsubscribe();
  }, [isAdmin, setData]);

  // Extract unique countries
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

  const handleUpdateAboutMe = (aboutMe: PortfolioData['aboutMe']) => updateDataAndSync({ ...data, aboutMe });
  const handleUpdateProfile = (url: string) => updateDataAndSync({ ...data, profileImage: url });
  const handleUpdateBanners = (urls: string[]) => updateDataAndSync({ ...data, bannerImages: urls });
  const handleEditGalleryItem = (updatedItem: MediaItem) => updateDataAndSync({ ...data, gallery: data.gallery.map(item => item.id === updatedItem.id ? updatedItem : item) });
  const handleDeleteGalleryItem = (id: string) => updateDataAndSync({ ...data, gallery: data.gallery.filter(item => item.id !== id) });
  const handleAddGalleryItem = (item: MediaItem) => updateDataAndSync({ ...data, gallery: [item, ...data.gallery] });
  const handleAddStudioItem = (item: MediaItem) => updateDataAndSync({ ...data, studio: [item, ...data.studio] });
  const handleAddExhibition = (item: ExhibitionItem) => updateDataAndSync({ ...data, exhibitions: [item, ...data.exhibitions] });

  // Add fake base visitor count to actual
  const displayVisitorCount = (data.visitorCount || 0) + (data.baseVisitorCount || 0);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-900 text-slate-100 transition-colors duration-500">
      
      {/* Absolute top-left lang switch */}
      <div className="absolute top-4 left-4 md:left-6 z-50">
        <button 
          onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
          className="magnetic p-2 bg-slate-800/90 hover:bg-slate-700 text-white rounded-full shadow-lg backdrop-blur-sm transition-all flex items-center justify-center font-bold text-xs w-10 h-10 border border-slate-700"
        >
          {lang === 'ar' ? 'EN' : 'عربي'}
        </button>
      </div>

      <AdminAuth 
        isAdmin={isAdmin} 
        setIsAdmin={setIsAdmin} 
        data={data}
        onUpdateData={updateDataAndSync}
      />

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

        {/* Dynamic Main Content */}
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

      <ReviewsSection />
      <Footer visitorCount={displayVisitorCount} />

      {/* Floating WhatsApp */}
      <FloatingWhatsApp phoneNumber={data.aboutMe.whatsappNumber || data.aboutMe.phoneNumbers[0]} />
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
