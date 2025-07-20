import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface SliderImage {
  id: number;
  src: string;
  alt: string;
  title: string;
  description: string;
  category: string;
}

const sliderImages: SliderImage[] = [
  {
    id: 1,
    src: '/gallery/slider/image2.webp',
    alt: 'Profesyonel halı yıkama süreci',
    title: 'Halı Yıkama',
    description: '8 fırçalı otomatik makinelerle profesyonel temizlik',
    category: 'Halı Temizliği'
  },
  {
    id: 2,
    src: '/gallery/slider/image4.webp',
    alt: 'Koltuk temizlik hizmeti',
    title: 'Yün Halı Yıkama',
    description: 'Renkleri yeniden canlandı, dokusu tazelendi. Derinlemesine temizlikle sağlıklı ve ferah bir görünüm kazandı.',
    category: 'Özel Halı Bakımı'
  },
  {
    id: 3,
    src: '/gallery/slider/image11.webp',
    alt: 'Özel Halı Yıkama Hizmeti',
    title: 'Bambu Halı Yıkama',
    description: 'Bambu halılar, doğal lif yapısı sayesinde hem yumuşak hem de hassas dokudadır. Bu özel halılar için geliştirilmiş temizlik sürecimiz, bambu liflerine zarar vermeden derinlemesine temizlik sağlar.',
    category: 'Özel Halı Bakımı'
  },
  {
    id: 4,
    src: '/gallery/koltuk-yikama/koltuk1.webp',
    alt: 'Tertemiz Yıkanmış Koltuklar',
    title: 'Koltuklarınıza Ferahlık Katın',
    description: 'Kumaşına zarar vermeyen, etkili temizlikle evinizin havası değişir.',
    category: 'Koltuk Temizliği'
  },
  {
    id: 4,
    src: '/gallery/slider/image13.webp',
    alt: 'Bol Köpüklü Halı Yıkama',
    title: 'Bol Köpükle Halı Yıkama',
    description: 'Yoğun köpük uygulaması ile halının yüzeyinde dönen 8 güçlü fırça, liflerin arasına işlemiş kir ve lekeleri etkili şekilde söker.',
    category: 'Halı Temizliği'
  },
  {
    id: 5,
    src: '/gallery/slider/image16.webp',
    alt: 'Yün Halı Yıkama',
    title: 'Yün Halılar İçin Bakım Hizmeti',
    description: 'Yün halılar, hassas yapıları nedeniyle özenli temizlik ister. Bu nedenle yıkama sürecinde yüne özel şampuanlar, düşük devirli fırçalama ve soğuk suyla durulama teknikleri kullanıyoruz.',
    category: 'Özel Halı Bakımı'
  },
  {
    id: 6,
    src: '/gallery/slider/image17.webp',
    alt: 'Renk Koruyucu Yıkama',
    title: 'Yün Halılar İçin Renk Koruyucu Yıkama',
    description: 'Yün halınız renklerini kaybetmeden, özenle temizlenir.',
    category: 'Özel Halı Bakımı'
  },
  {
    id: 7,
    src: '/gallery/slider/image3.webp',
    alt: 'Yumuşaklık ve Canlılık Geri Gelir',
    title: 'Yumuşaklık ve Canlılık Geri Gelir ',
    description: 'Yıkama sonrası yün halılarınız yumuşak ve canlı görünür.',
    category: 'Halı Temizliği'
  },
  {
    id: 8,
    src: '/gallery/slider/image0.webp',
    alt: 'Doğal Yumuşaklık, Parlayan Renkler',
    title: 'Doğal Yumuşaklık, Parlayan Renkler',
    description: 'YÖzenli bakım sayesinde yün halılarınız ilk günkü canlılığına ve yumuşak dokusuna kavuşur.',
    category: 'Halı Temizliği'
  },
  {
    id: 9,
    src: '/gallery/slider/image5.webp',
    alt: 'Kaliteli Şampuanlar ile Yıkama',
    title: 'Tesisimizde En Kaliteli Şampuanlar Kullanılmaktadır.',
    description: '8 fırçalı sistemle, kaliteli şampuanlarla derinlemesine temizlik.',
    category: 'Halı Temizliği'
  },
  {
    id: 10,
    src: '/gallery/slider/image36.webp',
    alt: 'Göz Alıcı Temizlik Etkisi',
    title: 'Göz Alıcı Temizlik Etkisi',
    description: 'Beyaz, krem ve pastel tonlar, profesyonel bakım sayesinde eski ışıltısına kavuşur.',
    category: 'Halı Temizliği'
  },
  {
    id: 11,
    src: '/gallery/slider/image8.webp',
    alt: 'Çin Halılarına Uygun Özel Yıkama',
    title: 'Çin Halılarına Uygun Özel Yıkama',
    description: 'Zengin desenli Çin halıları, renk solması olmadan yıkanır.',
    category: 'Özel Halı Bakımı'
  },
  {
    id: 12,
    src: '/gallery/slider/image9.webp',
    alt: 'El Dokumasına Uygun Yıkama',
    title: 'El Dokumasına Uygun Yıkama',
    description: 'El emeği halılarınız özenle yıkanır, şekli ve dokusu korunur.',
    category: 'Özel Halı Bakımı'
  },

];

const ModernImageSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(new Set());

  // Otomatik oynatma işlevselliği
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Navigasyon fonksiyonları
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    setIsAutoPlaying(false);
    // 10 saniye sonra otomatik oynatmaya devam et
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
    setIsAutoPlaying(false);
    // 10 saniye sonra otomatik oynatmaya devam et
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // 10 saniye sonra otomatik oynatmaya devam et
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  // Mobil kaydırma için dokunma işleyicileri
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Klavye navigasyonu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlaying(!isAutoPlaying);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, isAutoPlaying]);

  const handleImageError = (imageId: number) => {
    setImageLoadErrors(prev => new Set(prev).add(imageId));
  };

  const getFallbackImage = (index: number) => {
    const fallbacks = [
      'https://images.pexels.com/photos/6197628/pexels-photo-6197628.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://images.pexels.com/photos/6197113/pexels-photo-6197113.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://images.pexels.com/photos/6782370/pexels-photo-6782370.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
    ];
    return fallbacks[index] || fallbacks[0];
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bölüm Başlığı */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-primary-600">Hizmetlerimizden</span> Kareler
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Profesyonel temizlik hizmetlerimizin kalitesini gösteren özenle seçilmiş görsellerle
            işimizin arkasında durduğumuzu kanıtlıyoruz.
          </p>
        </motion.div>

        {/* Slider Konteyneri */}
        <div className="relative max-w-6xl mx-auto">
          <div
            className="relative overflow-hidden rounded-3xl bg-white shadow-2xl"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Slaytlar */}
            <div className="relative h-96 md:h-[500px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                    {/* Görsel Tarafı */}
                    <div className="relative overflow-hidden">
                      <img
                        src={imageLoadErrors.has(sliderImages[currentSlide].id)
                          ? getFallbackImage(currentSlide)
                          : sliderImages[currentSlide].src}
                        alt={sliderImages[currentSlide].alt}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        onError={() => handleImageError(sliderImages[currentSlide].id)}
                      />
                      {/*
                        Bu katman yalnızca büyük ekranlarda görünür.
                        Mobilde, görsel tüm alanı kaplar.
                      */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent lg:hidden" />

                      {/* Kategori Etiketi */}
                      <div className="absolute top-6 left-6 bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        {sliderImages[currentSlide].category}
                      </div>

                      {/* Galeriyi Görüntüle Butonu */}
                      <div className="absolute bottom-6 right-6">
                        <a
                          href="/galeri"
                          className="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-white transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Galeriyi Gör</span>
                        </a>
                      </div>
                    </div>

                    {/* İçerik Tarafı - Mobilde gizli (`hidden`) ve büyük ekranlarda (`lg:flex`) görünür */}
                    <div className="hidden lg:flex items-center p-8 lg:p-12 bg-gradient-to-br from-gray-50 to-white">
                      <div className="w-full">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                        >
                          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {sliderImages[currentSlide].title}
                          </h3>
                          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            {sliderImages[currentSlide].description}
                          </p>

                          {/* Özellikler - Ayrıca mobilde gizli */}
                          <div className="space-y-3 mb-8">
                            {currentSlide === 0 && (
                              <>
                                <div className="flex items-center text-gray-700">
                                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-3" />
                                  <span>8 fırçalı otomatik yıkama</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-3" />
                                  <span>Çevre dostu temizlik ürünleri</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-3" />
                                  <span>Hızlı kuruma teknolojisi</span>
                                </div>
                              </>
                            )}
                            {currentSlide === 1 && (
                              <>
                                <div className="flex items-center text-gray-700">
                                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-3" />
                                  <span>Kumaş koruyucu formül</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-3" />
                                  <span>Renk canlandırma</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-3" />
                                  <span>Antibakteriyel temizlik</span>
                                </div>
                              </>
                            )}
                            {currentSlide === 2 && (
                              <>
                                <div className="flex items-center text-gray-700">
                                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-3" />
                                  <span>Çıkarma ve takma dahil</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-3" />
                                  <span>Profesyonel ütüleme</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-3" />
                                  <span>Kumaş bakımı</span>
                                </div>
                              </>
                            )}
                          </div>

                          {/* CTA Butonu */}
                          <a
                            href="/rezervasyon"
                            className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
                          >
                            Hizmet Al
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </a>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigasyon Okları */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-10 group"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:text-primary-600 transition-colors" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-10 group"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-gray-700 group-hover:text-primary-600 transition-colors" />
            </button>
          </div>

          {/* Navigasyon Noktaları */}
          <div className="flex justify-center mt-8 space-x-3">
            {sliderImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                  index === currentSlide
                    ? 'bg-primary-600 scale-125 shadow-lg'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* İlerleme Çubuğu */}
          <div className="mt-6 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
            <motion.div
              key={currentSlide}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: isAutoPlaying ? 5 : 0, ease: "linear" }}
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
            />
          </div>
        </div>

        {/* Alt CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <a
            href="/galeri"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold text-lg transition-colors group"
          >
            Tüm Galeriyi Keşfet
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ModernImageSlider;