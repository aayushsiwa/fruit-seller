import { validTargets, validateTransition } from './orders';

describe('Orders Transition Validation', () => {
  describe('validateTransition()', () => {
    it('should return null for identical current and next state', () => {
      expect(validateTransition('Processing', 'Processing')).toBeNull();
      expect(validateTransition('Shipped', 'Shipped')).toBeNull();
    });

    it('should block transition out of terminal states (Delivered, Cancelled)', () => {
      expect(validateTransition('Delivered', 'Shipped')).toBe(
        'Cannot change status from "Delivered" — it is a terminal state'
      );
      expect(validateTransition('Cancelled', 'Processing')).toBe(
        'Cannot change status from "Cancelled" — it is a terminal state'
      );
    });

    it('should block transition back to Processing', () => {
      expect(validateTransition('Shipped', 'Processing')).toBe(
        'Cannot revert to Processing'
      );
    });

    it('should allow transition to Shipped', () => {
      expect(validateTransition('Processing', 'Shipped')).toBeNull();
    });
  });

  describe('validTargets()', () => {
    it('should return correct targets for Processing', () => {
      expect(validTargets('Processing')).toEqual([
        'Shipped',
        'Delivered',
        'Cancelled',
      ]);
    });

    it('should return correct targets for Shipped', () => {
      expect(validTargets('Shipped')).toEqual(['Delivered', 'Cancelled']);
    });

    it('should return empty list for terminal states', () => {
      expect(validTargets('Delivered')).toEqual([]);
      expect(validTargets('Cancelled')).toEqual([]);
    });
  });
});
