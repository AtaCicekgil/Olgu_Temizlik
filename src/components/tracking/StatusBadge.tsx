import React from 'react';
import { OrderStatus } from '../../types/tracking';

interface Props {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  alinan: {
    label: 'Sipariş Alındı',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    dot: 'bg-sky-500',
  },
  yikamada: {
    label: 'Yıkamada',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
  },
  kurutmada: {
    label: 'Kurutmada',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
  },
  paketlendi: {
    label: 'Paketlendi',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    dot: 'bg-purple-500',
  },
  hazir: {
    label: 'Teslimata Hazır',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
  teslim: {
    label: 'Teslim Edildi',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    dot: 'bg-emerald-600',
  },
};

const isActiveStatus = (s: OrderStatus) =>
  ['alinan', 'yikamada', 'kurutmada', 'paketlendi', 'hazir'].includes(s);

const StatusBadge: React.FC<Props> = ({ status, size = 'md' }) => {
  const cfg = STATUS_CONFIG[status];
  const active = isActiveStatus(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${cfg.bg} ${cfg.text} ${
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'
      }`}
    >
      <span className="relative flex h-2 w-2">
        {active && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${cfg.dot}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${cfg.dot}`} />
      </span>
      {cfg.label}
    </span>
  );
};

export default StatusBadge;
