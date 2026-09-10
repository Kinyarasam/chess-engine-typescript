import { describe, expect, it } from 'vitest';
import { Move } from '../../../src/domain/moves/Move';
import { MoveType } from '../../../src/domain/moves/MoveType';
import { Color } from '../../../src/domain/pieces/Color';
import { Piece } from '../../../src/domain/pieces/Piece';
import { PieceType } from '../../../src/domain/pieces/PieceType';
import { Square } from '../../../src/domain/board/Square';
import { CastlingRights } from '../../../src/domain/game/CastlingRights';
import { Position } from '../../../src/domain/game/Position';
import { PositionTransition } from '../../../src/domain/game/PositionTransition';
import { Board } from '../../../src/domain/board/Board';

describe('PositionTransition', () => {
  it('changes the side to move after a white move', () => {
    const position = createPosition();
    const transition = new PositionTransition();

    const move = new Move(square('e2'), square('e4'), MoveType.Normal);

    transition.apply(position, move);

    expect(position.sideToMove).toBe(Color.Black);
  });

  it('increments the fullmove number after a black move', () => {
    const position = createPosition(Color.Black, 1);

    position.board.setPiece(
      square('e7'),
      new Piece(Color.Black, PieceType.Pawn),
    );

    const transition = new PositionTransition();

    const move = new Move(square('e7'), square('e5'), MoveType.Normal);

    transition.apply(position, move);

    expect(position.fullmoveNumber).toBe(2);
    expect(position.sideToMove).toBe(Color.White);
  });

  it('sets the en passant square after a pawn double push', () => {
    const position = createPosition();

    const transition = new PositionTransition();

    const move = new Move(square('e2'), square('e4'), MoveType.Normal);

    transition.apply(position, move);

    expect(position.enPassantSquare?.toAlgebraic()).toBe('e3');
  });

  it('clears the en passant square after a non-double-pawn move', () => {
    const position = createPosition(Color.White, 1, square('e3'));

    position.board.setPiece(
      square('g1'),
      new Piece(Color.White, PieceType.Knight),
    );

    const transition = new PositionTransition();

    const move = new Move(square('g1'), square('f3'), MoveType.Normal);

    transition.apply(position, move);

    expect(position.enPassantSquare).toBeNull();
  });

  it('resets the halfmove clock after a pawn move', () => {
    const position = createPosition(Color.White, 12);

    const transition = new PositionTransition();

    const move = new Move(square('e2'), square('e4'), MoveType.Normal);

    transition.apply(position, move);

    expect(position.halfmoveClock).toBe(0);
  });

  it('resets the halfmove clock after a capture', () => {
    const position = createPosition(Color.White, 12);

    position.board.setPiece(
      square('d5'),
      new Piece(Color.Black, PieceType.Pawn),
    );

    const transition = new PositionTransition();

    const move = new Move(square('e4'), square('d5'), MoveType.Capture);

    position.board.setPiece(
      square('e4'),
      new Piece(Color.White, PieceType.Pawn),
    );

    transition.apply(position, move);

    expect(position.halfmoveClock).toBe(0);
  });

  it('increments the halfmove clock after a quiet piece move', () => {
    const position = createPosition(Color.White, 12);

    position.board.setPiece(
      square('g1'),
      new Piece(Color.White, PieceType.Knight),
    );

    const transition = new PositionTransition();

    const move = new Move(square('g1'), square('f3'), MoveType.Normal);

    transition.apply(position, move);

    expect(position.halfmoveClock).toBe(13);
  });

  it('removes both white castling rights when the king moves', () => {
    const position = createPosition(
      Color.White,
      0,
      null,
      CastlingRights.WhiteKingSide | CastlingRights.WhiteQueenSide,
    );

    position.board.setPiece(
      square('e1'),
      new Piece(Color.White, PieceType.King),
    );

    const transition = new PositionTransition();

    const move = new Move(square('e1'), square('f1'), MoveType.Normal);

    transition.apply(position, move);

    expect(position.castlingRights).toBe(CastlingRights.None);
  });

  it('removes the correct castling right when a rook moves', () => {
    const position = createPosition(
      Color.White,
      0,
      null,
      CastlingRights.WhiteKingSide | CastlingRights.WhiteQueenSide,
    );

    position.board.setPiece(
      square('h1'),
      new Piece(Color.White, PieceType.Rook),
    );

    const transition = new PositionTransition();

    const move = new Move(square('h1'), square('g1'), MoveType.Normal);

    transition.apply(position, move);

    expect(position.castlingRights).toBe(CastlingRights.WhiteQueenSide);
  });

  it('removes the castling right when a rook is captured', () => {
    const position = createPosition(
      Color.White,
      0,
      null,
      CastlingRights.WhiteQueenSide,
    );

    position.board.setPiece(
      square('e4'),
      new Piece(Color.White, PieceType.Bishop),
    );

    position.board.setPiece(
      square('a1'),
      new Piece(Color.Black, PieceType.Rook),
    );

    const transition = new PositionTransition();

    const move = new Move(square('e4'), square('a1'), MoveType.Capture);

    transition.apply(position, move);

    expect(position.castlingRights).toBe(CastlingRights.None);
  });

  it('detects the captured pawn during en passant', () => {
    const position = createPosition(Color.White, 4, square('d6'));

    position.board.setPiece(
      square('e5'),
      new Piece(Color.White, PieceType.Pawn),
    );

    position.board.setPiece(
      square('d5'),
      new Piece(Color.Black, PieceType.Pawn),
    );

    const transition = new PositionTransition();

    const move = new Move(square('e5'), square('d6'), MoveType.EnPassant);

    transition.apply(position, move);

    expect(position.halfmoveClock).toBe(0);
    expect(position.board.getPiece(square('d5'))).toBeNull();
    expect(position.board.getPiece(square('d6'))?.type).toBe(PieceType.Pawn);
  });
});

function square(value: string): Square {
  return Square.fromAlgebraic(value);
}

function createPosition(
  sideToMove: Color = Color.White,
  halfmoveClock = 0,
  enPassantSquare: Square | null = null,
  castlingRights: CastlingRights = CastlingRights.None,
): Position {
  const board = new Board();

  board.setPiece(square('e2'), new Piece(Color.White, PieceType.Pawn));

  return new Position(
    board,
    sideToMove,
    castlingRights,
    enPassantSquare,
    halfmoveClock,
    1,
  );
}
