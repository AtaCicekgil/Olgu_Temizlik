import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Ayşe Yılmaz',
    location: 'Birlik',
    rating: 5,
    text: 'Kesinlikle harika bir hizmet! Eski halımı yeni gibi yaptılar. Ekip profesyonel, dakikti ve sonuçlar beklentilerimi aştı.',
    service: 'Halı Yıkama Hizmeti',
    avatar: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 2,
    name: 'Mehmet Kaya',
    location: 'Sancak',
    rating: 5,
    text: ' Renkleri karışan kök boyalı halımın kurtarılamayacağını düşünüyordum ama Olgu Temizlik renklerini tekrar düzelterek mucize yarattı. Hassas kumaşlardaki uzmanlıkları eşsiz.',
    service: 'Kök Boyalı Halı Bakımı',
    avatar: 'https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 3,
    name: 'Zeynep Demir',
    location: 'Kırkkonaklar',
    rating: 5,
    text: 'Hızlı, güvenilir ve çevre dostu hizmet. Kalıcı olduğunu düşündüğüm evcil hayvan lekelerini çıkardılar. Sağlığa zararsız temizlik ürünleri sayesinde çocuklarım güvende.',
    service: 'Evcil Hayvan Leke Çıkarma',
    avatar: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 4,
    name: 'Ali Özkan',
    location: 'beytepe',
    rating: 5,
    text: 'Tüm ofis temizliğimizi onlar yapıyor. Her zaman profesyonel, programlama konusunda esnek ve kalite sürekli mükemmel. Ticari ihtiyaçlar için kesinlikle tavsiye ederim.',
    service: 'Ofiz Temizliği',
    avatar: 'https://images.pexels.com/photos/1323592/pexels-photo-1323592.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 5,
    name: 'Fatma Şen',
    location: 'Gaziosmanpaşa',
    rating: 5,
    text: 'Küçük çocuğum İran halımıza vişne suyu döktüğünde aynı gün acil servis hizmetlerinden faydalandım. birkaç saat içerisinde geldiler ve değerli aile yadigarımızı kurtardılar. Sonsuza kadar minnettarım!',
    service: 'Acil Temizlik',
    avatar: 'https://images.pexels.com/photos/1323206/pexels-photo-1323206.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  // Generate consistent avatar background colors based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-blue-700',
      'bg-gradient-to-br from-green-500 to-green-700',
      'bg-gradient-to-br from-purple-500 to-purple-700',
      'bg-gradient-to-br from-pink-500 to-pink-700',
      'bg-gradient-to-br from-indigo-500 to-indigo-700',
      'bg-gradient-to-br from-red-500 to-red-700',
      'bg-gradient-to-br from-yellow-500 to-yellow-700',
      'bg-gradient-to-br from-teal-500 to-teal-700'
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  return (
    <section className="hidden lg:block py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-primary-600">Müşterilerimiz</span> Ne Diyor
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sadece bizim sözümüze güvenmeyin. Olgu Temizlik deneyimi hakkında 
            gerçek müşterilerin söylediklerini okuyun.
          </p>
        </motion.div>

        {/* Main Testimonial Display */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 left-6 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <Quote className="w-6 h-6 text-primary-600" />
              </div>

              {/* Stars */}
              <div className="flex justify-center mb-6">
                <div className="flex items-center space-x-1">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-xl md:text-2xl text-gray-700 text-center leading-relaxed mb-8">
                "{testimonials[currentIndex].text}"
              </blockquote>

              {/* Customer Info */}
              <div className="flex items-center justify-center space-x-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 border-gray-100 ${getAvatarColor(testimonials[currentIndex].name)}`}>
                  <span className="text-white font-bold text-lg">
                    {testimonials[currentIndex].name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900 text-lg">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {testimonials[currentIndex].location} • {testimonials[currentIndex].service}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white hover:bg-gray-50 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-10"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white hover:bg-gray-50 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-10"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-primary-600 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* All Testimonials Grid (Mobile Friendly) */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  {testimonial.service}
                </span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                "{testimonial.text.substring(0, 120)}..."
              </p>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getAvatarColor(testimonial.name)}`}>
                  <span className="text-white font-bold text-sm">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-600 text-xs">
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;