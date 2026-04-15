import React from 'react';
import { motion } from 'framer-motion';
import { PackageCheck, Droplets, Wind, Package, Truck, CheckCircle2, LucideIcon } from 'lucide-react';
import { OrderStatus, ORDER_STEPS } from '../../types/tracking';

// ─── Icon Map ─────────────────────────────────────────────────────────────────

const ICONS: Record<OrderStatus, LucideIcon> = {
  alinan: PackageCheck,
  yikamada: Droplets,
  kurutmada: Wind,
  paketlendi: Package,
  hazir: Truck,
  teslim: CheckCircle2,
};

const COLORS: Record<
  OrderStatus,
  { from: string; to: string; text: string; num: string }
> = {
  alinan:     { from: '#dbeafe', to: '#eff6ff', text: '#1d4ed8', num: '#3b82f6' },
  yikamada:   { from: '#bfdbfe', to: '#dbeafe', text: '#1e40af', num: '#2563eb' },
  kurutmada:  { from: '#fde68a', to: '#fffbeb', text: '#92400e', num: '#d97706' },
  paketlendi: { from: '#e9d5ff', to: '#faf5ff', text: '#6d28d9', num: '#7c3aed' },
  hazir:      { from: '#a7f3d0', to: '#ecfdf5', text: '#065f46', num: '#059669' },
  teslim:     { from: '#6ee7b7', to: '#ecfdf5', text: '#064e3b', num: '#047857' },
};

// ─── Component ────────────────────────────────────────────────────────────────

const StagesExplainer: React.FC = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{ background: '#eef1ff', color: '#4f6ef7' }}
          >
            Süreç Hakkında
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Halınız Her Adımda Güvende
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
            Siparişiniz teslim alındığı andan evinize ulaşana kadar 6 aşamadan geçer.
            Her aşamada sizi bilgilendiriyoruz.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {ORDER_STEPS.map((step, idx) => {
            const Icon = ICONS[step.status];
            const color = COLORS[step.status];

            return (
              <motion.div
                key={step.status}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06, duration: 0.4 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="relative flex flex-col items-center text-center p-5 rounded-2xl cursor-default"
                style={{
                  background: `linear-gradient(145deg, ${color.from}, ${color.to})`,
                  border: `1px solid ${color.from}`,
                }}
              >
                {/* Step number */}
                <div
                  className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                  style={{ background: color.num }}
                >
                  {idx + 1}
                </div>

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                  style={{ background: 'rgba(255,255,255,0.7)' }}
                >
                  <Icon className="w-6 h-6" style={{ color: color.text }} />
                </div>

                {/* Label */}
                <p
                  className="text-[13px] font-bold leading-tight mb-1"
                  style={{ color: color.text }}
                >
                  {step.label}
                </p>

              </motion.div>
            );
          })}
        </div>

        {/* Bottom note */}
      </div>
    </section>
  );
};

export default StagesExplainer;
