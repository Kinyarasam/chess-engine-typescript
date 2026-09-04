import { describe, expect, it } from 'vitest';
import { Board } from '../../../src/domain/board/Board';
import { Square } from '../../../src/domain/board/Square';
import { Piece } from '../../../src/domain/pieces/Piece';
import { Color } from '../../../src/domain/pieces/Color';
import { PieceType } from '../../../src/domain/pieces/PieceType';
import { Position } from '../../../src/domain/game/Position';
import { AttackDetector } from '../../../src/domain/moves/AttackDetector';

describe('AttackDetector', () => {
  it('detects a rook attacking along a rank', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('a1'),
      new Piece(Color.White, PieceType.Rook),
    );

    const position = new Position(board);

    const detector = new AttackDetector();

    expect(
      detector.isSquareAttacked(
        position,
        Square.fromAlgebraic('h1'),
        Color.White,
      ),
    ).toBe(true);
  });

  it('detects a queen attacking along a rank', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('a1'),
      new Piece(Color.White, PieceType.Queen),
    );

    const position = new Position(board);

    const detector = new AttackDetector();

    expect(
      detector.isSquareAttacked(
        position,
        Square.fromAlgebraic('h1'),
        Color.White,
      ),
    ).toBe(true);
  });

  it('does not detect a rook attack through a blocking piece', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('a1'),
      new Piece(Color.White, PieceType.Rook),
    );

    board.setPiece(
      Square.fromAlgebraic('d1'),
      new Piece(Color.White, PieceType.Pawn),
    );

    const position = new Position(board);

    const detector = new AttackDetector();

    expect(
      detector.isSquareAttacked(
        position,
        Square.fromAlgebraic('h1'),
        Color.White,
      ),
    ).toBe(false);
  });

  it('detects a bishop attacking diagonally', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('a1'),
      new Piece(Color.White, PieceType.Bishop),
    );

    const position = new Position(board);
    const detector = new AttackDetector();

    expect(
      detector.isSquareAttacked(
        position,
        Square.fromAlgebraic('h8'),
        Color.White,
      ),
    ).toBe(true);
  });

  it('detects a queen attacking diagonally', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('a1'),
      new Piece(Color.White, PieceType.Queen),
    );

    const position = new Position(board);
    const detector = new AttackDetector();

    expect(
      detector.isSquareAttacked(
        position,
        Square.fromAlgebraic('h8'),
        Color.White,
      ),
    ).toBe(true);
  });

  it('does not detect a bishop attack through a blocking piece', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('a1'),
      new Piece(Color.White, PieceType.Bishop),
    );

    board.setPiece(
      Square.fromAlgebraic('d4'),
      new Piece(Color.Black, PieceType.Pawn),
    );

    const position = new Position(board);
    const detector = new AttackDetector();

    expect(
      detector.isSquareAttacked(
        position,
        Square.fromAlgebraic('h8'),
        Color.White,
      ),
    ).toBe(false);
  });

  it('detects a knight attacking an L-shaped square', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e4'),
      new Piece(Color.White, PieceType.Knight),
    );

    const position = new Position(board);
    const detector = new AttackDetector();

    expect(
      detector.isSquareAttacked(
        position,
        Square.fromAlgebraic('f6'),
        Color.White,
      ),
    ).toBe(true);
  });

  it('does not detect a knight belonging to the other color', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e4'),
      new Piece(Color.Black, PieceType.Knight),
    );

    const position = new Position(board);
    const detector = new AttackDetector();

    expect(
      detector.isSquareAttacked(
        position,
        Square.fromAlgebraic('f6'),
        Color.White,
      ),
    ).toBe(false);
  });

  it('detects a white pawn attacking diagonally', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e5'),
      new Piece(Color.White, PieceType.Pawn),
    );

    const position = new Position(board);
    const detector = new AttackDetector();

    expect(
      detector.isSquareAttacked(
        position,
        Square.fromAlgebraic('d6'),
        Color.White,
      ),
    ).toBe(true);
  });

  it('detects a black pawn attacking diagonally', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e4'),
      new Piece(Color.Black, PieceType.Pawn),
    );

    const position = new Position(board);
    const detector = new AttackDetector();

    expect(
      detector.isSquareAttacked(
        position,
        Square.fromAlgebraic('d3'),
        Color.Black,
      ),
    ).toBe(true);
  });

  it('detects a king attacking an adjacent square', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e4'),
      new Piece(Color.White, PieceType.King),
    );

    const position = new Position(board);
    const detector = new AttackDetector();

    expect(
      detector.isSquareAttacked(
        position,
        Square.fromAlgebraic('f5'),
        Color.White,
      ),
    ).toBe(true);
  });

  it('does not detect a king attacking a non-adjacent square', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e4'),
      new Piece(Color.White, PieceType.King),
    );

    const position = new Position(board);
    const detector = new AttackDetector();

    expect(
      detector.isSquareAttacked(
        position,
        Square.fromAlgebraic('g6'),
        Color.White,
      ),
    ).toBe(false);
  });

  it('detects an attack on an occupied target square', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('a1'),
      new Piece(Color.White, PieceType.Rook),
    );

    board.setPiece(
      Square.fromAlgebraic('h1'),
      new Piece(Color.Black, PieceType.King),
    );

    const position = new Position(board);
    const detector = new AttackDetector();

    expect(
      detector.isSquareAttacked(
        position,
        Square.fromAlgebraic('h1'),
        Color.White,
      ),
    ).toBe(true);
  });
});
