import { OrderStatus } from '@/types/index';

export const STATUS_ORDER: OrderStatus[] = [
  'Processing',
  'Shipped',
  'Delivered',
];

export function validateTransition(
  current: OrderStatus,
  next: OrderStatus
): string | null {
  if (current === next) return null;
  if (current === 'Delivered' || current === 'Cancelled') {
    return `Cannot change status from "${current}" — it is a terminal state`;
  }
  if (next === 'Processing') return 'Cannot revert to Processing';
  if (next === 'Shipped') return null;
  const currentIdx = STATUS_ORDER.indexOf(current);
  const nextIdx = STATUS_ORDER.indexOf(next);
  if (nextIdx >= 0 && nextIdx <= currentIdx) {
    return `Cannot revert from "${current}" to "${next}"`;
  }
  return null;
}

export function validTargets(current: OrderStatus): OrderStatus[] {
  if (current === 'Delivered' || current === 'Cancelled') return [];
  if (current === 'Processing') return ['Shipped', 'Delivered', 'Cancelled'];
  if (current === 'Shipped') return ['Delivered', 'Cancelled'];
  return [];
}
