import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Lock, Star, PhoneCall } from 'lucide-react';
import { TrackingOrder, SearchState } from '../types/tracking';
import { lookupOrder } from '../services/trackingService';
import TrackingSearchInput from '../components/tracking/TrackingSearchInput';
import TrackingResultCard from '../components/tracking/TrackingResultCard';
import TrackingNotFound from '../components/tracking/TrackingNotFound';
import StagesExplainer from '../components/tracking/StagesExplainer';

// ─── Trust badges ─────────────────────────────────────────────────────────────

const TRUST_BADGES = [
  { icon: Lock,   label: 'Güvenli Sorgulama' },
  { icon: Zap,    label: 'Anlık Sonuç'        },
  { icon: Shield, label: 'Ücretsiz Takip'     },
  { icon: Star,   label: '5 Yıldız Hizmet'    },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

const Tracking: React.FC = () => {
  const [searchState, setSearchState] = useState<SearchState>('idle');
  const [lastCode, setLastCode]       = useState('');
  const [result, setResult]           = useState<TrackingOrder | null>(null);
  const resultRef                     = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback(async (code: string) => {
    setLastCode(code);
    setSearchState('loading');
    setResult(null);

    try {
      const order = await lookupOrder(code);
      if (order) {
        setResult(order);
        setSearchState('found');
        // Smooth scroll to result on mobile
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        setSearchState('not_found');
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } catch {
      setSearchState('not_found');
    }
  }, []);

  const handleNewSearch = useCallback(() => {
    setSearchState('idle');
    setResult(null);
    setLastCode('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const showResult = searchState === 'found' || searchState === 'not_found';

  return (
    <div className="min-h-screen" style={{ background: '#f8faff' }}>

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #020617 0%, #0d1b3e 45%, #1e1b4b 75%, #0d1b3e 100%)',
          minHeight: showResult ? '380px' : '520px',
          transition: 'min-height 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Dot grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          {/* Glow orbs */}
          <div
            className="absolute w-96 h-96 rounded-full -top-20 -left-20 opacity-20"
            style={{ background: 'radial-gradient(circle, #4f6ef7, transparent 70%)' }}
          />
          <div
            className="absolute w-80 h-80 rounded-full -bottom-10 -right-10 opacity-15"
            style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }}
          />
          <div
            className="absolute w-64 h-64 rounded-full top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"
            style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)' }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 pt-14 pb-16 flex flex-col items-center text-center">

          {/* Brand badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{
              background: 'rgba(79,110,247,0.15)',
              border: '1px solid rgba(79,110,247,0.3)',
            }}
          >
            <img src="/logo.webp" alt="" className="w-5 h-5 rounded-sm object-contain" />
            <span className="text-xs font-semibold text-blue-300 tracking-wide">
              Olgu Halı Yıkama &nbsp;·&nbsp; Sipariş Takip Sistemi
            </span>
          </motion.div>

          {/* Headline */}
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key="hero-text"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, delay: 0.05 }}
              >
                <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
                  Halınızın Nerede{' '}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #38bdf8 100%)',
                    }}
                  >
                    Olduğunu Bilin
                  </span>
                </h1>
                <p className="text-blue-200/60 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10">
                  Sipariş numaranızı girerek halınızın hangi aşamada olduğunu anlık olarak takip edin.
                  Hızlı, güvenli ve ücretsiz.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="hero-compact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <p className="text-blue-200/60 text-sm">
                  {searchState === 'found' ? 'Siparişiniz bulundu.' : 'Farklı bir kod deneyin.'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search Input */}
          <div className="w-full max-w-2xl">
            <TrackingSearchInput
              onSearch={handleSearch}
              searchState={searchState}
              initialValue={lastCode}
            />
          </div>

          {/* Trust badges — only show on idle */}
          <AnimatePresence>
            {!showResult && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
              >
                {TRUST_BADGES.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-blue-300/50 text-xs font-medium">
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          RESULT / NOT-FOUND AREA
      ════════════════════════════════════════════════════════════════════════ */}
      <div ref={resultRef} className="relative z-10 -mt-6 pb-8 px-4">
        <AnimatePresence mode="wait">
          {searchState === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto"
            >
              <LoadingCard />
            </motion.div>
          )}

          {searchState === 'found' && result && (
            <TrackingResultCard
              key="result"
              order={result}
              onNewSearch={handleNewSearch}
            />
          )}

          {searchState === 'not_found' && (
            <TrackingNotFound
              key="not-found"
              code={lastCode}
              onRetry={handleNewSearch}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          STAGES EXPLAINER
      ════════════════════════════════════════════════════════════════════════ */}
      <StagesExplainer />

      {/* ═══════════════════════════════════════════════════════════════════════
          CONTACT STRIP
      ════════════════════════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-12 px-4 border-t border-gray-100"
      >
        <div className="max-w-2xl mx-auto text-center">
          <PhoneCall className="w-8 h-8 mx-auto mb-3 text-blue-400" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">Yardıma mı ihtiyacınız var?</h3>
          <p className="text-gray-500 text-sm mb-5">
            Siparişiniz hakkında soru sormak için bizi arayabilir ya da WhatsApp üzerinden ulaşabilirsiniz.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="tel:+905001234567"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all active:scale-95 hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #4f6ef7 0%, #7c3aed 100%)' }}
            >
              <PhoneCall className="w-4 h-4" />
              Hemen Ara
            </a>
            <a
              href="/iletisim"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
            >
              İletişim Sayfası
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

// ─── Loading skeleton ─────────────────────────────────────────────────────────

const LoadingCard: React.FC = () => (
  <div
    className="bg-white rounded-3xl p-6 shadow-xl animate-pulse"
    style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.1)' }}
  >
    {/* Header */}
    <div className="flex items-start justify-between mb-5">
      <div className="space-y-2">
        <div className="h-3 w-24 bg-gray-100 rounded-full" />
        <div className="h-5 w-44 bg-gray-100 rounded-full" />
        <div className="h-3 w-32 bg-gray-100 rounded-full" />
      </div>
      <div className="h-7 w-28 bg-gray-100 rounded-full" />
    </div>

    {/* Progress steps skeleton */}
    <div className="flex items-center gap-2 mb-6">
      {[...Array(6)].map((_, i) => (
        <React.Fragment key={i}>
          <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0" />
          {i < 5 && <div className="flex-1 h-0.5 bg-gray-100" />}
        </React.Fragment>
      ))}
    </div>

    {/* Detail rows */}
    <div className="grid grid-cols-3 gap-3 mb-5">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-1.5">
          <div className="h-3 w-20 bg-gray-100 rounded-full" />
          <div className="h-4 w-28 bg-gray-100 rounded-full" />
        </div>
      ))}
    </div>

    {/* Note block */}
    <div className="h-14 bg-gray-50 rounded-xl" />

    {/* Searching label */}
    <div className="mt-4 text-center">
      <p className="text-sm text-gray-400 font-medium">Sipariş aranıyor…</p>
    </div>
  </div>
);

export default Tracking;
