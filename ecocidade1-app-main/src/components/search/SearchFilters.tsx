import React from 'react';
import { Sliders } from 'lucide-react';

interface SearchFiltersProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sustainabilityScore: number;
  setSustainabilityScore: (score: number) => void;
  selectedCertifications: string[];
  setSelectedCertifications: (certs: string[]) => void;
}

const certifications = [
  'Orgânico',
  'Comércio Justo',
  'Vegano',
  'Reciclável',
  'Biodegradável',
];

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  priceRange,
  setPriceRange,
  sustainabilityScore,
  setSustainabilityScore,
  selectedCertifications,
  setSelectedCertifications,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Sliders className="h-5 w-5 text-emerald-600" />
        <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Faixa de Preço</h4>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="w-24 px-3 py-1 border rounded-md"
              placeholder="Min"
            />
            <span className="text-gray-500">até</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-24 px-3 py-1 border rounded-md"
              placeholder="Max"
            />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Pontuação de Sustentabilidade (min)
          </h4>
          <input
            type="range"
            min="0"
            max="10"
            value={sustainabilityScore}
            onChange={(e) => setSustainabilityScore(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>0</span>
            <span>{sustainabilityScore}</span>
            <span>10</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Certificações</h4>
          <div className="space-y-2">
            {certifications.map((cert) => (
              <label key={cert} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedCertifications.includes(cert)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCertifications([...selectedCertifications, cert]);
                    } else {
                      setSelectedCertifications(
                        selectedCertifications.filter((c) => c !== cert)
                      );
                    }
                  }}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">{cert}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};