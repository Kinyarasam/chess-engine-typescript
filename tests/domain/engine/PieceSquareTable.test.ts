import { describe, expect, it } from 'vitest';

import { PIECE_SQUARE_TABLES } from '../../../src/domain/engine/PieceSquareTable.js';
import { PieceType } from '../../../src/domain/pieces/PieceType.js';

describe('PieceSquareTable', () => {
  it('contains a table for every piece type', () => {
    expect(Object.keys(PIECE_SQUARE_TABLES)).toHaveLength(6);

    for (const pieceType of Object.values(PieceType)) {
      expect(PIECE_SQUARE_TABLES[pieceType]).toHaveLength(64);
    }
  });

  it('provides different positional values for different squares', () => {
    const knightTable = PIECE_SQUARE_TABLES[PieceType.Knight];

    expect(knightTable[0]).not.toBe(knightTable[18]);
  });

  it('keeps the king table defined for all 64 squares', () => {
    const kingTable = PIECE_SQUARE_TABLES[PieceType.King];

    expect(kingTable).toHaveLength(64);
  });
});
