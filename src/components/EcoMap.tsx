"use client";

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { EcoStore, StoreCategory, storeCategories, ecoStores } from '@/lib/mapData';
import 'leaflet/dist/leaflet.css';

const defaultIcon = new Icon({
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export default function EcoMap() {
  const [selectedCategory, setSelectedCategory] = useState<StoreCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStores, setFilteredStores] = useState<EcoStore[]>(ecoStores);

  useEffect(() => {
    const filtered = ecoStores.filter(store => {
      const matchesCategory = selectedCategory === 'all' || store.category === selectedCategory;
      const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          store.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    setFilteredStores(filtered);
  }, [selectedCategory, searchQuery]);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 bg-[#2E8B57]">
        <h2 className="text-white text-lg font-semibold">Eco-Friendly Stores</h2>
        <p className="text-white/80 text-sm">Find sustainable stores near you</p>
      </div>

      <div className="p-4 border-b">
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Search stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#2E8B57]"
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as StoreCategory | 'all')}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#2E8B57]"
          >
            <option value="all">All Categories</option>
            {Object.entries(storeCategories).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-[400px] relative">
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredStores.map((store) => (
            <Marker
              key={store.id}
              position={store.coordinates}
              icon={defaultIcon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">{store.name}</h3>
                  <p className="text-sm text-gray-600">{store.description}</p>
                  <div className="mt-2">
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 text-sm">{store.rating}</span>
                      <span className="ml-1 text-sm text-gray-500">
                        ({store.reviewCount} reviews)
                      </span>
                    </div>
                    <p className="text-sm mt-1">{store.address}</p>
                  </div>
                  <div className="mt-2">
                    <h4 className="font-semibold text-sm">Opening Hours</h4>
                    {Object.entries(store.openingHours).map(([days, hours]) => (
                      <p key={days} className="text-sm">
                        {days}: {hours}
                      </p>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="p-4 bg-gray-50">
        <h3 className="font-semibold mb-2">Found {filteredStores.length} stores</h3>
        <div className="space-y-4">
          {filteredStores.map((store) => (
            <div key={store.id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{store.name}</h4>
                  <p className="text-sm text-gray-600">{store.description}</p>
                </div>
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1">{store.rating}</span>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm">{store.address}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {store.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}