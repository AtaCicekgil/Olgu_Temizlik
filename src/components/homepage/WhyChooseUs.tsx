import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Award, Users, Leaf, Phone } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: '%100 Memnuniyet Garantisi',
    description: 'İşimizin arkasında duruyoruz ve tam memnuniyet garantisi veriyoruz. Memnun değil misiniz? Düzeltiriz.',
    color: 'text-green-600 bg-green-100'
  },
  {
    icon: Clock,
    title: 'Aynı Gün Hizmet İmkanı',
    description: 'Acil temizlik ihtiyacınız mı var? Hizmet alanımızda acil durumlar için aynı gün hizmet sunuyoruz.',
    color: 'text-blue-600 bg-blue-100'
  },
  {
    icon: Award,
    title: 'Profesyonel Ekip',
    description: 'Ekibimiz tamamen eğitimli, deneyimli ve sigortalıdır. Değerli eşyalarınızı uzman ellere güvenle emanet edin.',
    color: 'text-purple-600 bg-purple-100'
  },
  {
    icon: Users,
    title: '10+ Yıl Deneyim',
    description: 'Çankaya ve Mamak bölgesinde binlerce memnun müşteriye hizmet veren on yılı aşkın deneyim.',
    color: 'text-orange-600 bg-orange-100'
  },
  {
    icon: Leaf,
    title: 'Çevre Dostu Çözümler',
    description: 'Aileniz ve evcil hayvanlarınız için güvenli. Çevre dostu temizlik ürünleri ve yöntemleri kullanıyoruz.',
    color: 'text-emerald-600 bg-emerald-100'
  },
  {
    icon: Phone,
    title: '7/24 Müşteri Desteği',
    description: 'Sorularınız veya endişeleriniz mi var? Müşteri destek ekibimiz size yardımcı olmak için 7/24 hizmetinizde.',
    color: 'text-red-600 bg-red-100'
  }
];

const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-20 bg-white">
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
            Neden <span className="text-primary-600">Olgu Temizlik</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Biz sadece başka bir temizlik hizmeti değiliz. Bizi farklı kılan ve 
            binlerce müşterinin güvenilir tercihi yapan özelliklerimiz.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true, margin: "-50px" }}
                className="group"
              >
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 hover:border-primary-200">
                  {/* Icon */}
                  <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200`}>
                    <Icon className="w-8 h-8" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-8 md:p-12 text-white"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Binlerce Kişinin Güveni
            </h3>
            <p className="text-primary-100 text-lg max-w-2xl mx-auto">
              Mükemmellik konusundaki kararlılığımız, Ankara genelinde 
              binlerce müşterinin güvenini kazanmamızı sağladı.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">5.000+</div>
              <div className="text-primary-200 text-sm md:text-base">Mutlu Müşteri</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">4.9</div>
              <div className="text-primary-200 text-sm md:text-base">Ortalama Puan</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">%99</div>
              <div className="text-primary-200 text-sm md:text-base">Müşteri Memnuniyeti</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">7/24</div>
              <div className="text-primary-200 text-sm md:text-base">Destek Hizmeti</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;