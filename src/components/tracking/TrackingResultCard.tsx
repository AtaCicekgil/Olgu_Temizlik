import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  CalendarCheck,
  Package,
  Hash,
} from 'lucide-react';
import { TrackingOrder } from '../../types/tracking';
import OrderProgressSteps from './OrderProgressSteps';
import StatusBadge from './StatusBadge';

interface Props {
  order: TrackingOrder;
  onNewSearch: () => void;
}

const TrackingResultCard: React.FC<Props> = ({ order, onNewSearch }) => {
  const isDelivered = order.currentStatus === 'teslim';

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
