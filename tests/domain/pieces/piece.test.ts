import { describe, expect, it } from 'vitest';

import { Color } from '../../../src/domain/pieces/Color.js';
import { Piece } from '../../../src/domain/pieces/Piece.js';
import { PieceType } from '../../../src/domain/pieces/PieceType.js';

describe('Piece', () => {
  it('creates a piece with a color and type', () => {
    const piece = new Piece(Color.White, PieceType.Knight);

    expect(piece.color).toBe(Color.White);
    expect(piece.type).toBe(PieceType.Knight);
  });

  it('supports every combination of color and piece type', () => {
    for (const color of Object.values(Color)) {
      for (const type of Object.values(PieceType)) {
        const piece = new Piece(color, type);

        expect(piece.color).toBe(color);
        expect(piece.type).toBe(type);
      }
    }
  });
});
