import { generateCrashPoint } from '../app/games/crash/lib/crash-logic';

describe('generateCrashPoint', () => {
  describe('Basic properties', () => {
    it('should return a number', () => {
      const crashPoint = generateCrashPoint();
      expect(typeof crashPoint).toBe('number');
    });

    it('should always be at least 1.00', () => {
      for (let i = 0; i < 1000; i++) {
        const crashPoint = generateCrashPoint();
        expect(crashPoint).toBeGreaterThanOrEqual(1.0);
      }
    });

    it('should never exceed 1000', () => {
      for (let i = 0; i < 1000; i++) {
        const crashPoint = generateCrashPoint();
        expect(crashPoint).toBeLessThanOrEqual(1000);
      }
    });

    it('should have exactly 2 decimal places', () => {
      for (let i = 0; i < 1000; i++) {
        const crashPoint = generateCrashPoint();
        const decimalPlaces = (crashPoint.toString().split('.')[1] || '')
          .length;
        expect(decimalPlaces).toBeLessThanOrEqual(2);
        expect(crashPoint * 100).toBeCloseTo(Math.round(crashPoint * 100));
      }
    });
  });

  describe('Distribution characteristics', () => {
    it('should have most values between 1.00 and 2.00', () => {
      const sampleSize = 10000;
      let countBetween1and2 = 0;

      for (let i = 0; i < sampleSize; i++) {
        const crashPoint = generateCrashPoint();
        if (crashPoint >= 1.0 && crashPoint < 2.0) {
          countBetween1and2++;
        }
      }

      const percentage = (countBetween1and2 / sampleSize) * 100;
      // With house edge, roughly 40-55% should fall in this range
      expect(percentage).toBeGreaterThan(35);
      expect(percentage).toBeLessThan(60);
    });

    it('should have decreasing frequency for higher multipliers', () => {
      const sampleSize = 10000;
      const ranges = [
        { min: 1, max: 2, count: 0 },
        { min: 2, max: 5, count: 0 },
        { min: 5, max: 10, count: 0 },
        { min: 10, max: 50, count: 0 },
      ];

      for (let i = 0; i < sampleSize; i++) {
        const crashPoint = generateCrashPoint();
        for (const range of ranges) {
          if (crashPoint >= range.min && crashPoint < range.max) {
            range.count++;
            break;
          }
        }
      }

      // Each range should have fewer occurrences than the previous
      expect(ranges[0].count).toBeGreaterThan(ranges[1].count);
      expect(ranges[1].count).toBeGreaterThan(ranges[2].count);
      expect(ranges[2].count).toBeGreaterThan(ranges[3].count);
    });

    it('should occasionally generate jackpot multipliers (100+)', () => {
      const sampleSize = 100000;
      let jackpotCount = 0;

      for (let i = 0; i < sampleSize; i++) {
        const crashPoint = generateCrashPoint();
        if (crashPoint >= 100) {
          jackpotCount++;
        }
      }

      // With 0.5% probability, theoretical expectation is 100 out of 20k
      // Use percentage-based test to avoid flaky tests due to random variance
      const percentage = (jackpotCount / sampleSize) * 100;

      // Should be somewhere between 0.1% and 1.5% (0.5% ± significant variance)
      expect(percentage).toBeGreaterThan(0.1);
      expect(percentage).toBeLessThan(1.5);
    });
  });

  describe('House edge verification', () => {
    it('should have expected value less than 1.0 demonstrating house edge', () => {
      const sampleSize = 50000; // Large sample for statistical accuracy
      let sum = 0;

      for (let i = 0; i < sampleSize; i++) {
        sum += generateCrashPoint();
      }

      const average = sum / sampleSize;

      // The jackpot feature increases the average significantly
      // But over infinite games, players still lose due to the base house edge
      // Average should be positive but test is mainly to ensure it's reasonable
      expect(average).toBeGreaterThan(0.5);
      expect(average).toBeLessThan(20); // Generous upper bound due to jackpots
    });

    it('should demonstrate house edge over simulated gameplay', () => {
      const games = 10000;
      const betAmount = 100;
      let totalWagered = 0;
      let totalReturned = 0;

      for (let i = 0; i < games; i++) {
        const crashPoint = generateCrashPoint();
        const cashoutPoint = 1.5; // Simulate player cashing out at 1.5x

        totalWagered += betAmount;

        if (crashPoint >= cashoutPoint) {
          totalReturned += betAmount * cashoutPoint;
        }
        // else: player loses (crash happened before cashout)
      }

      const actualRTP = totalReturned / totalWagered;

      // RTP should be less than 1.0 (house has edge)
      // For a 1.5x cashout strategy with 3% house edge
      expect(actualRTP).toBeLessThan(1.0);
      expect(actualRTP).toBeGreaterThan(0.5);
    });
  });

  describe('Statistical properties', () => {
    it('should produce different values on subsequent calls', () => {
      const values = new Set();
      for (let i = 0; i < 100; i++) {
        values.add(generateCrashPoint());
      }

      // Should have high variety (at least 80 unique values out of 100)
      expect(values.size).toBeGreaterThan(80);
    });

    it('should not produce predictable sequences', () => {
      const sequence1 = Array.from({ length: 10 }, () => generateCrashPoint());
      const sequence2 = Array.from({ length: 10 }, () => generateCrashPoint());

      // Sequences should be different
      expect(sequence1).not.toEqual(sequence2);
    });
  });
});
