import { describe, expect, it } from 'vitest';
import { Board } from '../../../src/domain/board/Board';
import { Square } from '../../../src/domain/board/Square';
import { Piece } from '../../../src/domain/pieces/Piece';
import { Color } from '../../../src/domain/pieces/Color';
import { PieceType } from '../../../src/domain/pieces/PieceType';
import { Position } from '../../../src/domain/game/Position';
import { Move } from '../../../src/domain/moves/Move';
import { MoveApplier } from '../../../src/domain/moves/MoveApplier';
import { MoveType } from '../../../src/domain/moves/MoveType';
import { CastlingRights } from '../../../src/domain/game/CastlingRights';

describe('MoveApplier', () => {
  it('moves a piece to an empty square', () => {
    const board = new Board();

    const from = Square.fromAlgebraic('e2');
    const to = Square.fromAlgebraic('e4');

    const pawn = new Piece(Color.White, PieceType.Pawn);

    board.setPiece(from, pawn);

    const position = new Position(board);
    const move = new Move(from, to);

    const applier = new MoveApplier();

    applier.apply(position, move);

    expect(board.getPiece(from)).toBeNull();
    expect(board.getPiece(to)).toBe(pawn);
  });

  it('captures a piece on the destination square', () => {
    const board = new Board();

    const from = Square.fromAlgebraic('e4');
    const to = Square.fromAlgebraic('d5');

    const pawn = new Piece(Color.White, PieceType.Pawn);
    const enemy = new Piece(Color.Black, PieceType.Pawn);

    board.setPiece(from, pawn);
    board.setPiece(to, enemy);

    const position = new Position(board);
    const move = new Move(from, to, MoveType.Capture);

    const applier = new MoveApplier();

    applier.apply(position, move);

    expect(board.getPiece(from)).toBeNull();
    expect(board.getPiece(to)).toBe(pawn);
  });

  it('applies a promotion', () => {
    const board = new Board();

    const from = Square.fromAlgebraic('e7');
    const to = Square.fromAlgebraic('e8');

    board.setPiece(from, new Piece(Color.White, PieceType.Pawn));

    const position = new Position(board, Color.White);

    const move = new Move(from, to, MoveType.Promotion, PieceType.Queen);

    const applier = new MoveApplier();

    applier.apply(position, move);

    expect(position.board.getPiece(from)).toBeNull();

    expect(position.board.getPiece(to)).toEqual(
      new Piece(Color.White, PieceType.Queen),
    );
  });

  it('applies an en passant capture', () => {
    const board = new Board();

    const from = Square.fromAlgebraic('e5');
    const to = Square.fromAlgebraic('d6');
    const capturedPawnSquare = Square.fromAlgebraic('d5');

    board.setPiece(from, new Piece(Color.White, PieceType.Pawn));

    board.setPiece(capturedPawnSquare, new Piece(Color.Black, PieceType.Pawn));

    const position = new Position(board, Color.White, CastlingRights.None, to);

    const move = new Move(from, to, MoveType.EnPassant);

    const applier = new MoveApplier();

    applier.apply(position, move);

    expect(position.board.getPiece(from)).toBeNull();
    expect(position.board.getPiece(capturedPawnSquare)).toBeNull();

    expect(position.board.getPiece(to)).toEqual(
      new Piece(Color.White, PieceType.Pawn),
    );
  });

  it('applies king-side castling', () => {
    const board = new Board();

    const kingSquare = Square.fromAlgebraic('e1');
    const rookSquare = Square.fromAlgebraic('h1');
    const destination = Square.fromAlgebraic('g1');
    const rookDestination = Square.fromAlgebraic('f1');

    board.setPiece(kingSquare, new Piece(Color.White, PieceType.King));

    board.setPiece(rookSquare, new Piece(Color.White, PieceType.Rook));

    const position = new Position(board, Color.White);

    const move = new Move(kingSquare, destination, MoveType.CastlingKingSide);

    const applier = new MoveApplier();

    applier.apply(position, move);

    expect(position.board.getPiece(kingSquare)).toBeNull();
    expect(position.board.getPiece(rookSquare)).toBeNull();

    expect(position.board.getPiece(destination)).toEqual(
      new Piece(Color.White, PieceType.King),
    );

    expect(position.board.getPiece(rookDestination)).toEqual(
      new Piece(Color.White, PieceType.Rook),
    );
  });

  it('applies queen-side castling', () => {
    const board = new Board();

    const kingSquare = Square.fromAlgebraic('e1');
    const rookSquare = Square.fromAlgebraic('a1');
    const destination = Square.fromAlgebraic('c1');
    const rookDestination = Square.fromAlgebraic('d1');

    board.setPiece(kingSquare, new Piece(Color.White, PieceType.King));

    board.setPiece(rookSquare, new Piece(Color.White, PieceType.Rook));

    const position = new Position(board, Color.White);

    const move = new Move(kingSquare, destination, MoveType.CastlingQueenSide);

    const applier = new MoveApplier();

    applier.apply(position, move);

    expect(position.board.getPiece(kingSquare)).toBeNull();
    expect(position.board.getPiece(rookSquare)).toBeNull();

    expect(position.board.getPiece(destination)).toEqual(
      new Piece(Color.White, PieceType.King),
    );

    expect(position.board.getPiece(rookDestination)).toEqual(
      new Piece(Color.White, PieceType.Rook),
    );
  });
});
