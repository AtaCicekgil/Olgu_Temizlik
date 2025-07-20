import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Clock, Shield, Star, Heart } from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    { icon: Users, label: 'Mutlu Müşteri', value: '5.000+' },
    { icon: Clock, label: 'Yıl Deneyim', value: '10+' },
    { icon: Award, label: 'Şube', value: '3' },
    { icon: Star, label: 'Ortalama Puan', value: '4.9' }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Güven ve Güvenilirlik',
      description: 'Tutarlı, güvenilir hizmet ve şeffaf iletişim yoluyla kalıcı ilişkiler kuruyoruz.'
    },
    {
      icon: Star,
      title: 'Mükemmellik',
      description: 'Mevcut en iyi ekipman ve teknikleri kullanarak her işte mükemmellik için çabalıyoruz.'
    },
    {
      icon: Heart,
      title: 'Müşteri Memnuniyeti',
      description: 'Memnuniyetiniz bizim önceliğimizdir. Beklentilerinizi aşmak için fazlasını yapıyoruz.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Olgu Temizlik Hakkında</h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              Premium temizlik hizmetleri için güvenilir ortağınız. 
              2014'ten beri mükemmellik, güvenilirlik ve müşteri memnuniyeti.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Hikayemiz</h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                2014 yılında kurulan firmamız, temizlik sektöründe premium ve profesyonel hizmet anlayışıyla faaliyet göstermektedir. Başından beri önceliğimiz, müşterilerimize en yüksek kalitede, güvenilir ve sürdürülebilir temizlik çözümleri sunmaktır.
                </p>
                <p>
                 Ankara’da faaliyet gösteren 3 şubemiz ve deneyimli uzman ekibimizle, gelişmiş teknoloji ve çevre dostu, doğal ürünler kullanarak; halı, koltuk ve perde yıkamada sektörde fark yaratıyoruz. Hizmetlerimizde müşteri memnuniyetini en üst seviyede tutarken, ürünlerinize gösterdiğimiz özenle kalite ve hijyeni garanti ediyoruz.
                </p>
                <p>
                 Firmamız, yenilikçi yaklaşımı ve titiz iş disipliniyle, ev ve iş yerlerinde temizliği bir üst seviyeye taşıma hedefindedir. Premium hizmet anlayışımız, müşterilerimizin beklentilerini aşan sonuçlar sunmamıza olanak tanımaktadır.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="/about-us.webp"
                alt="Profesyonel temizlik ekibi"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Değerlerimiz</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Bu temel değerler yaptığımız her şeye rehberlik eder ve müşterilerimize nasıl hizmet verdiğimizi şekillendirir.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl shadow-lg p-8 text-center"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Olgu Temizlik Farkını Deneyimlemeye Hazır mısınız?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Temizlik ihtiyaçları için bize güvenen binlerce memnun müşteriye katılın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/rezervasyon" className="inline-block">
                <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Hizmet Rezervasyonu
                </button>
              </a>
              <a href="tel:+903123509595" className="inline-block">
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
                  Ara (0312) 350 95 95
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;