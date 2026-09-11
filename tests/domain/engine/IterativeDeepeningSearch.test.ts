import { describe, expect, it } from 'vitest';
import { Board } from '../../../src/domain/board/Board.js';
import { Square } from '../../../src/domain/board/Square.js';
import { Color } from '../../../src/domain/pieces/Color.js';
import { Piece } from '../../../src/domain/pieces/Piece.js';
import { PieceType } from '../../../src/domain/pieces/PieceType.js';
import { Position } from '../../../src/domain/game/Position.js';
import { Move } from '../../../src/domain/moves/Move.js';
import { MoveType } from '../../../src/domain/moves/MoveType.js';
import type { DepthSearcher } from '../../../src/domain/engine/DepthSearcher.js';
import { IterativeDeepeningSearch } from '../../../src/domain/engine/IterativeDeepeningSearch.js';

describe('IterativeDeepeningSearch', () => {
  const createPosition = (): Position => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.King),
    );

    return new Position(board, Color.White);
  };

  const createMove = (): Move =>
    new Move(
      Square.fromAlgebraic('e1'),
      Square.fromAlgebraic('e2'),
      MoveType.Normal,
    );

  it('rejects an invalid maximum depth', () => {
    const searcher: DepthSearcher = {
      findBestMove: () => createMove(),
    };

    const search = new IterativeDeepeningSearch(searcher);

    expect(() => search.findBestMove(createPosition(), 0)).toThrow(RangeError);

    expect(() => search.findBestMove(createPosition(), 1.5)).toThrow(
      RangeError,
    );
  });

  it('searches every depth from one through the maximum depth', () => {
    const searchedDepths: number[] = [];

    const searcher: DepthSearcher = {
      findBestMove: (_position, depth) => {
        searchedDepths.push(depth);
        return createMove();
      },
    };

    const search = new IterativeDeepeningSearch(searcher);

    search.findBestMove(createPosition(), 4);

    expect(searchedDepths).toEqual([1, 2, 3, 4]);
  });

  it('returns the result from the deepest completed iteration', () => {
    const moves = [
      new Move(
        Square.fromAlgebraic('e1'),
        Square.fromAlgebraic('e2'),
        MoveType.Normal,
      ),
      new Move(
        Square.fromAlgebraic('e1'),
        Square.fromAlgebraic('f2'),
        MoveType.Normal,
      ),
      new Move(
        Square.fromAlgebraic('e1'),
        Square.fromAlgebraic('d2'),
        MoveType.Normal,
      ),
    ];

    const searcher: DepthSearcher = {
      findBestMove: (_position, depth) => moves[depth - 1] ?? null,
    };

    const search = new IterativeDeepeningSearch(searcher);

    const bestMove = search.findBestMove(createPosition(), 3);

    expect(bestMove).toBe(moves[2]);
  });
});
