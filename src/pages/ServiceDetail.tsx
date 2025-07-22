import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Star, CheckCircle, Phone, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';
import Button from '../components/common/Button';

const ServiceDetail: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { services } = useBooking();
  
  const service = services.find(s => s.id === serviceId);

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hizmet bulunamadı</h2>
          <Link to="/hizmetler">
            <Button>Hizmetlere Geri Dön</Button>
          </Link>
        </div>
      </div>
    );
  }

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
    'hali-yikama': 'https://images.pexels.com/photos/6197628/pexels-photo-6197628.jpeg?auto=compress&cs=tinysrgb&w=1000&h=600',
    'koltuk-yikama': 'https://images.pexels.com/photos/6197113/pexels-photo-6197113.jpeg?auto=compress&cs=tinysrgb&w=1000&h=600',
    'perde-temizligi': 'https://images.pexels.com/photos/6782370/pexels-photo-6782370.jpeg?auto=compress&cs=tinysrgb&w=1000&h=600',
    'ozel-hizmetler': 'https://images.pexels.com/photos/6197119/pexels-photo-6197119.jpeg?auto=compress&cs=tinysrgb&w=1000&h=600',
    'yorgan-battaniye': 'https://images.pexels.com/photos/6197628/pexels-photo-6197628.jpeg?auto=compress&cs=tinysrgb&w=1000&h=600',
    'yatak-temizligi': 'https://images.pexels.com/photos/6197113/pexels-photo-6197113.jpeg?auto=compress&cs=tinysrgb&w=1000&h=600',
    'yerinde-hali-yikama': 'https://images.pexels.com/photos/6782370/pexels-photo-6782370.jpeg?auto=compress&cs=tinysrgb&w=1000&h=600',
    'ofis-temizligi': 'https://images.pexels.com/photos/6197119/pexels-photo-6197119.jpeg?auto=compress&cs=tinysrgb&w=1000&h=600'
  };

  // Service-specific gallery images
  const getServiceGalleryImages = (serviceId: string) => {
    const baseImages = {
      // Extended Halı Yıkama gallery with new images
      'hali-yikama': [
        {
          id: 1,
          src: '/gallery/hali-yikama/haliyikama.webp',
          alt: 'Halı temizlik süreci',
          title: 'Temizlik Süreci',
          description: 'Adım adım profesyonel halı temizliği'
        },
        {
          id: 2,
          src: '/gallery/hali-yikama/image2.webp',
          alt: 'Halı yıkama detayı',
          title: 'Detaylı Temizlik',
          description: 'Her noktasına özen gösterilen temizlik'
        },
        {
          id: 3,
          src: '/gallery/hali-yikama/image3.webp',
          alt: 'Halı kurutma süreci',
          title: 'Kurutma Süreci',
          description: 'Kontrollü kurutma ile mükemmel sonuç'
        },
        {
          id: 4,
          src: '/gallery/hali-yikama/image4.webp',
          alt: 'Halı temizlik ekipmanı',
          title: 'Profesyonel Ekipman',
          description: 'Son teknoloji temizlik makineleri'
        },
        {
          id: 5,
          src: '/gallery/hali-yikama/image5.webp',
          alt: 'Halı yıkama işlemi',
          title: 'Yıkama İşlemi',
          description: 'Derin temizlik için özel yöntemler'
        },
        {
          id: 6,
          src: '/gallery/hali-yikama/image6.webp',
          alt: 'Halı bakım hizmeti',
          title: 'Bakım Hizmeti',
          description: 'Halılarınızın uzun ömürlü olması için bakım'
        },
        {
          id: 7,
          src: '/gallery/hali-yikama/image7.webp',
          alt: 'Halı temizlik sonucu',
          title: 'Mükemmel Sonuç',
          description: 'Temizlik sonrası halınızın yeni hali'
        },
        {
          id: 8,
          src: '/gallery/hali-yikama/image8.webp',
          alt: 'Halı leke çıkarma',
          title: 'Leke Çıkarma',
          description: 'En zorlu lekeler bile çıkarılır'
        },
        {
          id: 9,
          src: '/gallery/hali-yikama/image9.webp',
          alt: 'Halı hijyen temizliği',
          title: 'Hijyen Temizliği',
          description: 'Bakterilere karşı hijyenik temizlik'
        },
        {
          id: 10,
          src: '/gallery/hali-yikama/image10.webp',
          alt: 'Halı renk koruma',
          title: 'Renk Koruma',
          description: 'Renklerin solmaması için özel işlem'
        },
        {
          id: 11,
          src: '/gallery/hali-yikama/image11.webp',
          alt: 'Halı dokuma koruma',
          title: 'Dokuma Koruma',
          description: 'Halı dokusuna zarar vermeden temizlik'
        },
        {
          id: 12,
          src: '/gallery/hali-yikama/image12.webp',
          alt: 'Halı özel bakım',
          title: 'Özel Bakım',
          description: 'Değerli halılar için özel bakım hizmeti'
        },
        {
          id: 13,
          src: '/gallery/hali-yikama/image13.webp',
          alt: 'Halı temizlik kalitesi',
          title: 'Kalite Kontrolü',
          description: 'Her halı için kalite kontrolü yapılır'
        },
        {
          id: 14,
          src: '/gallery/hali-yikama/image14.webp',
          alt: 'Halı teslim hazırlığı',
          title: 'Teslim Hazırlığı',
          description: 'Temizlik sonrası paketleme ve teslim'
        },
        {
          id: 15,
          src: '/gallery/hali-yikama/image15.webp',
          alt: 'Halı profesyonel hizmet',
          title: 'Profesyonel Hizmet',
          description: 'Uzman ekip ile profesyonel temizlik'
        }
      ],
      
      
      'koltuk-yikama': [
        // Add more koltuk images when available
      ],
      
      'perde-temizligi': [
        // Add more perde images when available
      ],
      
      'ozel-hizmetler': [
        // Add more özel hizmet images when available
      ]
    };
    
    return baseImages[serviceId as keyof typeof baseImages] || [];
  };

  const [selectedGalleryImage, setSelectedGalleryImage] = React.useState<any>(null);
  const [currentGalleryIndex, setCurrentGalleryIndex] = React.useState(0);
  
  const serviceGalleryImages = getServiceGalleryImages(service.id);
  
  const openGalleryLightbox = (image: any, index: number) => {
    setSelectedGalleryImage(image);
    setCurrentGalleryIndex(index);
  };

  const closeGalleryLightbox = () => {
    setSelectedGalleryImage(null);
  };

  const nextGalleryImage = () => {
    const nextIndex = (currentGalleryIndex + 1) % serviceGalleryImages.length;
    setCurrentGalleryIndex(nextIndex);
    setSelectedGalleryImage(serviceGalleryImages[nextIndex]);
  };

  const prevGalleryImage = () => {
    const prevIndex = (currentGalleryIndex - 1 + serviceGalleryImages.length) % serviceGalleryImages.length;
    setCurrentGalleryIndex(prevIndex);
    setSelectedGalleryImage(serviceGalleryImages[prevIndex]);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = fallbackImages[service.id as keyof typeof fallbackImages];
  };

  const getProcessSteps = (serviceId: string) => {
    switch (serviceId) {
      case 'hali-yikama':
        return [
          {
            step: 1,
            title: 'Talep ve İletişim',
            description: 'Hemen arayarak sipariş oluşturun veya online formdan talebinizi gönderin, uzmanlarımız 2 saat içinde sizinle iletişime geçsin.'
          },
          {
            step: 2,
            title: 'Halılarınızı Teslim Alıyoruz',
            description: 'Belirlenen tarih ve saatte, halılarınız uzman personelimiz tarafından adresinizden özenle teslim alınır. Her halı, kayıt altına alınarak sistemimize işlenir ve temizlik süreci başlatılmak üzere tesisimize transfer edilir.'
          },
          {
            step: 3,
            title: 'Toz Alma (Çırpma ve Vakumlama)',
            description: 'Yıkama öncesinde halılar, profesyonel toz alma makinelerinde çırpma ve vakumlama işlemlerinden geçirilir. Bu aşamada, halı dokusunda birikmiş toz, kum ve mikro partiküller derinlemesine temizlenerek yıkama için ideal zemin hazırlanır.'
          },
          {
            step: 4,
            title: 'Tam Otomatik Yıkama',
            description: 'Tozdan arındırılan halılar, halı türüne uygun olarak seçilen doğal içerikli temizlik şampuanları ile 8 fırçalı tam otomatik makinelerde yıkanır. Bu süreçte hem derinlemesine temizlik sağlanır, hem de halının dokusu ve renk bütünlüğü korunur.'
          },
          
          {
            step: 5,
            title: 'Yüzey Temizliği ve Leke Giderme',
            description: 'Yıkama sonrası halıların üst yüzeyi özel ekipmanlarla detaylı şekilde temizlenir. Ardından, kalıcı ve zorlayıcı lekeler tespit edilerek leke türüne özel ürünlerle noktasal müdahale gerçekleştirilir.'
          },
          
          {
            step: 6,
            title: 'Kurutma ve Paketleme',
            description: 'Temizlik süreci tamamlanan halılar, uygun koşullarda tamamen kurutulur. Kurutma sonrası yapılan son kontrollerin ardından halılar hijyenik koşullarda özenle paketlenerek teslimata hazır hale getirilir.'
          },
          {
            step: 7,
            title: 'Teslim ve Kalite Kontrolü',
            description: 'Paketlenen halılar, planlanan gün ve saatte müşterinin adresine teslim edilir. Teslimat sırasında müşteri memnuniyeti ve güvenliği esas alınır.'
          }
        ];
      
      case 'koltuk-yikama':
        return [
          {
            step: 1,
            title: 'Talep ve İletişim',
            description: 'Hemen şimdi bizi arayın veya online form üzerinden talebinizi iletin! Uzman ekibimiz en geç 2 saat içinde size dönüş yaparak uygun gün ve saatte randevunuzu oluşturacaktır. Fotoğraf göndererek koltuklarınızın durumunu önceden gösterebilir, hızlı ve sağlıklı fiyatlandırma imkanı sağlayabilirsiniz.'
          },
          {
            step: 2,
            title: 'Fiyatlandırma ve Hazırlık',
            description: 'Randevu öncesinde fotoğraf üzerinden ön fiyatlandırma yapılabilir. Alternatif olarak, ekipman ve temizlik malzemeleri ile adresinize gelerek koltukları yerinde inceleyip kesin fiyatı bildiririz..'
          },
          {
            step: 3,
            title: 'Vakumlama ve Yıkama',
            description: 'Yıkama öncesi koltuk yüzeyi güçlü vakum makinesi ile toz ve kalıntılardan arındırılır. Ardından, koltuk kumaşına uygun, doğal içerikli ve kaliteli temizlik şampuanlarıyla derinlemesine temizlik yapılır. Yıkama işlemi tamamlandıktan sonra, şampuan kalıntısı, kir ve nem vakumla çekilerek koltuk yüzeyinde sadece temiz nem kalması sağlanır.'
          },
          {
            step: 4,
            title: 'Kuruma Süreci',
            description: 'Yıkama tamamlandıktan sonra koltukların kuruma süresi, hava koşulları ve kumaş türüne bağlı olarak genellikle 3 ila 6 saat arasında değişir. Bu sürede koltukların kullanılmaması tavsiye edilir..'
          },
          {
            step: 5,
            title: 'Kalite Kontrolü ve Bilgilendirme',
            description: 'Temizlik işlemi tamamlandıktan sonra, kalite kontrolü yapılır; müşteri bilgilendirilir ve hizmet süreci sonlandırılır.'
          }
        ];
      
      case 'perde-temizligi':
        return [
          {
            step: 1,
            title: 'Talep ve İletişim',
            description: 'Hemen şimdi bizi arayın veya online form üzerinden talebinizi iletin! Uzman ekibimiz en geç 30 dakika içinde size dönüş yaparak uygun gün ve saatte randevunuzu oluşturacaktır.'
          },
          {
            step: 2,
            title: 'Perdelerin Teslim Alımı ve Ek Hizmetler',
            description: 'Perdeleriniz, belirlenen tarihte adresinizden özenle teslim alınır. İsteğe bağlı olarak, ek hizmet kapsamında perde sökme ve takma işlemleri de uzman ekiplerimiz tarafından gerçekleştirilir.'
          },
          {
            step: 3,
            title: 'Hijyenik Yıkama Süreci',
            description: 'Perdeleriniz, kaliteli ve doğal içerikli şampuanlarla tamamen hijyenik koşullarda özenle yıkanır. İnatçı lekeler profesyonel yöntemlerle çıkarılır ve ardından tesisat suyu ile titizlikle durulanır.'
          },
          {
            step: 4,
            title: 'Kurutma Süreci',
            description: 'Yıkanan perdeler, açık hava ve kapalı alan havalandırma sistemlerimizde, güneş ışığı ve hava koşullarından etkilenmeden kontrollü şekilde kurutulur.'
          },
          {
            step: 5,
            title: 'Paketleme Süreci',
            description: 'Kurutma işlemi tamamlanan perdeler, hijyenik koşullarda ütülenir ve paketlenir. Fiyatlandırma; stor perdelerde metrekare (m²) üzerinden, diğer perdelerde ise perde sayısı, kir durumu ve yıkama zorluğuna göre belirlenir.'
          },
          {
            step: 6,
            title: 'Teslimat ve Ek Hizmetler',
            description: 'Perdelerinizin hazırlandığına dair bilgilendirme mesajı tarafınıza gönderilir. Ekip arkadaşlarımız, teslimat günü ve saati için sizinle iletişime geçer. Talep edilmesi durumunda, perde takma işlemi de profesyonel ekiplerimizce gerçekleştirilir.'
          }
        ];
      
      case 'ozel-hizmetler':
        return [
          {
            step: 1,
            title: 'Talep ve İletişim',
            description: 'Hemen arayarak sipariş oluşturun veya online formdan talebinizi gönderin, uzmanlarımız 2 saat içinde sizinle iletişime geçsin.'
          },
          {
            step: 2,
            title: 'Uzman Değerlendirme',
            description: 'İpek, yün ve değerli halılar için özel eğitimli uzmanlarımız detaylı inceleme yapar ve hassas temizlik planı oluşturur.'
          },
          {
            step: 3,
            title: 'Özel Fiyat Teklifi',
            description: 'Halınızın değeri ve gereken özel işlemler göz önünde bulundurularak size özel fiyat teklifi sunulur.'
          },
          {
            step: 4,
            title: 'Hassas Temizlik ve Onarım',
            description: 'El yıkama, leke çıkarma, saçak tamiri gibi özel işlemler titizlikle uygulanır. Express hizmet seçeneği ile hızlı teslimat sağlanır.'
          },
          {
            step: 5,
            title: 'Özel Paketleme ve Teslim',
            description: 'Değerli halınız özel koruyucu malzemelerle paketlenir ve güvenli şekilde teslim edilir. Bakım önerileri sunulur.'
          }
        ];
      
      case 'yorgan-battaniye':
        return [
          {
            step: 1,
            title: 'Talep ve Randevu',
            description: 'Yorgan ve battaniye temizliği için arayarak veya form göndererek iletişime geçin. Uzmanlarımız 2 saat içinde sizinle iletişime geçerek randevu planlar.'
          },
          {
            step: 2,
            title: 'Teslim Alma',
            description: 'Yorgan ve battaniyeleriniz adresinizden özenle teslim alınır ve tesisimize güvenli şekilde taşınır.'
          },
          {
            step: 3,
            title: 'Nazik Yıkama Süreci',
            description: 'Özel yıkama makinelerinde kumaş türüne uygun sıcaklık ve deterjanlarla nazik ama etkili temizlik yapılır.'
          },
          {
            step: 4,
            title: 'Kurutma ve Havalandırma',
            description: 'Kontrollü kurutma sistemlerinde doğal havalandırma ile kurutulur, tüm nem ve koku giderilir.'
          },
          {
            step: 5,
            title: 'Kalite Kontrolü ve Teslim',
            description: 'Son kalite kontrolü yapıldıktan sonra hijyenik paketleme ile adresinize teslim edilir.'
          }
        ];

      case 'yatak-temizligi':
        return [
          {
            step: 1,
            title: 'Randevu ve Değerlendirme',
            description: 'Yatak temizliği için randevu alın. Uzmanlarımız yatak türünü ve temizlik ihtiyacını değerlendirir.'
          },
          {
            step: 2,
            title: 'Ön Hazırlık ve Vakumlama',
            description: 'Yatak yüzeyi güçlü vakum ile temizlenir, toz ve döküntüler giderilir.'
          },
          {
            step: 3,
            title: 'Derin Temizlik İşlemi',
            description: 'Yatağınız önce özel şampuanlarla temizlenir, ardından güçlü vakum sistemimizle derinlemesine çekim yapılır. Böylece kir, bakteri, akar ve şampuan kalıntıları tamamen uzaklaştırılır; hijyenik ve ferah bir temizlik sağlanır.'
          },
          {
            step: 4,
            title: 'Dezenfeksiyon ve Kurutma',
            description: 'doğal kurutma yöntemleri ile dezenfeksiyon sağlanır ve nem tamamen giderilir.'
          },
          {
            step: 5,
            title: 'Son Kontrol ve Koruma',
            description: 'Temizlik sonrası kalite kontrolü yapılır, yatağınız hijyenik ve kullanıma hazır şekilde teslim edilir.'
          }
        ];

      case 'yerinde-hali-yikama':
        return [
          {
            step: 1,
            title: 'Keşif ve Planlama',
            description: 'Ekip arkadaşlarımız adresinize gelerek ya da gönderdiğiniz fotoğraflar üzerinden halılarınızı değerlendirir. Bu değerlendirme doğrultusunda en uygun temizlik yöntemi belirlenir ve süreç planlanır.'
          },
          {
            step: 2,
            title: 'Ekipman Kurulumu',
            description: 'Profesyonel temizlik ekipmanları lokasyonunuza getirilir ve kurulum yapılır.'
          },
          {
            step: 3,
            title: 'Ön Temizlik ve Hazırlık',
            description: 'Halı yüzeyi vakumlanır, lekeler tespit edilir ve ön işlem uygulanır.'
          },
          {
            step: 4,
            title: 'Yerinde Derin Temizlik',
            description: 'Özel makineler ile halı yerinde yıkanır, tüm kir ve lekeler giderilir.'
          },
          {
            step: 5,
            title: 'Vamkumlama ve Son İşlemler',
            description: 'Yıkama sonrası halılar, yüksek emiş gücüne sahip özel vakum sistemleriyle derinlemesine temizlenir. İçlerinde kalan şampuan, kir ve su kalıntıları tamamen çekilir. Ardından güçlü kurutma sistemleriyle halılar hızlıca kurutulur ve son kalite kontrolüyle teslimata hazır hale getirilir.'
          }
        ];

      case 'ofis-temizligi':
        return [
          {
            step: 1,
            title: 'Ofis Değerlendirmesi',
            description: 'Ofis alanı incelenir, temizlenecek mobilyalar belirlenir ve kapsamlı temizlik planı hazırlanır.'
          },
          {
            step: 2,
            title: 'Çalışma Saatleri Planlaması',
            description: 'İş akışını bozmamak için mesai saatleri dışında veya hafta sonları temizlik planlanır.'
          },
          {
            step: 3,
            title: 'Kapsamlı Temizlik',
            description: 'Halılar, koltuklar, sandalyeler, perdeler ve tüm kumaş mobilyalar profesyonelce temizlenir.'
          },
          {
            step: 4,
            title: 'Dezenfeksiyon ve Hijyen',
            description: 'Tüm yüzeyler profesyonel dezenfeksiyon işlemiyle temizlenir ve hijyen sağlanır..'
          },
          {
            step: 5,
            title: 'Son Düzenleme',
            description: 'Mobilyalar yerlerine yerleştirilir, ofis çalışmaya hazır hale getirilir.'
          }
        ];

      default:
        return [
          {
            step: 1,
            title: 'Talep ve Randevu Oluşturma',
            description: 'Müşterilerimiz, telefon veya online form üzerinden talepte bulunabilir. Gerekli durumlarda, hizmet alınacak ürünün fotoğrafı istenerek ön değerlendirme ve fiyatlandırma yapılabilir. Uzman ekibimiz, en geç 2 saat içinde sizinle iletişime geçerek uygun tarih ve saati belirler.'
          },
          {
            step: 2,
            title: ' Ürünlerin Teslim Alımı ve Ek Hizmetler',
            description: 'Belirlenen tarihte halılar, koltuklar veya perdeleriniz adresinizden özenle teslim alınır. İsteğe bağlı olarak, perde veya stor gibi ürünlerin sökme ve takma hizmetleri profesyonel ekiplerimiz tarafından gerçekleştirilir.'
          },
          {
            step: 3,
            title: 'Hijyenik Temizlik Süreci',
            description: 'Teslim alınan ürünler, türüne uygun olarak doğal içerikli ve kaliteli temizlik şampuanlarıyla hijyenik koşullarda özenle yıkanır. Halılarda 8 fırçalı otomatik makineler, koltuklarda vakum ve özel temizlik, perdelerde ise özel yöntemler uygulanır. İnatçı lekeler profesyonel şekilde çıkarılır.'
          },
          {
            step: 4,
            title: 'Kurutma ve Bakım',
            description: 'Temizlik sonrası ürünler, uygun havalandırma sistemleriyle kontrollü şekilde kurutulur. Perdeler ütülenir, koltuklar ve halılar ise kuruma sürecine bırakılır. Kuruma süresi ürünün türüne, kumaşına ve çevre koşullarına bağlıdır.'
          },
          {
            step: 5,
            title: 'Paketleme ve Fiyatlandırma',
            description: 'Kurutma ve bakım tamamlandıktan sonra ürünler hijyenik koşullarda özenle paketlenir. Fiyatlandırma; stor perdelerde metrekare (m²) üzerinden, diğer perdelerde perde sayısı, kir durumu ve yıkama zorluğuna; halı ve koltuklarda ise ürünün cinsi, büyüklüğü ve kir durumuna göre belirlenir.'
          },
          {
            step: 6,
            title: 'Teslimat ve Son Hizmetler',
            description: 'Paketlenen ürünler, belirlenen tarihte adresinize teslim edilir. Talep halinde perde ve storların montaj (takma) işlemleri uzman ekiplerimizce yapılır. Teslimat öncesi ve sonrası müşteriye bilgilendirme sağlanır, memnuniyetiniz önceliğimizdir.'
          }
        ];
    }
  };

  const processSteps = getProcessSteps(service.id);

  const benefits = [
    'Alerjen ve bakterilerin %99\'unu giderir',
    'Kumaşlarınızın ömrünü uzatır',
    'Kokuları kaynağında yok eder',
    'Çocuklar ve evcil hayvanlar için güvenli',
    'Hızlı kuruma teknolojisi',
    '%100 memnuniyet garantisi'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={serviceImages[service.id as keyof typeof serviceImages]}
          alt={service.name}
          loading="eager"
          fetchpriority="high"
          className="w-full h-full object-cover"
          style={{
            aspectRatio: '5/3',
            objectFit: 'cover'
          }}
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <Link
                to="/hizmetler"
                className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Hizmetlere Geri Dön
              </Link>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{service.name}</h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl">
                {service.description}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Service Overview */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Hizmet Genel Bakış</h2>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {service.id === 'hali-yikama' ? 
                    'Halı yıkama hizmetimiz, son teknolojiye sahip 8 fırçalı tam otomatik makineler ile gerçekleştirilmekte, her türlü toz, kir ve lekeye karşı etkili ama nazik bir temizlik sunmaktadır. Kullandığımız kimyasal içermeyen doğal ve yüksek kaliteli şampuanlar, halılarınızın dokusuna ve renklerine zarar vermeden, derinlemesine bir temizlik sağlar.' :
                   service.id === 'koltuk-yikama' ?
                    'Koltuk yıkama hizmetimizde, modern ekipmanlar ve doğaya zarar vermeyen temizlik ürünleri kullanılır. Deneyimli ekibimiz, koltuklarınızı kumaş türüne göre değerlendirerek en uygun temizlik yöntemini uygular.' :
                   service.id === 'yorgan-battaniye' ?
                    'Yorgan & battaniye temizliği hizmetimiz, son teknoloji ekipmanlar ve çevre dostu temizlik çözümleriyle üstün sonuçlar sunar. Uzman ekibimiz, yılların tecrübesiyle en iyi bakım ve hijyeni sağlar.' :
                   service.id === 'yatak-temizligi' ?
                    'Yatak & baza temizliği hizmetimiz, son teknoloji ekipmanlar ve çevre dostu temizlik çözümleri kullanarak üstün sonuçlar sağlar. Uzman ekibimiz yılların tecrübesiyle en iyi hijyen ve bakımı sunar.' :
                   service.id === 'yerinde-hali-yikama' ?
                    'Yerinde halı yıkama hizmetimiz, son teknoloji ekipmanlar ve çevre dostu temizlik çözümleriyle üstün sonuçlar sunar. Uzman ekibimiz, uzun yıllara dayanan deneyimiyle halılarınızı özenle temizler ve korur.' :
                   service.id === 'ofis-temizligi' ?
                    'Ofis & işyeri temizliği hizmetimiz, son teknoloji ekipmanlar ve çevre dostu temizlik çözümleriyle üstün temizlik sağlar. Deneyimli ekibimiz, çalışma alanlarınızı hijyenik ve düzenli hale getirir.' :
                    `${service.name.toLowerCase()} hizmetimiz son teknoloji ekipman ve çevre dostu temizlik çözümleri kullanarak olağanüstü sonuçlar sunar. 10 yılı aşkın deneyimle, sertifikalı teknisyenlerimiz değerli eşyalarınızın hak ettiği bakımı almasını sağlar.`
                  }
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">Profesyonel Hizmet</div>
                    <div className="text-sm text-gray-600">Hizmet Kalitesi</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">4.9/5 Puan</div>
                    <div className="text-sm text-gray-600">Müşteri Değerlendirmeleri</div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* What's Included */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Dahil Olanlar</h2>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Service Gallery */}
            {serviceGalleryImages.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Hizmet Galerisi</h2>
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {serviceGalleryImages.map((image, index) => (
                      <div
                        key={image.id}
                        className="group relative bg-gray-100 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
                        onClick={() => openGalleryLightbox(image, index)}
                      >
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={image.src}
                            alt={image.alt}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
                          
                          {/* Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                              <Eye className="w-6 h-6 text-gray-900" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Image Info */}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                            {image.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {image.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}

            {/* Our Process */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Sürecimiz</h2>
              <div className="space-y-6">
                {processSteps.map((step, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {step.step}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Benefits */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Faydalar</h2>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-primary-600 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Request Service Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Hizmetten Faydalan</h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600 mb-1">Profesyonel Hizmet</div>
                    <div className="text-sm text-gray-600">Ekip arkadaşlarımız size en uygun hizmeti verecek</div>
                  </div>
                  <div className="border-t pt-4">
                    <Link to="/rezervasyon" state={{ selectedService: service.id }}>
                      <Button className="w-full mb-3">
                        Rezervasyon Yap
                      </Button>
                    </Link>
                    <a href="tel:+903123509595">
                      <Button variant="outline" className="w-full">
                        <Phone className="w-4 h-4 mr-2" />
                        Direkt Ara
                      </Button>
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Guarantee Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200"
              >
                <div className="text-center">
                  <Shield className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">%100 Memnuniyet Garantisi</h3>
                  <p className="text-sm text-gray-600">
                    Tamamen memnun değil misiniz? Ek ücret ödemeden sorunu çözmek için geri döneriz.
                  </p>
                </div>
              </motion.div>

              {/* Contact Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Yardıma mı İhtiyacınız Var?</h3>
                <div className="space-y-3">
                  <a
                    href="tel:+903123509595"
                    className="flex items-center space-x-3 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <Phone className="w-4 h-4 text-primary-600" />
                    </div>
                    <span>(0312) 350 95 95</span>
                  </a>
                  <a
                    href="https://wa.me/905332002662"
                    className="flex items-center space-x-3 text-gray-700 hover:text-green-600 transition-colors"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>WhatsApp Sohbet</span>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Lightbox Modal */}
      {selectedGalleryImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeGalleryLightbox}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeGalleryLightbox}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation Buttons */}
            {serviceGalleryImages.length > 1 && (
              <>
                <button
                  onClick={prevGalleryImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-200 z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextGalleryImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-200 z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image */}
            <div className="relative">
              <img
                src={selectedGalleryImage.src}
                alt={selectedGalleryImage.alt}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              
              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <div className="text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-primary-600 px-3 py-1 rounded-full text-sm font-medium">
                      {service.name}
                    </span>
                    <span className="text-sm text-gray-300">
                      {currentGalleryIndex + 1} / {serviceGalleryImages.length}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{selectedGalleryImage.title}</h3>
                  <p className="text-gray-200">{selectedGalleryImage.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ServiceDetail;