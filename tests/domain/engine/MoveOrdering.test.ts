import { describe, expect, it } from 'vitest';

import { Board } from '../../../src/domain/board/Board.js';
import { Square } from '../../../src/domain/board/Square.js';
import { Position } from '../../../src/domain/game/Position.js';
import { Move } from '../../../src/domain/moves/Move.js';
import { MoveType } from '../../../src/domain/moves/MoveType.js';
import { Color } from '../../../src/domain/pieces/Color.js';
import { Piece } from '../../../src/domain/pieces/Piece.js';
import { PieceType } from '../../../src/domain/pieces/PieceType.js';
import { MoveOrdering } from '../../../src/domain/engine/MoveOrdering.js';

describe('MoveOrdering', () => {
  it('prioritizes captures over quiet moves', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('d1'),
      new Piece(Color.White, PieceType.Queen),
    );

    board.setPiece(
      Square.fromAlgebraic('d8'),
      new Piece(Color.Black, PieceType.Rook),
    );

    const position = new Position(board, Color.White);

    const quietMove = new Move(
      Square.fromAlgebraic('e1'),
      Square.fromAlgebraic('f1'),
      MoveType.Normal,
    );

    const captureMove = new Move(
      Square.fromAlgebraic('d1'),
      Square.fromAlgebraic('d8'),
      MoveType.Capture,
    );

    const ordering = new MoveOrdering();

    const ordered = ordering.order(position, [quietMove, captureMove]);

    expect(ordered[0]).toBe(captureMove);
    expect(ordered[1]).toBe(quietMove);
  });

  it('prioritizes promotions over captures', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('a7'),
      new Piece(Color.White, PieceType.Pawn),
    );

    board.setPiece(
      Square.fromAlgebraic('d1'),
      new Piece(Color.White, PieceType.Queen),
    );

    board.setPiece(
      Square.fromAlgebraic('d8'),
      new Piece(Color.Black, PieceType.Rook),
    );

    const position = new Position(board, Color.White);

    const captureMove = new Move(
      Square.fromAlgebraic('d1'),
      Square.fromAlgebraic('d8'),
      MoveType.Capture,
    );

    const promotionMove = new Move(
      Square.fromAlgebraic('a7'),
      Square.fromAlgebraic('a8'),
      MoveType.Promotion,
      PieceType.Queen,
    );

    const ordering = new MoveOrdering();

    const ordered = ordering.order(position, [captureMove, promotionMove]);

    expect(ordered[0]).toBe(promotionMove);
    expect(ordered[1]).toBe(captureMove);
  });
});
