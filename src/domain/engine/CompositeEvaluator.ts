import type { Position } from '../game/Position.js';
import type { Evaluator } from './Evaluator.js';

export class CompositeEvaluator implements Evaluator {
  private readonly evaluators: readonly Evaluator[];

  public constructor(evaluators: readonly Evaluator[]) {
    if (evaluators.length === 0) {
      throw new Error('CompositeEvaluator requires at least one evaluator');
    }

    this.evaluators = evaluators;
  }

  public evaluate(position: Position): number {
    return this.evaluators.reduce(
      (score, evaluator) => score + evaluator.evaluate(position),
      0,
    );
  }
}
