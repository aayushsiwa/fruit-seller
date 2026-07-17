import { validTargets, validateTransition } from './orders';

describe('Orders Transition Validation', () => {
  describe('validateTransition()', () => {
    it('should return null for identical current and next state', () => {
      expect(validateTransition('PROCESSING', 'PROCESSING')).toBeNull();
      expect(validateTransition('SHIPPED', 'SHIPPED')).toBeNull();
    });

    it('should block transition out of terminal states (DELIVERED, CANCELLED)', () => {
      expect(validateTransition('DELIVERED', 'SHIPPED')).toBe(
        'Cannot change status from "DELIVERED" — it is a terminal state'
      );
      expect(validateTransition('CANCELLED', 'PROCESSING')).toBe(
        'Cannot change status from "CANCELLED" — it is a terminal state'
      );
    });

    it('should block transition back to PROCESSING', () => {
      expect(validateTransition('SHIPPED', 'PROCESSING')).toBe(
        'Cannot revert to PROCESSING'
      );
    });

    it('should allow transition to SHIPPED', () => {
      expect(validateTransition('PROCESSING', 'SHIPPED')).toBeNull();
    });
  });

  describe('validTargets()', () => {
    it('should return correct targets for PROCESSING', () => {
      expect(validTargets('PROCESSING')).toEqual([
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
      ]);
    });

    it('should return correct targets for SHIPPED', () => {
      expect(validTargets('SHIPPED')).toEqual(['DELIVERED', 'CANCELLED']);
    });

    it('should return empty list for terminal states', () => {
      expect(validTargets('DELIVERED')).toEqual([]);
      expect(validTargets('CANCELLED')).toEqual([]);
    });
  });
});
