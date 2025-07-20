import React, { useState } from 'react';
import { motion, Animatepresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Galeri resimlerinin tipini tanımlıyoruz
interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

// Bileşenin alacağı propları tanımlıyoruz
interface ImageGalleryProps {
  images: GalleryImage[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  // Tıklanan resmi ve onun listedeki sırasını tutan state'ler
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Modal (büyük resim) açma fonksiyonu
  const openModal = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  // Modal kapatma fonksiyonu
  const closeModal = () => {
    setSelectedImage(null);
  };

  // Sonraki resme geçme
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Arka plana tıklamayı engeller
    const nextIndex = (currentIndex + 1) % images.length;
    setSelectedImage(images[nextIndex]);
    setCurrentIndex(nextIndex);
  };

  // Önceki resme geçme
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Arka plana tıklamayı engeller
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setSelectedImage(images[prevIndex]);
    setCurrentIndex(prevIndex);
  };

  return (
    <>
      {/* Resimlerin listelendiği Grid Alanı */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            className="aspect-square overflow-hidden rounded-lg shadow-md cursor-pointer"
            onClick={() => openModal(image, index)}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            layoutId={String(image.id)} // Animasyon için kilit nokta!
          >
            <img
              src={}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>

      {/* Tıklandığında Açılan Büyük Resim (Modal) */}
<AnimatePresence mode="sync">
        {selectedImage && (
          <motion.div
            key={selectedImage.id} // Bu doğru, kalmalı.
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Navigasyon Butonları */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
            >
              <ChevronLeft size={32} className="text-white" />
            </button>
            
            {/* Büyüyen Resmin Kendisi */}
            <motion.div
              className="relative max-w-4xl max-h-[80vh] w-auto h-auto shadow-2xl"
              layoutId={String(selectedImage.id)} // Animasyon için kilit nokta!
              onClick={(e) => e.stopPropagation()} // Resme tıklayınca kapanmasını engeller
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="rounded-lg object-contain w-full h-full"
              />
            </motion.div>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
            >
              <ChevronRight size={32} className="text-white" />
            </button>
            
            {/* Kapatma Butonu */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
            >
              <X size={24} className="text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageGallery;
