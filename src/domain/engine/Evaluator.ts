import type { Position } from '../game/Position.js';

export interface Evaluator {
  evaluate(position: Position): number;
}
