import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  date: string;
  rating: number;
  text: string;
  translatedText: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Ezgi',
    date: '18 Eyl',
    rating: 5,
    text: 'geçen gün güneşlik ve perdelerimi temizletmeye verdim ve mutfağımdaki perde yağ lekesi olmuştu ve perdem geldiğinde bembeyaz geldi inanılmazsınız sonuna kadar helal olsun 👏👏👏',
    translatedText: 'I gave my blinds and curtains to be cleaned the other day and the curtain in my kitchen was stained with oil and when my curtain came it came white.',
    image: '/comment/yorum02.jpg'
  },
  {
    id: 3,
    name: 'Gökhan Öztürk',
    date: '2 Şub',
    rating: 5,
    text: 'Perdelerimi ve halılarımı farklı zamanlarda verdim ikisinden de çok memnun kaldım. Ayrıca hızlı ve şeffaf bir işleyiş modeli var gidip halılarınızı yıkanırken görebilirsiniz.',
    translatedText: 'I gave my curtains and carpets at different times, I was very pleased with both. In addition, there is a fast and transparent working model and you can go and see your carpets while washing.',
    image: '/comment/yorum04.jpg'
  },
  {
    id: 4,
    name: 'Ceyhun Erciyes',
    date: '30 May',
    rating: 5,
    text: 'Profesyonelce tertemiz yaptılar işlerini.',
    translatedText: 'They did their job professionally and cleanly.',
    image: '/comment/yorum05.jpg'
  },
  {
    id: 5,
    name: 'Demet Özçelik',
    date: '2 Şub',
    rating: 4,
    text: 'Hızlı ve güzel geldi, emeğinize sağlık.',
    translatedText: 'It came fast and beautiful, thank you for your effort.',
    image: '/comment/yorum06.jpg'
  },
  {
    id: 6,
    name: 'Yaren Korkmaz',
    date: '11 Haz',
    rating: 5,
    text: 'Daha önce başka firmalarda yıkanan halılarımızda saçlar kalırdı, bu sefer öyle güzel yıkanmış ki hem çok temiz araları hem de saçlardan eser kalmamış. Çok beğendik 👏',
    translatedText: 'There used to be hair on our carpets that were washed in other companies before, this time it was washed so well that it was both very clean in between and there was no trace of hair left. We loved it 👏',
    image: '/comment/yorum07.jpg'
  }
];

const CustomerTestimonialsSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(new Set());

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  }, []);

  const handleImageError = useCallback((testimonialId: number) => {
    setImageLoadErrors(prev => new Set(prev).add(testimonialId));
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden intersection-target">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-optimized">
            <span className="text-primary-600">Müşteri</span> Yorumları
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-optimized">
            Gerçek müşterilerimizin deneyimlerini keşfedin. Google yorumlarından 
            alınan bu değerlendirmeler hizmet kalitemizi yansıtıyor.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Review Image Display */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative motion-container"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white">
              {/* Fixed container with consistent dimensions */}
              <div className="relative w-full h-80 md:h-96 bg-gray-100">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    src={currentTestimonial.image}
                    alt={`${currentTestimonial.name} yorumu`}
                    className="absolute inset-0 w-full h-full object-contain bg-white"
                    style={{
                      objectPosition: 'center',
                      willChange: 'auto'
                    }}
                    loading="lazy"
                    onError={() => handleImageError(currentTestimonial.id)}
                  />
                </AnimatePresence>
              </div>
              
              {/* Google Badge */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-sm flex items-center justify-center">
                    <span className="text-white text-xs font-bold">G</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Google Yorum</span>
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-10 will-change-transform"
                aria-label="Önceki yorum"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-10 will-change-transform"
                aria-label="Sonraki yorum"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center mt-6 space-x-2 flex-wrap gap-y-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 will-change-transform ${
                    index === currentIndex 
                      ? 'bg-primary-600 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`${index + 1}. yoruma git`}
                />
              ))}
            </div>
          </motion.div>

          {/* Review Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-8 motion-container"
          >
            <AnimatePresence>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl shadow-xl p-8 relative will-change-transform"
              >
                {/* Quote Icon */}
                <div className="absolute -top-4 left-8 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <Quote className="w-4 h-4 text-white" />
                </div>

                {/* Customer Info */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center border-4 border-gray-100">
                    <span className="text-white font-bold text-lg">
                      {currentTestimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 text-optimized">
                      {currentTestimonial.name}
                    </h3>
                    <p className="text-gray-600">{currentTestimonial.date}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  {[...Array(5 - currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gray-300" />
                  ))}
                </div>

                {/* Review Text */}
                <blockquote className="text-lg text-gray-700 leading-relaxed mb-6 text-optimized">
                  "{currentTestimonial.text}"
                </blockquote>

                {/* English Translation */}
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-500 italic text-optimized">
                    <span className="font-medium">English:</span> "{currentTestimonial.translatedText}"
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-primary-50 p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">4.9</div>
                <div className="text-sm text-gray-700">Google Puanı</div>
              </div>
              <div className="bg-green-50 p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
                <div className="text-sm text-gray-700">Müşteri Yorumu</div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 text-white text-center">
              <h4 className="text-lg font-bold mb-2">Siz de Deneyimleyin!</h4>
              <p className="text-primary-100 mb-4">
                Binlerce memnun müşterimize katılın ve farkı görün.
              </p>
              <a
                href="/rezervasyon"
                className="inline-block bg-white text-primary-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Hemen İletişime Geçin
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonialsSlider;