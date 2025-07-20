import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';
import Button from '../components/common/Button';

const Services: React.FC = () => {
  const { services } = useBooking();

  // Updated service images with new file names
  const serviceImages = {
    'hali-yikama': '/gallery/hali-yikama/haliyikama.webp',
    'koltuk-yikama': '/gallery/koltuk-yikama/koltukyikama.webp',
    'perde-temizligi': '/gallery/perde-temizligi/storyikama.webp',
    'ozel-hizmetler': '/gallery/ozel-hizmetler/lekecikarma.webp',
    'yorgan-battaniye': '/gallery/yorgan-yikama/yorganyikama.webp',
    'yatak-temizligi': '/gallery/yatak-yikama/yatakyikama.webp',
    'yerinde-hali-yikama': '/gallery/yerinde-yikama/yerindeyikama.webp',
    'ofis-temizligi': '/gallery/ofis-temizligi/ofistemizligi.webp'
  };

  // Fallback images in case local images don't load
  const fallbackImages = {
    'hali-yikama': 'https://images.pexels.com/photos/6197628/pexels-photo-6197628.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'koltuk-yikama': 'https://images.pexels.com/photos/6197113/pexels-photo-6197113.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'perde-temizligi': 'https://images.pexels.com/photos/6782370/pexels-photo-6782370.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'ozel-hizmetler': 'https://images.pexels.com/photos/6197119/pexels-photo-6197119.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'yorgan-battaniye': 'https://images.pexels.com/photos/6197628/pexels-photo-6197628.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'yatak-temizligi': 'https://images.pexels.com/photos/6197113/pexels-photo-6197113.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'yerinde-hali-yikama': 'https://images.pexels.com/photos/6782370/pexels-photo-6782370.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'ofis-temizligi': 'https://images.pexels.com/photos/6197119/pexels-photo-6197119.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, serviceId: string) => {
    const target = e.target as HTMLImageElement;
    target.src = fallbackImages[serviceId as keyof typeof fallbackImages];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Profesyonel Hizmetlerimiz
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              Eviniz ve işyeriniz için kapsamlı temizlik çözümleri. 
              Halı, Koltuk, perde ve daha fazlası için uzman bakım.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={serviceImages[service.id as keyof typeof serviceImages]}
                    alt={service.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    style={{
                      aspectRatio: '3/2',
                      objectFit: 'cover'
                    }}
                    onError={(e) => handleImageError(e, service.id)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {service.name}
                      </h3>
                    </div>
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="ml-1 text-gray-700 font-medium">4.9</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Dahil Olanlar:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-primary-500 rounded-full mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link to={`/hizmetler/${service.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Daha Fazla Bilgi
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <Link to="/rezervasyon" state={{ selectedService: service.id }} className="flex-1">
                      <Button className="w-full">
                        Rezervasyon Yap
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;