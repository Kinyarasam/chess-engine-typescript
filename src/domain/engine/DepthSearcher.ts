import type { Position } from '../game/Position.js';
import type { Move } from '../moves/Move.js';

export interface DepthSearcher {
  findBestMove(position: Position, depth: number): Move | null;
}
