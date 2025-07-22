import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const beforeAfterImages = [
  {
    id: 1,
    title: 'Profesyonel Halı Temizliği',
    before: '/gallery/before-after/before1.webp',
    after: '/gallery/before-after/after1.webp',
    description: 'Alanında uzman ekibimiz ile profesyonel temizlik sonrası ilk günkü haline döndü'
  },
  {
    id: 2,
    title: 'Derin Temizlik Sonuçları',
    before: '/gallery/before-after/before2.webp',
    after: '/gallery/before-after/after2.webp',
    description: 'Zorlu lekeler ve derin kirlilik profesyonel yöntemlerle tamamen giderildi'
  }
];

const BeforeAfterSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % beforeAfterImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + beforeAfterImages.length) % beforeAfterImages.length);
  };

  const currentImage = beforeAfterImages[currentSlide];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-primary-600">İnanılmaz</span> Dönüşümler
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Profesyonel temizlik hizmetlerimizin ortaya çıkardığı etkileyici sonuçları keşfedin.
            Fark gözle görülür derecede ortada.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Before/After Slider */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white select-none">
              {/* Image Container */}
              <div className="relative h-96 overflow-hidden select-none">
                {/* Before Image */}
                <img
                  src={currentImage.before}
                  alt={`${currentImage.title} - Öncesi`}
                  className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  style={{
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none',
                    WebkitUserDrag: 'none',
                    KhtmlUserDrag: 'none',
                    MozUserDrag: 'none',
                    OUserDrag: 'none'
                  }}
                />
                {/* After Image with Clip Path */}
                <img
                  src={currentImage.after}
                  alt={`${currentImage.title} - Sonrası`}
                  className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  style={{
                    clipPath: `polygon(${sliderPosition}% 0%, 100% 0%, 100% 100%, ${sliderPosition}% 100%)`,
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none',
                    WebkitUserDrag: 'none',
                    KhtmlUserDrag: 'none',
                    MozUserDrag: 'none',
                    OUserDrag: 'none'
                  }}
                />
                
                {/* Slider Handle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize flex items-center justify-center select-none"
                  style={{ left: `${sliderPosition}%` }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const container = e.currentTarget.parentElement;
                    const handleMouseMove = (e: MouseEvent) => {
                      if (container) {
                        const rect = container.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
                        setSliderPosition(percentage);
                      }
                    };
                    
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };
                    
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    const container = e.currentTarget.parentElement;
                    const handleTouchMove = (e: TouchEvent) => {
                      if (container && e.touches[0]) {
                        const rect = container.getBoundingClientRect();
                        const x = e.touches[0].clientX - rect.left;
                        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
                        setSliderPosition(percentage);
                      }
                    };
                    
                    const handleTouchEnd = () => {
                      document.removeEventListener('touchmove', handleTouchMove);
                      document.removeEventListener('touchend', handleTouchEnd);
                    };
                    
                    document.addEventListener('touchmove', handleTouchMove);
                    document.addEventListener('touchend', handleTouchEnd);
                  }}
                >
                  <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center select-none">
                    <div className="w-1 h-4 bg-gray-400 rounded mr-0.5" />
                    <div className="w-1 h-4 bg-gray-400 rounded" />
                  </div>
                </div>

                {/* Before/After Labels */}
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium select-none pointer-events-none">
                  Öncesi
                </div>
                <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium select-none pointer-events-none">
                  Sonrası
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 select-none"
                style={{ userSelect: 'none' }}
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 select-none"
                style={{ userSelect: 'none' }}
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {beforeAfterImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 select-none ${
                    index === currentSlide ? 'bg-primary-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  style={{ userSelect: 'none' }}
                />
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {currentImage.title}
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                {currentImage.description}
              </p>
            </div>

            {/* Results Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-primary-50 p-6 rounded-xl">
                <div className="text-2xl font-bold text-primary-600 mb-2">%99</div>
                <div className="text-sm text-gray-700">Leke Çıkarma Başarısı</div>
              </div>
              <div className="bg-green-50 p-6 rounded-xl">
                <div className="text-2xl font-bold text-green-600 mb-2">3g</div>
                <div className="text-sm text-gray-700">Hızlı Kuruma Süresi</div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-gray-900">Farkı yaratan özellikler:</h4>
              <ul className="space-y-3">
                {[
                  'Uzman Kimyager Desteği',
                  'Dokuma Dostu Temizlik',
                  'Yıpratmadan Hijyen Sağlayan Teknoloji',
                  'Tüm işlerde memnuniyet garantisi'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;