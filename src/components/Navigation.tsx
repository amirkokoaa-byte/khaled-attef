import { useState } from 'react';
import { useAppContext } from '../context';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  countries: string[];
}

export function Navigation({ activeTab, setActiveTab, selectedCountry, setSelectedCountry, countries }: NavigationProps) {
  const { t } = useAppContext();
  
  const tabs = [
    { id: 'portfolio', label: t('سابقة الأعمال', 'Portfolio') },
    { id: 'studio', label: t('الاستوديو', 'Studio') },
    { id: 'exhibitions', label: t('المعارض', 'Exhibitions') },
  ];

  return (
    <nav className="w-full bg-white text-slate-900 border-y border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center py-3 gap-4">
        {/* Horizontal Menu */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center w-full md:w-auto gap-3">
          <label htmlFor="country-filter" className="text-sm font-medium text-slate-500 whitespace-nowrap">{t('التصفية:', 'Filter:')}</label>
          <select
            id="country-filter"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full md:w-48 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none cursor-pointer"
          >
            <option value="الكل">{t('الكل', 'All')}</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
      </div>
    </nav>
  );
}
