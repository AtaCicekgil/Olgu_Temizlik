import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Star, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/logo.webp"
                alt="Olgu Temizlik Logo"
                className="h-10 w-10 object-contain"
              />
              <span className="text-xl font-bold">Olgu Temizlik</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              15 yılı aşkın deneyime sahip profesyonel temizlik hizmetleri. 
              Mükemmel sonuçlar ve müşteri memnuniyeti konusunda kendimizi kanıtladık.
            </p>
            <div className="flex items-center space-x-1 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
              <span className="text-gray-300 text-sm ml-2">4.9/5 (500+ değerlendirme)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              {[
                { name: 'Ana Sayfa', href: '/' },
                { name: 'Hizmetler', href: '/hizmetler' },
                { name: 'Galeri', href: '/galeri' },
                { name: 'Hakkımızda', href: '/hakkimizda' },
                { name: 'Online Rezervasyon', href: '/rezervasyon' },
                { name: 'Müşteri Paneli', href: '/panel' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hizmetlerimiz</h3>
            <ul className="space-y-2">
              {[
                { name: 'Halı Yıkama', href: '/hizmetler/hali-yikama' },
                { name: 'Koltuk Yıkama', href: '/hizmetler/koltuk-yikama' },
                { name: 'Stor ve Perde Yıkama', href: '/hizmetler/perde-temizligi' },
                { name: 'Özel Hizmetler', href: '/hizmetler/ozel-hizmetler' },
                { name: 'Leke Çıkarma', href: '/hizmetler/ozel-hizmetler' },
                { name: 'Evcil Hayvan Koku Giderme', href: '/hizmetler/ozel-hizmetler' },
              ].map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">İletişim Bilgileri</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">7/24 Arayın</p>
                  <a 
                    href="tel:+903123509595"
                    className="text-gray-300 text-sm hover:text-white transition-colors"
                  >
                    (0312) 350 95 95
                  </a>
                  <br />
                  <a 
                    href="tel:+905332002662"
                    className="text-gray-300 text-sm hover:text-white transition-colors"
                  >
                    (0533) 200 26 62
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">E-posta</p>
                  <a 
                    href="mailto:olguhaliyikama@gmail.com"
                    className="text-gray-300 text-sm hover:text-white transition-colors"
                  >
                    olguhaliyikama@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Hizmet Alanı</p>
                  <p className="text-gray-300 text-sm">Çankaya</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Çalışma Saatleri</p>
                  <p className="text-gray-300 text-sm">08:00 – 21:30</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 Olgu Temizlik. Tüm hakları saklıdır. | Lisanslı ve Sigortalı
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Bizi Takip Edin:</span>
              <div className="flex items-center space-x-3">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;