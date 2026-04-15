import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  CalendarCheck,
  Package,
  Hash,
  MessageSquare,
  Clock,
  CheckCheck,
} from 'lucide-react';
import { TrackingOrder, ORDER_STEPS, getStepIndex } from '../../types/tracking';
import OrderProgressSteps from './OrderProgressSteps';
import StatusBadge from './StatusBadge';

interface Props {
  order: TrackingOrder;
  onNewSearch: () => void;
}

const TrackingResultCard: React.FC<Props> = ({ order, onNewSearch }) => {
  const isDelivered = order.currentStatus === 'teslim';
  const currentStepMeta = ORDER_STEPS[getStepIndex(order.currentStatus)];

  // Build completedDates map from history
  const completedDates = Object.fromEntries(
    order.history.map((h) => [h.status, h.timestamp])
  ) as Partial<Record<string, string>>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* ── Main Card ── */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)' }}>

        {/* Card Header */}
        <div
          className="px-6 pt-6 pb-5"
          style={{
            background: isDelivered
              ? 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)'
              : 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
          }}
        >
          {/* Top row */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs text-white/40 font-medium uppercase tracking-widest mb-1">
                Sipariş Takibi
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <Hash className="w-4 h-4 text-white/40 flex-shrink-0" />
                <span className="text-white font-mono font-bold text-lg tracking-wider">
                  {order.trackingCode}
                </span>
              </div>
              <p className="text-white/50 text-sm mt-1">
                {order.customerName} &nbsp;·&nbsp; {order.itemCount} ürün
              </p>
            </div>
            <StatusBadge status={order.currentStatus} />
          </div>

          {/* Current step description */}
          {currentStepMeta && (
            <div
              className="mt-4 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <p className="text-white/80">{currentStepMeta.description}</p>
            </div>
          )}
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-6 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Süreç Aşamaları
          </p>
          <OrderProgressSteps
            currentStatus={order.currentStatus}
            completedDates={completedDates as any}
          />
        </div>

        {/* Detail Grid */}
        <div className="px-6 py-5 grid grid-cols-2 gap-3 border-b border-gray-100 sm:grid-cols-3">
          <DetailCell
            icon={<Calendar className="w-4 h-4" />}
            label="Teslim Alınma"
            value={formatDate(order.receivedAt)}
          />
          <DetailCell
            icon={<CalendarCheck className="w-4 h-4" />}
            label={isDelivered ? 'Teslim Tarihi' : 'Tahmini Teslim'}
            value={
              isDelivered
                ? formatDate(order.history.find((h) => h.status === 'teslim')?.timestamp ?? order.estimatedDelivery)
                : formatDate(order.estimatedDelivery)
            }
            highlight={isDelivered}
          />
          <DetailCell
            icon={<Package className="w-4 h-4" />}
            label="Ürün Sayısı"
            value={`${order.itemCount} adet halı`}
          />
        </div>

        {/* Item Descriptions */}
        {order.itemDescriptions.length > 0 && (
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Ürünler
            </p>
            <ul className="space-y-1.5">
              {order.itemDescriptions.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Latest Note */}
        {order.latestNote && (
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex gap-3 p-4 rounded-xl bg-blue-50/60 border border-blue-100">
              <MessageSquare className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-blue-600 mb-1">Son Güncelleme</p>
                <p className="text-sm text-gray-700 leading-relaxed">{order.latestNote}</p>
              </div>
            </div>
          </div>
        )}

        {/* Event Timeline */}
        <div className="px-6 py-5 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Etkinlik Geçmişi
          </p>
          <ol className="relative space-y-0">
            {[...order.history].reverse().map((event, idx, arr) => {
              const stepMeta = ORDER_STEPS.find((s) => s.status === event.status);
              const isFirst = idx === 0;
              const isLast = idx === arr.length - 1;
              return (
                <motion.li
                  key={`${event.status}-${idx}`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06, duration: 0.3 }}
                  className="relative flex gap-4 pb-4 last:pb-0"
                >
                  {/* Timeline line */}
                  {!isLast && (
                    <div className="absolute left-3.5 top-7 bottom-0 w-px bg-gray-100" />
                  )}

                  {/* Dot */}
                  <div
                    className={`relative z-10 flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full mt-0.5 ${
                      isFirst
                        ? 'bg-blue-100 ring-2 ring-blue-200'
                        : 'bg-gray-100'
                    }`}
                  >
                    {isFirst ? (
                      <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
                    ) : (
                      <Clock className="w-3 h-3 text-gray-400" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className={`text-sm font-semibold ${isFirst ? 'text-blue-700' : 'text-gray-700'}`}>
                        {stepMeta?.label ?? event.status}
                      </span>
                      <span className="text-xs text-gray-400">{formatDateTime(event.timestamp)}</span>
                    </div>
                    {event.note && (
                      <p className="mt-1 text-xs text-gray-500 leading-relaxed">{event.note}</p>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 flex items-center justify-between bg-gray-50/50 flex-wrap gap-3">
          <p className="text-xs text-gray-400">
            Son güncelleme: {order.history.length > 0
              ? formatDateTime(order.history[order.history.length - 1].timestamp)
              : '—'}
          </p>
          <button
            onClick={onNewSearch}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1.5 group"
          >
            ← Yeni Sorgulama Yap
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface DetailCellProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}

const DetailCell: React.FC<DetailCellProps> = ({ icon, label, value, highlight }) => (
  <div className="flex flex-col gap-1">
    <div className={`flex items-center gap-1.5 text-xs font-medium ${highlight ? 'text-emerald-600' : 'text-gray-400'}`}>
      <span className={highlight ? 'text-emerald-500' : 'text-gray-400'}>{icon}</span>
      {label}
    </div>
    <p className={`text-sm font-semibold ${highlight ? 'text-emerald-700' : 'text-gray-800'}`}>
      {value}
    </p>
  </div>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default TrackingResultCard;
