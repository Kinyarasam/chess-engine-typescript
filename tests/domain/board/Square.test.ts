import { describe, expect, it } from 'vitest';

import { Square } from '../../../src/domain/board/Square.js';

describe('Square', () => {
  it('creates a square from a valid index', () => {
    const square = Square.fromIndex(28);

    expect(square.index).toBe(28);
  });

  it('rejects negative indexes', () => {
    expect(() => Square.fromIndex(-1)).toThrow(RangeError);
  });

  it('rejects non-integer indexes', () => {
    expect(() => Square.fromIndex(1.5)).toThrow(RangeError);
  });

  it('rejects indexes greater than 63', () => {
    expect(() => Square.fromIndex(64)).toThrow(RangeError);
  });
});

describe('fromAlgebraic', () => {
  it('creates a square from algebraic notation', () => {
    const square = Square.fromAlgebraic('e4');

    expect(square.index).toBe(28);
  });

  it('rejects invalid files', () => {
    expect(() => Square.fromAlgebraic('i4')).toThrow(RangeError);
  });

  it('rejects invalid ranks', () => {
    expect(() => Square.fromAlgebraic('e9')).toThrow(RangeError);
  });

  it('rejects malformed notation', () => {
    expect(() => Square.fromAlgebraic('e')).toThrow(RangeError);
  });
});

describe('toAlgebraic', () => {
  it('converts a square back to algebraic notation', () => {
    const square = Square.fromIndex(28);

    expect(square.toAlgebraic()).toBe('e4');
  });
});

describe('round trip conversion', () => {
  it('preserves every square', () => {
    for (let index = 0; index < 64; index++) {
      const square = Square.fromIndex(index);
      const algebraic = square.toAlgebraic();
      const restored = Square.fromAlgebraic(algebraic);

      expect(restored.index).toBe(index);
    }
  });
});
