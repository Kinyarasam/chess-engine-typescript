import { describe, expect, it } from 'vitest';
import { Position } from '../../../src/domain/game/Position';
import { Board } from '../../../src/domain/board/Board';
import { Square } from '../../../src/domain/board/Square';
import { Piece } from '../../../src/domain/pieces/Piece';
import { Color } from '../../../src/domain/pieces/Color';
import { PieceType } from '../../../src/domain/pieces/PieceType';
import { Move } from '../../../src/domain/moves/Move';
import { Game } from '../../../src/domain/game/Game';

describe('Game', () => {
  it('creates a game with a position', () => {
    const position = new Position();
    const game = new Game(position);

    expect(game.getPosition()).toBe(position);
  });

  it('plays a legal move', () => {
    const board = new Board();
    
const e1 = Square.fromAlgebraic('e1');
const e2 = Square.fromAlgebraic('e2');
const e4 = Square.fromAlgebraic('e4');
const e8 = Square.fromAlgebraic('e8');

board.setPiece(
  e1,
  new Piece(Color.White, PieceType.King),
);

board.setPiece(
  e2,
  new Piece(Color.White, PieceType.Pawn),
);

board.setPiece(
  e8,
  new Piece(Color.Black, PieceType.King),
);
    const position = new Position(board);
    const game = new Game(position);

    const move = new Move(e2, e4);

    game.play(move);

    expect(board.getPiece(e2)).toBeNull();
    expect(board.getPiece(e4)).toEqual(new Piece(Color.White, PieceType.Pawn));
  });

  it('rejects an illegal move', () => {
    const board = new Board();
    const e2 = Square.fromAlgebraic('e2');
    const e5 = Square.fromAlgebraic('e5');

    board.setPiece(e2, new Piece(Color.White, PieceType.Pawn));

    const position = new Position(board);
    const game = new Game(position);

    const move = new Move(e2, e5);

    expect(() => game.play(move)).toThrow();
  });

  it('records played moves in history', () => {
    const board = new Board();
   
const e1 = Square.fromAlgebraic('e1');
const e2 = Square.fromAlgebraic('e2');
const e4 = Square.fromAlgebraic('e4');
const e8 = Square.fromAlgebraic('e8');

board.setPiece(
  e1,
  new Piece(Color.White, PieceType.King),
);

board.setPiece(
  e2,
  new Piece(Color.White, PieceType.Pawn),
);

board.setPiece(
  e8,
  new Piece(Color.Black, PieceType.King),
);

    const position = new Position(board);
    const game = new Game(position);

    const move = new Move(e2, e4);

    game.play(move);

    expect(game.getHistory()).toEqual([move]);
  });

  it('changes the side to move after a legal move', () => {
    const board = new Board();
    
const e1 = Square.fromAlgebraic('e1');
const e2 = Square.fromAlgebraic('e2');
const e4 = Square.fromAlgebraic('e4');
const e8 = Square.fromAlgebraic('e8');

board.setPiece(
  e1,
  new Piece(Color.White, PieceType.King),
);

board.setPiece(
  e2,
  new Piece(Color.White, PieceType.Pawn),
);

board.setPiece(
  e8,
  new Piece(Color.Black, PieceType.King),
);

    const position = new Position(board);
    const game = new Game(position);

    game.play(new Move(e2, e4));

    expect(position.sideToMove).toBe(Color.Black);
  });
});
