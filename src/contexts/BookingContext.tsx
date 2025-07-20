import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: number; // in minutes
  features: string[];
}

export interface TicketData {
  serviceIds: string[];
  contactInfo: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  preferredTime: string;
  area: string;
  specialInstructions: string;
  urgency: 'normal' | 'urgent' | 'emergency';
}

interface BookingContextType {
  services: Service[];
  currentTicket: TicketData;
  updateTicket: (data: Partial<TicketData>) => void;
  resetTicket: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

const SERVICES: Service[] = [
  {
    id: 'hali-yikama',
    name: 'Halı Yıkama',
    category: 'Halı',
    description: 'Halılarınızdaki derin kir ve lekeleri özel temizlik tekniklerimizle etkili şekilde ortadan kaldırıyoruz.',
    duration: 120,
    features: ['Otomatik makinede yıkama', 'Leke çıkarma', 'Koku giderme', 'Hızlı kuruma']
  },
  {
    id: 'koltuk-yikama',
    name: 'Koltuk Yıkama',
    category: 'Döşeme',
    description: 'Tüm kumaş türleri için nazik ama etkili temizlik',
    duration: 90,
    features: ['Kumaş koruma', 'Renk canlandırma', 'Antibakteriyel temizlik', 'Leke çıkarma']
  },
  {
    id: 'perde-temizligi',
    name: 'Stor ve Perde Yıkama',
    category: 'Perdeler',
    description: 'Stor ve perdeleriniz için özel temizlik hizmeti.',
    duration: 60,
    features: ['Detaylı temizlik', 'Profesyonel ütüleme', 'Çıkarma, Takma', 'Kumaş bakımı']
  },
  {
    id: 'ozel-hizmetler',
    name: 'Özel Hizmetler',
    category: 'Kilimler',
    description: 'Express halı yıkamadan yerinde temizliğe, ipek ve yün gibi değerli halılarda hassas leke çıkarma ile saçak tamirine kadar, halılarınızı en kısa sürede ve en titiz şekilde bakım ve onarım hizmeti sunuyoruz.',
    duration: 180,
    features: ['Express halı yıkama', 'İpek yün ve değerli halılar için leke çıkarma ve bakım hizmeti', 'Saçak tamiri', 'Yerinde halı yıkama hizmeti']
  },
  {
    id: 'yorgan-battaniye',
    name: 'Yorgan & Battaniye Temizliği',
    category: 'Yatak Gereçleri',
    description: 'Yorgan ve battaniyelerinizi profesyonel ekipmanlarla titizlikle yıkıyoruz. Toz, kir ve istenmeyen kokuları derinlemesine temizleyerek uzun süreli ferahlık sağlıyoruz.',
    duration: 150,
    features: ['Nazik yıkama yöntemi', 'Toz ve kir giderme', 'Koku eliminasyonu', 'Ferah temizlik']
  },
  {
    id: 'yatak-temizligi',
    name: 'Yatak & Baza Temizliği',
    description: 'Derin temizlik sürecimiz kir ve tozları gidererek daha sağlıklı uyku sağlar.',
    category: 'Yatak Gereçleri',
    duration: 120,
    features: ['Profesyonel temizlik süreci', 'Alerjen giderme', 'Bakteri temizliği', 'Sağlıklı uyku ortamı']
  },
  {
    id: 'yerinde-hali-yikama',
    name: 'Yerinde Halı Yıkama',
    category: 'Yerinde Hizmet',
    description: 'Büyük veya sabit halılar için ideal! Ekipmanlarımızı lokasyonunuza getirip halılarınızı oldukları yerde temizliyoruz - camiler, salonlar veya büyük odalar için mükemmel.',
    duration: 180,
    features: ['Mobil ekipman', 'Büyük alan temizliği', 'Cami ve salon hizmeti', 'Yerinde profesyonel temizlik']
  },
  {
    id: 'ofis-temizligi',
    name: 'Ofis & İşyeri Temizliği',
    category: 'Ticari Hizmet',
    description: 'Ofisler için kapsamlı temizlik hizmetleri sunuyoruz: halılar, sandalyeler, perdeler, koltuklar ve daha fazlası. İş yerinizi ferah, temiz ve profesyonel tutun.',
    duration: 240,
    features: ['Kapsamlı ofis temizliği', 'Halı ve koltuk temizliği', 'Perde ve stor temizliği', 'Profesyonel çalışma ortamı']
  }
];

const initialTicket: TicketData = {
  serviceIds: [],
  contactInfo: {
    name: '',
    phone: '',
    email: '',
    address: ''
  },
  preferredTime: '',
  area: '',
  specialInstructions: '',
  urgency: 'normal'
};

interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [currentTicket, setCurrentTicket] = useState<TicketData>(initialTicket);

  const updateTicket = (data: Partial<TicketData>) => {
    setCurrentTicket(prev => ({ ...prev, ...data }));
  };

  const resetTicket = () => {
    setCurrentTicket(initialTicket);
  };

  return (
    <BookingContext.Provider value={{
      services: SERVICES,
      currentTicket,
      updateTicket,
      resetTicket
    }}>
      {children}
    </BookingContext.Provider>
  );
};