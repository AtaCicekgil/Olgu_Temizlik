import React from 'react';
import { motion } from 'framer-motion';
import {
  PackageCheck,
  Droplets,
  Wind,
  Package,
  Truck,
  CheckCircle2,
  LucideIcon,
} from 'lucide-react';
import { OrderStatus, ORDER_STEPS, getStepIndex } from '../../types/tracking';

// ─── Icon Map ─────────────────────────────────────────────────────────────────

const STEP_ICONS: Record<OrderStatus, LucideIcon> = {
  alinan: PackageCheck,
  yikamada: Droplets,
  kurutmada: Wind,
  paketlendi: Package,
  hazir: Truck,
  teslim: CheckCircle2,
};

const STATUS_COLORS: Record<'done' | 'current' | 'future', { bg: string; text: string; ring: string; line: string }> = {
  done: {
    bg: 'bg-emerald-500',
    text: 'text-emerald-600',
    ring: 'ring-emerald-100',
    line: 'bg-emerald-400',
  },
  current: {
    bg: 'bg-blue-600',
    text: 'text-blue-600',
    ring: 'ring-blue-100',
    line: 'bg-gray-200',
  },
  future: {
    bg: 'bg-gray-200',
    text: 'text-gray-400',
    ring: 'ring-transparent',
    line: 'bg-gray-200',
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  currentStatus: OrderStatus;
  completedDates: Partial<Record<OrderStatus, string>>;
}

const OrderProgressSteps: React.FC<Props> = ({ currentStatus, completedDates }) => {
  const currentIdx = getStepIndex(currentStatus);

  return (
    <div className="w-full overflow-x-auto pb-1">
      {/* Desktop: Horizontal */}
      <div className="hidden sm:flex items-start relative min-w-0">
        {ORDER_STEPS.map((step, idx) => {
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const state = isDone ? 'done' : isCurrent ? 'current' : 'future';
          const colors = STATUS_COLORS[state];
          const Icon = STEP_ICONS[step.status];
          const date = completedDates[step.status];
          const isLast = idx === ORDER_STEPS.length - 1;

          return (
            <div key={step.status} className="flex items-start flex-1 min-w-0">
              {/* Step + label */}
              <div className="flex flex-col items-center flex-shrink-0 relative z-10">
                {/* Circle */}
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.07, duration: 0.3, ease: 'easeOut' }}
                  className={`relative flex items-center justify-center w-10 h-10 rounded-full ring-4 ${colors.ring} ${colors.bg} transition-all`}
                >
                  {/* Pulsing ring for current step */}
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-blue-500 opacity-30"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                  <Icon
                    className={`w-5 h-5 ${isDone || isCurrent ? 'text-white' : 'text-gray-400'}`}
                  />
                </motion.div>

                {/* Label */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.07 + 0.15 }}
                  className="mt-2 flex flex-col items-center text-center w-16"
                >
                  <span
                    className={`text-[11px] font-semibold leading-tight ${
                      isDone ? 'text-emerald-600' : isCurrent ? 'text-blue-700' : 'text-gray-400'
                    }`}
                  >
                    {step.shortLabel}
                  </span>
                  {date && (
                    <span className="text-[10px] text-gray-400 mt-0.5">
                      {formatShortDate(date)}
                    </span>
                  )}
                </motion.div>
              </div>

              {/* Connecting line */}
              {!isLast && (
                <div className="flex-1 flex items-center mt-5 px-1 min-w-2">
                  <div className="w-full h-0.5 bg-gray-100 rounded-full overflow-hidden">
                    {isDone && (
                      <motion.div
                        className="h-full bg-emerald-400 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ delay: idx * 0.07 + 0.2, duration: 0.4 }}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: Compact horizontal scroll */}
      <div className="flex sm:hidden items-start gap-0 overflow-x-auto no-scrollbar">
        {ORDER_STEPS.map((step, idx) => {
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const state = isDone ? 'done' : isCurrent ? 'current' : 'future';
          const colors = STATUS_COLORS[state];
          const Icon = STEP_ICONS[step.status];
          const isLast = idx === ORDER_STEPS.length - 1;

          return (
            <div key={step.status} className="flex items-center flex-shrink-0">
              {/* Step */}
              <div className="flex flex-col items-center">
                <div
                  className={`relative flex items-center justify-center w-8 h-8 rounded-full ${colors.bg}`}
                >
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-blue-500 opacity-30"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  <Icon
                    className={`w-4 h-4 ${isDone || isCurrent ? 'text-white' : 'text-gray-400'}`}
                  />
                </div>
                <span
                  className={`mt-1 text-[9px] font-semibold text-center w-12 leading-tight ${
                    isDone ? 'text-emerald-600' : isCurrent ? 'text-blue-700' : 'text-gray-400'
                  }`}
                >
                  {step.shortLabel}
                </span>
              </div>

              {/* Line */}
              {!isLast && (
                <div className="w-6 flex items-center mb-4">
                  <div className="w-full h-0.5 bg-gray-100 overflow-hidden">
                    {isDone && (
                      <motion.div
                        className="h-full bg-emerald-400"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ delay: idx * 0.07 + 0.2, duration: 0.4 }}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
}

export default OrderProgressSteps;
