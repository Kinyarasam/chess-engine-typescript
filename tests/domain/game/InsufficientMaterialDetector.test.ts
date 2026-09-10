import { describe, expect, it } from 'vitest';
import { Board } from '../../../src/domain/board/Board.js';
import { Square } from '../../../src/domain/board/Square.js';
import { Color } from '../../../src/domain/pieces/Color.js';
import { Piece } from '../../../src/domain/pieces/Piece.js';
import { PieceType } from '../../../src/domain/pieces/PieceType.js';
import { Position } from '../../../src/domain/game/Position.js';
import { InsufficientMaterialDetector } from '../../../src/domain/game/InsufficientMaterialDetector.js';

describe('InsufficientMaterialDetector', () => {
  const detector = new InsufficientMaterialDetector();

  it('detects king vs king', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.King),
    );

    const position = new Position(board);

    expect(detector.isInsufficientMaterial(position)).toBe(true);
  });

  it('detects king and bishop vs king', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('c1'),
      new Piece(Color.White, PieceType.Bishop),
    );

    board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.King),
    );

    const position = new Position(board);

    expect(detector.isInsufficientMaterial(position)).toBe(true);
  });

  it('detects king and knight vs king', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('c3'),
      new Piece(Color.White, PieceType.Knight),
    );

    board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.King),
    );

    const position = new Position(board);

    expect(detector.isInsufficientMaterial(position)).toBe(true);
  });

  it('detects same-color bishops vs bishops', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('c1'),
      new Piece(Color.White, PieceType.Bishop),
    );

    board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('f8'),
      new Piece(Color.Black, PieceType.Bishop),
    );

    const position = new Position(board);

    expect(detector.isInsufficientMaterial(position)).toBe(true);
  });

  it('does not detect opposite-color bishops as insufficient material', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('c1'),
      new Piece(Color.White, PieceType.Bishop),
    );

    board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('c8'),
      new Piece(Color.Black, PieceType.Bishop),
    );

    const position = new Position(board);

    expect(detector.isInsufficientMaterial(position)).toBe(false);
  });

  it('does not detect material with a rook as insufficient', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('a1'),
      new Piece(Color.White, PieceType.Rook),
    );

    board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.King),
    );

    const position = new Position(board);

    expect(detector.isInsufficientMaterial(position)).toBe(false);
  });
});
