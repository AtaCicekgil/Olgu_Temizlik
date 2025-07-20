import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, Filter } from 'lucide-react';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: 'hali-yikama' | 'koltuk-yikama' | 'perde-temizligi' | 'ozel-hizmetler';
}

const images: GalleryImage[] = [
  // Halı Yıkama Images
  { id: 1, src: '/gallery/hali-yikama/haliyikama.webp', alt: 'Carpet cleaning process', category: 'hali-yikama' },
  { id: 2, src: '/gallery/hali-yikama/haliyikamahero.webp', alt: 'Hero carpet cleaning machine', category: 'hali-yikama' },
  { id: 3, src: '/gallery/hali-yikama/image0.webp', alt: 'Professional carpet washing facility', category: 'hali-yikama' },
  { id: 4, src: '/gallery/hali-yikama/image1.webp', alt: '8-brush automatic washing machine', category: 'hali-yikama' },
  { id: 5, src: '/gallery/hali-yikama/image2.webp', alt: 'Carpet cleaning process', category: 'hali-yikama' },
  { id: 6, src: '/gallery/hali-yikama/image3.webp', alt: 'Carpet drying area', category: 'hali-yikama' },
  { id: 7, src: '/gallery/hali-yikama/image4.webp', alt: 'Deep cleaning equipment', category: 'hali-yikama' },
  { id: 8, src: '/gallery/hali-yikama/image5.webp', alt: 'Professional washing station', category: 'hali-yikama' },
  { id: 9, src: '/gallery/hali-yikama/image6.webp', alt: 'Carpet inspection and sorting', category: 'hali-yikama' },
  { id: 10, src: '/gallery/hali-yikama/image7.webp', alt: 'Stain removal treatment', category: 'hali-yikama' },
  { id: 11, src: '/gallery/hali-yikama/image8.webp', alt: 'Quality control process', category: 'hali-yikama' },
  { id: 12, src: '/gallery/hali-yikama/image9.webp', alt: 'Carpet packaging area', category: 'hali-yikama' },
  { id: 13, src: '/gallery/hali-yikama/image10.webp', alt: 'Hygienic washing process', category: 'hali-yikama' },
  { id: 14, src: '/gallery/hali-yikama/image11.webp', alt: 'Color protection treatment', category: 'hali-yikama' },
  { id: 15, src: '/gallery/hali-yikama/image12.webp', alt: 'Fabric care process', category: 'hali-yikama' },
  { id: 16, src: '/gallery/hali-yikama/image13.webp', alt: 'Professional team at work', category: 'hali-yikama' },
  { id: 17, src: '/gallery/hali-yikama/image14.webp', alt: 'Carpet delivery preparation', category: 'hali-yikama' },
  { id: 18, src: '/gallery/hali-yikama/image15.webp', alt: 'Washing machine operation', category: 'hali-yikama' },
  { id: 19, src: '/gallery/hali-yikama/image16.webp', alt: 'Deep cleaning results', category: 'hali-yikama' },
  { id: 20, src: '/gallery/hali-yikama/image17.webp', alt: 'Professional equipment setup', category: 'hali-yikama' },
  { id: 21, src: '/gallery/hali-yikama/image18.webp', alt: 'Carpet washing facility', category: 'hali-yikama' },
  { id: 22, src: '/gallery/hali-yikama/image19.webp', alt: 'Quality assurance check', category: 'hali-yikama' },
  { id: 23, src: '/gallery/hali-yikama/image20.webp', alt: 'Customer service area', category: 'hali-yikama' },
  { id: 24, src: '/gallery/hali-yikama/image21.webp', alt: 'Professional cleaning team', category: 'hali-yikama' },
  { id: 25, src: '/gallery/hali-yikama/image22.webp', alt: 'Carpet maintenance service', category: 'hali-yikama' },
  { id: 26, src: '/gallery/hali-yikama/image23.webp', alt: 'Modern washing facility', category: 'hali-yikama' },
  { id: 27, src: '/gallery/hali-yikama/image24.webp', alt: 'Eco-friendly cleaning process', category: 'hali-yikama' },
  { id: 28, src: '/gallery/hali-yikama/image25.webp', alt: 'Professional service delivery', category: 'hali-yikama' },
  { id: 29, src: '/gallery/hali-yikama/image26.webp', alt: 'Carpet washing expertise', category: 'hali-yikama' },
  { id: 30, src: '/gallery/hali-yikama/image27.webp', alt: 'Quality cleaning results', category: 'hali-yikama' },
  { id: 31, src: '/gallery/hali-yikama/image28.webp', alt: 'Advanced cleaning technology', category: 'hali-yikama' },
  { id: 32, src: '/gallery/hali-yikama/image29.webp', alt: 'Carpet care specialists', category: 'hali-yikama' },
  { id: 33, src: '/gallery/hali-yikama/image30.webp', alt: 'Professional washing process', category: 'hali-yikama' },
  { id: 34, src: '/gallery/hali-yikama/image31.webp', alt: 'Carpet cleaning excellence', category: 'hali-yikama' },
  { id: 35, src: '/gallery/hali-yikama/image32.webp', alt: 'Expert carpet maintenance', category: 'hali-yikama' },
  { id: 36, src: '/gallery/hali-yikama/image33.webp', alt: 'Premium cleaning service', category: 'hali-yikama' },
  { id: 37, src: '/gallery/hali-yikama/image34.webp', alt: 'Professional carpet washing', category: 'hali-yikama' },
  { id: 38, src: '/gallery/hali-yikama/image35.webp', alt: 'Carpet cleaning innovation', category: 'hali-yikama' },
  { id: 39, src: '/gallery/hali-yikama/image36.webp', alt: 'Deep cleaning technology', category: 'hali-yikama' },
  { id: 40, src: '/gallery/hali-yikama/image37.webp', alt: 'Professional service team', category: 'hali-yikama' },
  { id: 41, src: '/gallery/hali-yikama/image38.webp', alt: 'Carpet care excellence', category: 'hali-yikama' },
  { id: 42, src: '/gallery/hali-yikama/image39.webp', alt: 'Quality cleaning process', category: 'hali-yikama' },
  { id: 43, src: '/gallery/hali-yikama/image40.webp', alt: 'Professional equipment operation', category: 'hali-yikama' },
  { id: 44, src: '/gallery/hali-yikama/image41.webp', alt: 'Carpet washing mastery', category: 'hali-yikama' },
  { id: 45, src: '/gallery/hali-yikama/image42.webp', alt: 'Deep cleaning expertise', category: 'hali-yikama' },
  { id: 46, src: '/gallery/hali-yikama/image43.webp', alt: 'Professional carpet service', category: 'hali-yikama' },
  { id: 47, src: '/gallery/hali-yikama/image44.webp', alt: 'Carpet maintenance excellence', category: 'hali-yikama' },
  { id: 48, src: '/gallery/hali-yikama/image45.webp', alt: 'Quality washing service', category: 'hali-yikama' },
  { id: 49, src: '/gallery/hali-yikama/image46.webp', alt: 'Professional cleaning standards', category: 'hali-yikama' },
  { id: 50, src: '/gallery/hali-yikama/image47.webp', alt: 'Carpet care professionals', category: 'hali-yikama' },
  { id: 51, src: '/gallery/hali-yikama/image48.webp', alt: 'Deep cleaning solutions', category: 'hali-yikama' },
  { id: 52, src: '/gallery/hali-yikama/image49.webp', alt: 'Professional carpet service', category: 'hali-yikama' },
  { id: 53, src: '/gallery/hali-yikama/image50.webp', alt: 'Carpet washing facility', category: 'hali-yikama' },
  { id: 54, src: '/gallery/hali-yikama/image51.webp', alt: 'Quality cleaning expertise', category: 'hali-yikama' },
  { id: 55, src: '/gallery/hali-yikama/image52.webp', alt: 'Professional equipment showcase', category: 'hali-yikama' },
  { id: 56, src: '/gallery/hali-yikama/image53.webp', alt: 'Carpet maintenance specialists', category: 'hali-yikama' },
  { id: 57, src: '/gallery/hali-yikama/image01.webp', alt: 'Professional washing excellence', category: 'hali-yikama' },
  { id: 58, src: '/gallery/hali-yikama/haliyikamahero.webp', alt: 'Hero carpet cleaning', category: 'hali-yikama' },
  
  // Koltuk Yıkama Images
  { id: 59, src: '/gallery/koltuk-yikama/koltukyikama.webp', alt: 'Professional sofa cleaning service', category: 'koltuk-yikama'},
  { id: 60, src: '/gallery/koltuk-yikama/koltuk1.webp', alt: 'Professional sofa cleaning service', category: 'koltuk-yikama'},
  { id: 61, src: '/gallery/koltuk-yikama/koltuk2.webp', alt: 'Upholstery cleaning process', category: 'koltuk-yikama'},
  { id: 62, src: '/gallery/koltuk-yikama/koltuk3.webp', alt: 'Upholstery cleaning process', category: 'koltuk-yikama'},
  { id: 63, src: '/gallery/koltuk-yikama/koltuk4.webp', alt: 'Upholstery cleaning process', category: 'koltuk-yikama'},
  
  // Perde Temizliği Images
  { id: 64, src: '/gallery/perde-temizligi/storyikama.webp', alt: 'Professional curtain and blind cleaning', category: 'perde-temizligi' },
  { id: 65, src: '/gallery/perde-temizligi/stor1.webp', alt: 'Professional curtain and blind cleaning', category: 'perde-temizligi' },
  { id: 66, src: '/gallery/perde-temizligi/stor2.webp', alt: 'Professional curtain and blind cleaning', category: 'perde-temizligi' },
  
  // Özel Hizmetler Images
  { id: 67, src: '/gallery/ozel-hizmetler/lekecikarma.webp', alt: 'Specialized stain removal service', category: 'ozel-hizmetler' }
];

