import type { Position } from '../game/Position.js';
import type { Move } from '../moves/Move.js';
import type { DepthSearcher } from './DepthSearcher.js';

export class IterativeDeepeningSearch {
  private readonly search: DepthSearcher;

  public constructor(search: DepthSearcher) {
    this.search = search;
  }

  public findBestMove(position: Position, maxDepth: number): Move | null {
    if (!Number.isInteger(maxDepth) || maxDepth < 1) {
      throw new RangeError(
        `Maximum search depth must be a positive integer: ${maxDepth}`,
      );
    }

    let bestMove: Move | null = null;

    for (let depth = 1; depth <= maxDepth; depth += 1) {
      const move = this.search.findBestMove(position, depth);

      if (move !== null) {
        bestMove = move;
      }
    }

    return bestMove;
  }
}
