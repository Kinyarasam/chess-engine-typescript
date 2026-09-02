import { describe, expect, it } from 'vitest';

import { PieceType } from '../../../src/domain/pieces/PieceType';

describe('PieceType', () => {
  it('defines the six chess piece types', () => {
    expect(Object.values(PieceType)).toHaveLength(6);

    expect(Object.values(PieceType)).toEqual([
      'pawn',
      'rook',
      'knight',
      'bishop',
      'queen',
      'king',
    ]);
  });
});
