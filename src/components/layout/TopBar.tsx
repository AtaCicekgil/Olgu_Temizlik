import React from 'react';
import { Phone, Clock, MapPin } from 'lucide-react';

const TopBar: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white py-2 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          {/* Left side - Primary phone number */}
          <div className="flex items-center space-x-2">
            <a
              href="tel:+903123509595"
              className="flex items-center space-x-2 text-white font-semibold hover:text-yellow-300 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>(0312) 350 95 95</span>
            </a>
            <span className="text-gray-400">|</span>
            <a
              href="tel:+905332002662"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>(0533) 200 26 62</span>
            </a>
          </div>

          {/* Right side - Business hours and service area */}
          <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-6 text-gray-300">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>08:00 – 21:30</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Çankaya</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;