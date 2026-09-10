import { describe, expect, it } from 'vitest';
import { Board } from '../../../src/domain/board/Board.js';
import { Piece } from '../../../src/domain/pieces/Piece.js';
import { Color } from '../../../src/domain/pieces/Color.js';
import { PieceType } from '../../../src/domain/pieces/PieceType.js';
import { Position } from '../../../src/domain/game/Position.js';
import { RepetitionTracker } from '../../../src/domain/game/RepetitionTracker.js';
import { Square } from '../../../src/domain/board/Square.js';

describe('RepetitionTracker', () => {
  it('starts with the initial position recorded once', () => {
    const position = createPosition();
    const tracker = new RepetitionTracker(position);

    expect(tracker.getCount(position)).toBe(1);
  });

  it('increments the count when the same position is recorded', () => {
    const position = createPosition();
    const tracker = new RepetitionTracker(position);

    tracker.record(position);
    tracker.record(position);

    expect(tracker.getCount(position)).toBe(3);
  });

  it('does not combine different positions', () => {
    const position = createPosition();
    const differentPosition = createPosition();

    differentPosition.sideToMove = Color.Black;

    const tracker = new RepetitionTracker(position);

    tracker.record(differentPosition);

    expect(tracker.getCount(position)).toBe(1);
    expect(tracker.getCount(differentPosition)).toBe(1);
  });

  it('reports threefold repetition only after the third occurrence', () => {
    const position = createPosition();
    const tracker = new RepetitionTracker(position);

    expect(tracker.isThreefoldRepetition(position)).toBe(false);

    tracker.record(position);

    expect(tracker.isThreefoldRepetition(position)).toBe(false);

    tracker.record(position);

    expect(tracker.isThreefoldRepetition(position)).toBe(true);
  });

  it('ignores halfmove and fullmove counters when tracking repetition', () => {
    const position = createPosition();
    const equivalentPosition = createPosition();

    equivalentPosition.halfmoveClock = 50;
    equivalentPosition.fullmoveNumber = 25;

    const tracker = new RepetitionTracker(position);

    tracker.record(equivalentPosition);

    expect(tracker.getCount(position)).toBe(2);
  });

  it('tracks different piece placements independently', () => {
    const position = createPosition();

    const differentPosition = createPosition();
    differentPosition.board.setPiece(
      square('e4'),
      new Piece(Color.White, PieceType.Pawn),
    );

    const tracker = new RepetitionTracker(position);

    tracker.record(differentPosition);

    expect(tracker.getCount(position)).toBe(1);
    expect(tracker.getCount(differentPosition)).toBe(1);
  });
});

function createPosition(): Position {
  return new Position(new Board());
}

function square(algebraic: string) {
  return Square.fromAlgebraic(algebraic);
}
