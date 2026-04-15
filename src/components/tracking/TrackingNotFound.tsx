import React from 'react';
import { motion } from 'framer-motion';
import { SearchX, Phone, HelpCircle, RotateCcw } from 'lucide-react';

interface Props {
  code: string;
  onRetry: () => void;
}

const TrackingNotFound: React.FC<Props> = ({ code, onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-lg mx-auto"
    >
      <div
        className="bg-white rounded-3xl p-8 text-center shadow-xl"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.10)' }}
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-50 flex items-center justify-center"
        >
          <SearchX className="w-10 h-10 text-orange-400" />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-2">Sipariş Bulunamadı</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-1">
            <span className="font-mono font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
              {code}
            </span>{' '}
            kodu ile eşleşen bir sipariş bulunamadı.
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Kodun doğru girildiğini kontrol edin. Kodlar büyük/küçük harfe duyarlı değildir.
          </p>
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.35 }}
          className="mt-6 space-y-2 text-left"
        >
          {[
            { icon: HelpCircle, text: 'Kod siparişiniz verildiğinde SMS ile gönderilmiştir.' },
            { icon: HelpCircle, text: 'Kodu çizikten ya da faturanızdan kontrol edebilirsiniz.' },
          ].map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-start gap-2.5 text-sm text-gray-500">
              <Icon className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
              <span>{text}</span>
            </div>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.35 }}
          className="mt-7 flex flex-col sm:flex-row gap-3"
        >
          <button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm text-white transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #4f6ef7 0%, #7c3aed 100%)' }}
          >
            <RotateCcw className="w-4 h-4" />
            Tekrar Dene
          </button>
          <a
            href="tel:+905001234567"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
          >
            <Phone className="w-4 h-4" />
            Bizi Arayın
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TrackingNotFound;
