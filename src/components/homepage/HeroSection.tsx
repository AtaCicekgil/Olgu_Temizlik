import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Phone, Star, Shield, Clock, Award } from 'lucide-react';
import Button from '../common/Button';
import GoogleReviewsBackground from './GoogleReviewsBackground';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 scroll-container">
      {/* Google Reviews Background - Hidden on Mobile */}
      <div className="hidden lg:block">
        <GoogleReviewsBackground />
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-optimized" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-20 layout-optimized">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8 motion-container"
          >
            {/* Trust Badges */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-medium text-gray-700">4.9/5 Puan</span>
              </div>
              <div className="flex items-center space-x-1 text-green-600">
                <Shield className="w-4 h-4" />
                <span className="font-medium text-gray-700">Garantili</span>
              </div>
              <div className="flex items-center space-x-1 text-blue-600">
                <Award className="w-4 h-4" />
                <span className="font-medium text-gray-700">15+ Yıl Deneyim</span>
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight text-optimized">
                Profesyonel
                <span className="text-primary-600"> Temizlik</span>
                <br />
                <span className="text-secondary-600">Hizmetleri</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg text-optimized">
                Profesyonel halı, koltuk ve perde temizliği ile hijyeni garantiliyor, her kumaşa özel yöntemlerle derinlemesine temizlik sağlıyoruz. Hızlı servis, çevre dostu ürünler ve müşteri memnuniyetine dayalı hizmet anlayışımızla yanınızdayız.
              </p>
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary-600" />
                </div>
                <span className="text-gray-700 font-medium">Aynı Gün Hizmet</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-gray-700 font-medium">%100 Garanti</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/rezervasyon">
                <Button size="lg" className="w-full sm:w-auto shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 will-change-transform">
                  <Calendar className="w-5 h-5 mr-2" />
                  Online Rezervasyon
                </Button>
              </Link>
              <a href="tel:+903123509595">
                <Button variant="outline" size="lg" className="w-full sm:w-auto transition-all duration-200">
                  <Phone className="w-5 h-5 mr-2" />
                  Ara (0312) 350 95 95
                </Button>
              </a>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">15+</div>
                <div className="text-sm text-gray-600">Yıl Deneyim</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">5K+</div>
                <div className="text-sm text-gray-600">Mutlu Müşteri</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">7/24</div>
                <div className="text-sm text-gray-600">Destek</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
            className="relative motion-container"
          >
            <div className="relative">
              {/* Main Image - Professional Carpet Cleaning Machine */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl critical-resource">
                <img
                  src="/gallery/hali-yikama/haliyikama.webp"
                  alt="Profesyonel halı temizlik makinesi"
                  className="w-full h-96 lg:h-[500px] object-cover"
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
                  style={{
                    aspectRatio: '4/5',
                    objectFit: 'cover',
                    willChange: 'auto'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                
                {/* Professional Equipment Badge - Hidden on Mobile */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 hidden sm:block">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-gray-900">Endüstriyel Ekipman</span>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg p-4 hidden sm:block will-change-transform"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Çevre Dostu</div>
                    <div className="text-sm text-gray-600">Evcil hayvan güvenli</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 hidden sm:block will-change-transform"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-500 fill-current" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">4.9 Puan</div>
                    <div className="text-sm text-gray-600">500+ değerlendirme</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 will-change-transform"
      >
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-300 rounded-full mt-2 animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;