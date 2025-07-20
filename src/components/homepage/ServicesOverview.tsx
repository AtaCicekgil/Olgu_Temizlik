import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CarpetIcon, SofaIcon, CurtainIcon } from '../icons';
import Button from '../common/Button';

const services = [
  {
    id: 'hali-yikama',
    title: 'Halı Yıkama',
    description: 'Halılarınızdaki derin kir ve lekeleri özel temizlik tekniklerimizle etkili şekilde ortadan kaldırıyoruz.',
    icon: CarpetIcon,
    features: ['Otomatik makinede yıkama', 'Leke çıkarma', 'Evcil hayvan koku giderme', 'Hızlı kuruma'],
    image: '/gallery/hali-yikama/haliyikama.webp',
    color: 'blue'
  },
  {
    id: 'koltuk-yikama',
    title: 'Koltuk Yıkama',
    description: 'Koltuk, sandalye ve tüm kumaş mobilya türleri için nazik ama etkili temizlik.',
    icon: SofaIcon,
    features: ['Kumaş koruma', 'Renk canlandırma', 'Antibakteriyel temizlik', 'Leke çıkarma'],
    image: '/gallery/koltuk-yikama/koltukyikama.webp',
    color: 'green'
  },
  {
    id: 'perde-temizligi',
    title: 'Stor ve Perde Yıkama',
    description: 'Stor ve perdeleriniz için özel temizlik hizmeti.',
    icon: CurtainIcon,
    features: ['Detaylı temizlik', 'Profesyonel ütüleme', 'Çıkarma, Takma', 'Kumaş bakımı'],
    image: '/gallery/perde-temizligi/storyikama.webp',
    color: 'purple'
  },
  {
    id: 'ozel-hizmetler',
    title: 'Özel Hizmetler',
    description: 'Express halı yıkamadan yerinde temizliğe, ipek ve yün gibi değerli halılarda hassas leke çıkarma ile saçak tamirine kadar, halılarınızı en kısa sürede ve en titiz şekilde bakım ve onarım hizmeti sunuyoruz.',
    icon: Sparkles,
    features: ['Express halı yıkama', 'İpek yün ve değerli halılar için leke çıkarma ve bakım hizmeti', 'Saçak tamiri', 'Yerinde halı yıkama hizmeti'],
    image: '/gallery/ozel-hizmetler/lekecikarma.webp',
    color: 'orange'
  },
  {
    id: 'yorgan-battaniye',
    title: 'Yorgan & Battaniye',
    description: 'Yorgan ve battaniyelerinizi nazik ama etkili yöntemlerle profesyonelce yıkıyoruz.',
    icon: Sparkles,
    features: ['Nazik yıkama', 'Toz giderme', 'Koku giderme', 'Ferah temizlik'],
    image: '/gallery/yorgan-yikama/yorganyikama.webp',
    color: 'blue'
  },
  {
    id: 'yatak-temizligi',
    title: 'Yatak & Döşek Temizliği',
    description: 'Derin temizlik sürecimiz kir ve tozları gidererek daha sağlıklı uyku sağlar.',
    icon: Sparkles,
    features: ['Derin temizlik', 'Alerjen giderme', 'Bakteri temizliği', 'Sağlıklı uyku'],
    image: '/gallery/yatak-yikama/yatakyikama.webp',
    color: 'green'
  },
  {
    id: 'yerinde-hali-yikama',
    title: 'Yerinde Halı Yıkama',
    description: 'Büyük veya sabit halılar için mobil ekipmanlarımızla yerinde profesyonel temizlik.',
    icon: Sparkles,
    features: ['Mobil ekipman', 'Büyük alan temizliği', 'Cami hizmeti', 'Yerinde temizlik'],
    image: '/gallery/yerinde-yikama/yerindeyikama.webp',
    color: 'purple'
  },
  {
    id: 'ofis-temizligi',
    title: 'Ofis & İşyeri Temizliği',
    description: 'Ofisler için kapsamlı temizlik: halılar, koltuklar, camlar ve daha fazlası.',
    icon: Sparkles,
    features: ['Kapsamlı temizlik', 'Ofis mobilyaları', 'Perde temizliği', 'Profesyonel ortam'],
    image: '/gallery/ofis-temizligi/ofistemizligi.webp',
    color: 'orange'
  }
];

const colorSchemes = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  orange: 'from-orange-500 to-orange-600'
};

// Optimized fallback images with much smaller resolution for better performance
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

const ServicesOverview: React.FC = () => {
  return (
    <section className="py-20 bg-white">
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
            <span className="text-primary-600">Hizmetlerimiz</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Eviniz ve ofisiniz için kapsamlı temizlik çözümleri sunuyoruz. 
            İleri teknikler ve çevre dostu ürünlerle mükemmel sonuçlar elde ediyoruz.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.slice(0, 4).map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true, margin: "-50px" }}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden will-change-transform">
                  {/* Service Image */}
                  <div className="relative h-40 overflow-hidden bg-gray-100">
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      style={{
                        aspectRatio: '3/2',
                        objectFit: 'cover',
                        willChange: 'auto'
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = fallbackImages[service.id as keyof typeof fallbackImages];
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className={`absolute top-4 left-4 w-12 h-12 bg-gradient-to-r ${colorSchemes[service.color]} rounded-full flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Service Content */}
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-200">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
                      {service.description.length > 100 ? service.description.substring(0, 100) + '...' : service.description}
                    </p>

                    {/* Features List */}
                    <ul className="space-y-1 mb-4">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Link to={`/hizmetler/${service.id}`}>
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all duration-200"
                      >
                        Detayları Gör
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link to="/hizmetler">
            <Button size="lg" className="shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              Tüm Hizmetleri Gör
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesOverview;