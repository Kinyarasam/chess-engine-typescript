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
});
