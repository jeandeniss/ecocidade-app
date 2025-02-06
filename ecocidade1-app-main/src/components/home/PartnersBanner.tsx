import React from 'react';
import { HandshakeIcon } from 'lucide-react';

const partners = [
  {
    name: 'Cona',
    logo: '/src/assets/images/partners/empresa_austrica.jpeg'
  },
  {
    name: 'Ikoula',
    logo: '/src/assets/images/partners/empresa_ikoula_temp.jpg'
  },
  {
    name: 'Gazelle Tech',
    logo: '/src/assets/images/partners/empresa_gazelle_tech_temp.gif'
  },
  {
    name: 'Greenweez',
    logo: '/src/assets/images/partners/empresa_greenweez_temp.png'
  },
  {
    name: 'lafabriquedescastors',
    logo: '/src/assets/images/partners/empresa_lafabriquedescastors_temp.png'
  }
];

export const PartnersBanner: React.FC = () => {
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-2 mb-8">
          <HandshakeIcon className="h-6 w-6 text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-800">Nossos Parceiros</h2>
        </div>
        
        <div className="relative overflow-hidden">
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10"></div>
          
          {/* Scrolling container */}
          <div className="flex space-x-8 animate-scroll">
            {/* First set of partners */}
            {partners.map((partner, index) => (
              <div
                key={`partner-1-${index}`}
                className="flex-none w-40 h-20 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center p-4 hover:shadow-md transition-shadow duration-300"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
            {/* Duplicate set for seamless scrolling */}
            {partners.map((partner, index) => (
              <div
                key={`partner-2-${index}`}
                className="flex-none w-40 h-20 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center p-4 hover:shadow-md transition-shadow duration-300"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};