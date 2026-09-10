import { describe, expect, it } from 'vitest';

import { Square } from '../../../src/domain/board/Square.js';
import { Color } from '../../../src/domain/pieces/Color.js';
import { Piece } from '../../../src/domain/pieces/Piece.js';
import { PieceType } from '../../../src/domain/pieces/PieceType.js';
import { Position } from '../../../src/domain/game/Position.js';
import { MaterialEvaluator } from '../../../src/domain/engine/MaterialEvaluator.js';

describe('MaterialEvaluator', () => {
  const evaluator = new MaterialEvaluator();

  it('returns zero for an empty position', () => {
    const position = new Position();

    expect(evaluator.evaluate(position)).toBe(0);
  });

  it('counts white material as positive', () => {
    const position = new Position();

    position.board.setPiece(
      Square.fromAlgebraic('e4'),
      new Piece(Color.White, PieceType.Queen),
    );

    expect(evaluator.evaluate(position)).toBe(900);
  });

  it('counts black material as negative', () => {
    const position = new Position();

    position.board.setPiece(
      Square.fromAlgebraic('e5'),
      new Piece(Color.Black, PieceType.Queen),
    );

    expect(evaluator.evaluate(position)).toBe(-900);
  });

  it('evaluates equal material as zero', () => {
    const position = new Position();

    position.board.setPiece(
      Square.fromAlgebraic('e4'),
      new Piece(Color.White, PieceType.Queen),
    );

    position.board.setPiece(
      Square.fromAlgebraic('e5'),
      new Piece(Color.Black, PieceType.Queen),
    );

    expect(evaluator.evaluate(position)).toBe(0);
  });

  it('evaluates mixed material correctly', () => {
    const position = new Position();

    position.board.setPiece(
      Square.fromAlgebraic('e4'),
      new Piece(Color.White, PieceType.Queen),
    );

    position.board.setPiece(
      Square.fromAlgebraic('f4'),
      new Piece(Color.White, PieceType.Rook),
    );

    position.board.setPiece(
      Square.fromAlgebraic('e5'),
      new Piece(Color.Black, PieceType.Rook),
    );

    position.board.setPiece(
      Square.fromAlgebraic('f5'),
      new Piece(Color.Black, PieceType.Knight),
    );

    expect(evaluator.evaluate(position)).toBe(580);
  });

  it('counts every piece type using its material value', () => {
    const position = new Position();

    position.board.setPiece(
      Square.fromAlgebraic('a1'),
      new Piece(Color.White, PieceType.Pawn),
    );

    position.board.setPiece(
      Square.fromAlgebraic('b1'),
      new Piece(Color.White, PieceType.Knight),
    );

    position.board.setPiece(
      Square.fromAlgebraic('c1'),
      new Piece(Color.White, PieceType.Bishop),
    );

    position.board.setPiece(
      Square.fromAlgebraic('d1'),
      new Piece(Color.White, PieceType.Rook),
    );

    position.board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.Queen),
    );

    position.board.setPiece(
      Square.fromAlgebraic('f1'),
      new Piece(Color.White, PieceType.King),
    );

    expect(evaluator.evaluate(position)).toBe(100 + 320 + 330 + 500 + 900);
  });

  it('handles multiple pieces of the same type', () => {
    const position = new Position();

    position.board.setPiece(
      Square.fromAlgebraic('a2'),
      new Piece(Color.White, PieceType.Pawn),
    );

    position.board.setPiece(
      Square.fromAlgebraic('b2'),
      new Piece(Color.White, PieceType.Pawn),
    );

    position.board.setPiece(
      Square.fromAlgebraic('c2'),
      new Piece(Color.White, PieceType.Pawn),
    );

    expect(evaluator.evaluate(position)).toBe(300);
  });
});
