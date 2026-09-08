import { describe, expect, it } from 'vitest';
import { Board } from '../../../src/domain/board/Board';
import { Square } from '../../../src/domain/board/Square';
import { Piece } from '../../../src/domain/pieces/Piece';
import { Color } from '../../../src/domain/pieces/Color';
import { PieceType } from '../../../src/domain/pieces/PieceType';
import { Position } from '../../../src/domain/game/Position';
import { LegalMoveGenerator } from '../../../src/domain/moves/LegalMoveGenerator';

describe('LegalMoveGenerator', () => {
  it('excludes moves that expose the king to check', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('a8'),
      new Piece(Color.Black, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('e2'),
      new Piece(Color.White, PieceType.Rook),
    );

    board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.Rook),
    );

    const position = new Position(board, Color.White);

    const generator = new LegalMoveGenerator();

    const moves = generator.generateMoves(position);

    expect(
      moves.some(
        (move) =>
          move.from.toAlgebraic() === 'e2' && move.to.toAlgebraic() === 'a2',
      ),
    ).toBe(false);
  });

  it('generates no legal moves in a checkmate position', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('h1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('f2'),
      new Piece(Color.Black, PieceType.Queen),
    );

    board.setPiece(
      Square.fromAlgebraic('g2'),
      new Piece(Color.Black, PieceType.King),
    );

    const position = new Position(board, Color.White);

    const generator = new LegalMoveGenerator();

    const moves = generator.generateMoves(position);

    expect(moves).toHaveLength(0);
  });

  it('generates no legal moves in a stalemate position', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('h1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('f2'),
      new Piece(Color.Black, PieceType.Queen),
    );

    board.setPiece(
      Square.fromAlgebraic('g3'),
      new Piece(Color.Black, PieceType.King),
    );

    const position = new Position(board, Color.White);

    const generator = new LegalMoveGenerator();

    const moves = generator.generateMoves(position);

    expect(moves).toHaveLength(0);
  });
});
