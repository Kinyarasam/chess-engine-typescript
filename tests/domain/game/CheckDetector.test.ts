import { describe, expect, it } from 'vitest';
import { Board } from '../../../src/domain/board/Board';
import { Square } from '../../../src/domain/board/Square';
import { Piece } from '../../../src/domain/pieces/Piece';
import { Color } from '../../../src/domain/pieces/Color';
import { PieceType } from '../../../src/domain/pieces/PieceType';
import { Position } from '../../../src/domain/game/Position';
import { CheckDetector } from '../../../src/domain/game/CheckDetector';

describe('CheckDetector', () => {
  it('detects a king in check from a rook', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.Rook),
    );

    const position = new Position(board);
    const detector = new CheckDetector();

    expect(detector.isInCheck(position, Color.White)).toBe(true);
  });

  it('does not detect check when the king is not attacked', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('a8'),
      new Piece(Color.Black, PieceType.Rook),
    );

    const position = new Position(board);
    const detector = new CheckDetector();

    expect(detector.isInCheck(position, Color.White)).toBe(false);
  });

  it('detects a king in check from a bishop', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('a5'),
      new Piece(Color.Black, PieceType.Bishop),
    );

    const position = new Position(board);
    const detector = new CheckDetector();

    expect(detector.isInCheck(position, Color.White)).toBe(true);
  });

  it('detects a king in check from a knight', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e4'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('f6'),
      new Piece(Color.Black, PieceType.Knight),
    );

    const position = new Position(board);
    const detector = new CheckDetector();

    expect(detector.isInCheck(position, Color.White)).toBe(true);
  });

  it('detects a king in check from a white pawn', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e4'),
      new Piece(Color.Black, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('d3'),
      new Piece(Color.White, PieceType.Pawn),
    );

    const position = new Position(board);
    const detector = new CheckDetector();

    expect(detector.isInCheck(position, Color.Black)).toBe(true);
  });

  it('detects a king in check from a black pawn', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e5'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('d6'),
      new Piece(Color.Black, PieceType.Pawn),
    );

    const position = new Position(board);
    const detector = new CheckDetector();

    expect(detector.isInCheck(position, Color.White)).toBe(true);
  });

  it('detects a king in check from a queen', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.Queen),
    );

    const position = new Position(board);
    const detector = new CheckDetector();

    expect(detector.isInCheck(position, Color.White)).toBe(true);
  });

  it('does not detect check when the attack is blocked', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.Rook),
    );

    board.setPiece(
      Square.fromAlgebraic('e4'),
      new Piece(Color.White, PieceType.Pawn),
    );

    const position = new Position(board);
    const detector = new CheckDetector();

    expect(detector.isInCheck(position, Color.White)).toBe(false);
  });

  it('detects a king in check from the opposing king', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e4'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('e5'),
      new Piece(Color.Black, PieceType.King),
    );

    const position = new Position(board);
    const detector = new CheckDetector();

    expect(detector.isInCheck(position, Color.White)).toBe(true);
  });
});
