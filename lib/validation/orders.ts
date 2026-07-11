import { OrderStatus } from '@/types/index';

export const STATUS_ORDER: OrderStatus[] = [
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
];

export function validateTransition(
  current: OrderStatus,
  next: OrderStatus
): string | null {
  if (current === next) return null;
  if (current === 'DELIVERED' || current === 'CANCELLED') {
    return `Cannot change status from "${current}" — it is a terminal state`;
  }
  if (next === 'PROCESSING') return 'Cannot revert to PROCESSING';
  if (next === 'SHIPPED') return null;
  const currentIdx = STATUS_ORDER.indexOf(current);
  const nextIdx = STATUS_ORDER.indexOf(next);
  if (nextIdx >= 0 && nextIdx <= currentIdx) {
    return `Cannot revert from "${current}" to "${next}"`;
  }
  return null;
}

export function validTargets(current: OrderStatus): OrderStatus[] {
  if (current === 'DELIVERED' || current === 'CANCELLED') return [];
  if (current === 'PROCESSING') return ['SHIPPED', 'DELIVERED', 'CANCELLED'];
  if (current === 'SHIPPED') return ['DELIVERED', 'CANCELLED'];
  return [];
}
