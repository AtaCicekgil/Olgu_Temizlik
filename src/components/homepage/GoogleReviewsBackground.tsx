import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  translatedText: string;
  avatar: string;
  position?: {
    x: number;
    y: number;
    side: 'left' | 'right' | 'top' | 'bottom';
  };
}

const reviews: Review[] = [
  {
    id: 1,
    name: 'Gökhan Öztürk',
    rating: 5,
    text: 'Perdelerimi ve halılarımı farklı zamanlarda verdim, ikisinden de çok memnun kaldım. Ayrıca hızlı ve şeffaf bir işleyiş modeli var.',
    translatedText: 'I gave my curtains and carpets at different times, I was very pleased with both. In addition, there is a fast and transparent working model.',
    avatar: 'https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 2,
    name: 'Ceyhun Erciyes',
    rating: 5,
    text: 'Profesyonelce tertemiz yaptılar işlerini.',
    translatedText: 'They did their job professionally and cleanly.',
    avatar: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 3,
    name: 'Demet Özçelik',
    rating: 5,
    text: 'Hızlı ve güzel geldi, emeğinize sağlık.',
    translatedText: 'It came fast and beautiful, thank you for your effort.',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 4,
    name: 'Yaren Korkmaz',
    rating: 5,
    text: 'Daha önce başka firmalarda yıkanan halılarımızda saçlar kalırdı, bu sefer öyle güzel yıkanmış ki hem çok temiz araları hem de saçlardan eser kalmamış. Çok beğendik 👏',
    translatedText: 'There used to be hair on our carpets that were washed in other companies before, this time it was washed so well that it was both very clean in between and there was no trace of hair left. We loved it 👏',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 5,
    name: 'Dilek Yılmaz',
    rating: 5,
    text: 'İlk kez denedik ama bundan sonra tek tercihimiz diyebilirim. Eve gelen halıları tanıyamadım, tertemiz olmuş ve ev mis gibi kokuyor.',
    translatedText: 'We tried it for the first time, but from now on, I can say that it is our only choice. I couldn\'t recognize the carpets that came to the house, it was clean and the house smells like sweet.',
    avatar: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 6,
    name: 'Sevinç Arıcı',
    rating: 5,
    text: 'Bugün koltuklar, yataklar ve halı yıkama yaptırdık. Kesinlikle tavsiye ederim. Çok profesyonel ve titiz çalıştılar.',
    translatedText: 'Today we had sofas, beds and carpet cleaning done. I would definitely recommend. They worked very professionally and meticulously.',
    avatar: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 7,
    name: 'Mehmet Kaya',
    rating: 5,
    text: 'Antika koltuğumun kurtarılamayacağını düşünüyordum ama Olgu Temizlik mucize yarattı.',
    translatedText: 'I thought my antique sofa could not be saved, but Olgu Cleaning worked miracles.',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 8,
    name: 'Ayşe Demir',
    rating: 5,
    text: 'Çevre dostu ürünler kullanıyorlar, çocuklarım için güvenli. Sonuçlar da mükemmel.',
    translatedText: 'They use environmentally friendly products, safe for my children. The results are also perfect.',
    avatar: 'https://images.pexels.com/photos/1323206/pexels-photo-1323206.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

// Define safe zones where reviews can appear without overlapping main content
const generateRandomPosition = (existingPositions: Array<{x: number, y: number}> = []) => {
  const safeZones = [
    // Top corners
    { x: 5, y: 10, side: 'top' as const },
    { x: 75, y: 15, side: 'top' as const },
    
    // Left side (avoiding center)
    { x: 2, y: 25, side: 'left' as const },
    { x: 8, y: 45, side: 'left' as const },
    { x: 5, y: 65, side: 'left' as const },
    
    // Right side (avoiding center)
    { x: 85, y: 30, side: 'right' as const },
    { x: 78, y: 50, side: 'right' as const },
    { x: 82, y: 70, side: 'right' as const },
    
    // Bottom corners
    { x: 10, y: 85, side: 'bottom' as const },
    { x: 70, y: 80, side: 'bottom' as const },
  ];

  // Filter out positions that are too close to existing ones
  const availableZones = safeZones.filter(zone => {
    return !existingPositions.some(existing => {
      const distance = Math.sqrt(
        Math.pow(zone.x - existing.x, 2) + Math.pow(zone.y - existing.y, 2)
      );
      return distance < 25; // Minimum distance between reviews
    });
  });

  if (availableZones.length === 0) {
    // Fallback to any safe zone if all are taken
    return safeZones[Math.floor(Math.random() * safeZones.length)];
  }

  return availableZones[Math.floor(Math.random() * availableZones.length)];
};

// Generate consistent avatar background colors based on name
const getAvatarColor = (name: string) => {
  const colors = [
    'from-blue-500 to-blue-700',
    'from-green-500 to-green-700',
    'from-purple-500 to-purple-700',
    'from-pink-500 to-pink-700',
    'from-indigo-500 to-indigo-700',
    'from-red-500 to-red-700',
    'from-yellow-500 to-yellow-700',
    'from-teal-500 to-teal-700'
  ];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

const GoogleReviewsBackground: React.FC = () => {
  const [activeReviews, setActiveReviews] = useState<Review[]>([]);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  // Initialize with 1-2 random reviews
  useEffect(() => {
    const shuffled = [...reviews].sort(() => 0.5 - Math.random());
    const reviewCount = Math.random() > 0.3 ? 2 : 1; // 70% chance for 2 reviews, 30% for 1
    const initial = shuffled.slice(0, reviewCount);
    
    // Assign random positions
    const positioned = initial.map((review, index) => {
      const existingPositions = initial.slice(0, index).map(r => r.position).filter(Boolean) as Array<{x: number, y: number}>;
      const position = generateRandomPosition(existingPositions);
      return {
        ...review,
        position
      };
    });
    
    setActiveReviews(positioned);
  }, []);

  // Rotate reviews continuously with new positions
  useEffect(() => {
    if (activeReviews.length === 0) return;

    const interval = setInterval(() => {
      // Randomly decide whether to show 1 or 2 reviews
      const newReviewCount = Math.random() > 0.3 ? 2 : 1;
      
      // Get available reviews (not currently active)
      const availableReviews = reviews.filter(
        review => !activeReviews.some(active => active.id === review.id)
      );
      
      if (availableReviews.length > 0) {
        const shuffled = [...availableReviews].sort(() => 0.5 - Math.random());
        const newReviews = shuffled.slice(0, newReviewCount);
        
        // Assign completely new random positions
        const positioned = newReviews.map((review, index) => {
          const existingPositions = newReviews.slice(0, index).map(r => r.position).filter(Boolean) as Array<{x: number, y: number}>;
          const position = generateRandomPosition(existingPositions);
          return {
            ...review,
            position
          };
        });
        
        setActiveReviews(positioned);
      }
    }, 6000); // Change reviews every 6 seconds

    return () => clearInterval(interval);
  }, [activeReviews]);

  const handleImageError = (reviewId: number) => {
    setImageErrors(prev => new Set(prev).add(reviewId));
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {activeReviews.map((review) => {
          if (!review.position) return null;
          
          const { x, y, side } = review.position;
          
          // Determine animation direction based on side
          const getInitialPosition = () => {
            switch (side) {
              case 'left':
                return { x: -150, y: 0 };
              case 'right':
                return { x: 150, y: 0 };
              case 'top':
                return { x: 0, y: -100 };
              case 'bottom':
                return { x: 0, y: 100 };
              default:
                return { x: -100, y: 0 };
            }
          };

          const getExitPosition = () => {
            switch (side) {
              case 'left':
                return { x: -150, y: -20 };
              case 'right':
                return { x: 150, y: -20 };
              case 'top':
                return { x: 20, y: -100 };
              case 'bottom':
                return { x: -20, y: 100 };
              default:
                return { x: -100, y: 20 };
            }
          };

          const initialPos = getInitialPosition();
          const exitPos = getExitPosition();
          const hasImageError = imageErrors.has(review.id);
          
          return (
            <motion.div
              key={`${review.id}-${x}-${y}`}
              initial={{ 
                opacity: 0, 
                scale: 0.8, 
                x: initialPos.x,
                y: initialPos.y,
                rotate: Math.random() * 6 - 3
              }}
              animate={{ 
                opacity: 0.9, 
                scale: 1, 
                x: 0,
                y: 0,
                rotate: 0
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.8, 
                x: exitPos.x,
                y: exitPos.y,
                rotate: Math.random() * 6 - 3
              }}
              transition={{ 
                duration: 0.8,
                ease: "easeOut",
                scale: { duration: 0.6 },
                rotate: { duration: 1.0 }
              }}
              className="absolute z-10 will-change-transform"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-4 max-w-xs border border-gray-200/50 hover:shadow-2xl transition-shadow duration-200 hover:scale-105 will-change-transform">
                {/* Google logo and rating */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs font-bold">G</span>
                    </div>
                    <span className="text-xs font-medium text-gray-700">Google</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Review text */}
                <p className="text-xs text-gray-700 mb-3 leading-relaxed font-medium">
                  "{review.text.length > 100 ? review.text.substring(0, 100) + '...' : review.text}"
                </p>

                {/* User info */}
                <div className="flex items-center space-x-2">
                  {!hasImageError ? (
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-100"
                      loading="lazy"
                      onError={() => handleImageError(review.id)}
                    />
                  ) : (
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(review.name)} border-2 border-gray-100 flex items-center justify-center`}>
                      <span className="text-white text-xs font-bold">
                        {review.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-semibold text-gray-900">{review.name}</div>
                    <div className="text-xs text-gray-500">Google Kullanıcısı</div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default GoogleReviewsBackground;