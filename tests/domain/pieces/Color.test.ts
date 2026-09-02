import { describe, expect, it } from 'vitest';

import { Color } from '../../../src/domain/pieces/Color';

describe('Color', () => {
  it('defines the two chess colors', () => {
    expect(Color.White).toBe('white');
    expect(Color.Black).toBe('black');
  });
});