const categories = [
  { id: 'all', name: 'Tümü', count: images.length },
  { id: 'hali-yikama', name: 'Halı Yıkama', count: images.filter(img => img.category === 'hali-yikama').length },
  { id: 'koltuk-yikama', name: 'Koltuk Yıkama', count: images.filter(img => img.category === 'koltuk-yikama').length },
  { id: 'perde-temizligi', name: 'Perde Temizliği', count: images.filter(img => img.category === 'perde-temizligi').length },
  { id: 'ozel-hizmetler', name: 'Özel Hizmetler', count: images.filter(img => img.category === 'ozel-hizmetler').length }
];

export default function SimpleGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  // Filter images based on active category
  const filteredImages = activeCategory === 'all' 
    ? images 
    : images.filter(img => img.category === activeCategory);

  // Close modal when route changes
  useEffect(() => {
    if (location.pathname !== currentPath) {
      setSelectedIndex(null);
      setCurrentPath(location.pathname);
    }
  }, [location.pathname, currentPath]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedIndex !== null) {
      // Store current scroll position
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      
      // Store original styles
      const originalStyles = {
        overflow: document.body.style.overflow,
        position: document.body.style.position,
        width: document.body.style.width,
        top: document.body.style.top,
        left: document.body.style.left
      };
      
      // Prevent scroll and maintain position
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = `-${scrollX}px`;
      
      return () => {
        // Restore original styles
        document.body.style.overflow = originalStyles.overflow;
        document.body.style.position = originalStyles.position;
        document.body.style.width = originalStyles.width;
        document.body.style.top = originalStyles.top;
        document.body.style.left = originalStyles.left;
        
        // Restore scroll position
        window.scrollTo(scrollX, scrollY);
      };
    }
  }, [selectedIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      
      switch (e.key) {
        case 'Escape':
          setSelectedIndex(null);
          break;
        case 'ArrowRight':
          e.preventDefault();
          setSelectedIndex((prev) => (prev! + 1) % filteredImages.length);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setSelectedIndex((prev) => (prev! === 0 ? filteredImages.length - 1 : prev! - 1));
          break;
      }
    };

    if (selectedIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedIndex, filteredImages.length]);

  const closeModal = () => {
    setSelectedIndex(null);
  };

  const nextImage = () => {
    setSelectedIndex((prev) => (prev! + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev! === 0 ? filteredImages.length - 1 : prev! - 1));
  };

  const handleImageLoad = (imageId: number) => {
    setLoadedImages(prev => new Set(prev).add(imageId));
  };

  const handleImageError = (imageId: number) => {
    setImageErrors(prev => new Set(prev).add(imageId));
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setSelectedIndex(null); // Close modal when changing category
  };

  const modal = selectedIndex !== null && (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Image */}
      <img
        src={filteredImages[selectedIndex].src}
        alt={filteredImages[selectedIndex].alt}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '90vw',
          maxHeight: '90vh',
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
          zIndex: 10000
        }}
      />
      
      {/* Close button */}
      <button
        onClick={closeModal}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10001
        }}
      >
        <X size={24} />
      </button>
      
      {/* Previous button */}
      <button
        onClick={prevImage}
        style={{
          position: 'fixed',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10001
        }}
      >
        <ChevronLeft size={32} />
      </button>
      
      {/* Next button */}
      <button
        onClick={nextImage}
        style={{
          position: 'fixed',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10001
        }}
      >
        <ChevronRight size={32} />
      </button>

      {/* Image counter */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          zIndex: 10001
        }}
      >
        {selectedIndex + 1} / {filteredImages.length}
      </div>
    </div>
  );

  return (
    <div className="p-4">
      {/* Filter Buttons */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Kategori Filtresi</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
              <span className="ml-2 text-xs opacity-75">({category.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-4">
        <p className="text-gray-600">
          <span className="font-medium">{filteredImages.length}</span> fotoğraf gösteriliyor
          {activeCategory !== 'all' && (
            <span className="ml-2 text-primary-600">
              - {categories.find(c => c.id === activeCategory)?.name}
            </span>
          )}
        </p>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {filteredImages.map((img, idx) => (
          <div
            key={img.id}
            onClick={() => setSelectedIndex(idx)}
            className="aspect-square overflow-hidden cursor-pointer relative bg-gray-100 rounded-lg group"
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="eager"
              className="w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-200"
              onLoad={() => handleImageLoad(img.id)}
              onError={() => handleImageError(img.id)}
              style={{
                opacity: loadedImages.has(img.id) ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out'
              }}
            />
            {/* Loading placeholder */}
            {!loadedImages.has(img.id) && !imageErrors.has(img.id) && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg">
                <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {/* Error placeholder */}
            {imageErrors.has(img.id) && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-300 rounded-lg">
                <div className="text-gray-500 text-sm">Resim yüklenemedi</div>
              </div>
            )}
            {/* Category badge */}
            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {categories.find(c => c.id === img.category)?.name}
            </div>
          </div>
        ))}
      </div>

      {/* No results message */}
      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">Bu kategoride henüz fotoğraf bulunmuyor.</div>
          <button
            onClick={() => handleCategoryChange('all')}
            className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            Tüm fotoğrafları görüntüle
          </button>
        </div>
      )}

      {/* Render modal using portal */}
      {modal && createPortal(modal, document.body)}
    </div>
  );
}