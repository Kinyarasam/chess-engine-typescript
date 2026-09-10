import { describe, expect, it, vi } from 'vitest';

import { Position } from '../../../src/domain/game/Position.js';
import type { Evaluator } from '../../../src/domain/engine/Evaluator.js';
import { CompositeEvaluator } from '../../../src/domain/engine/CompositeEvaluator.js';

describe('CompositeEvaluator', () => {
  it('requires at least one evaluator', () => {
    expect(() => new CompositeEvaluator([])).toThrow(
      'CompositeEvaluator requires at least one evaluator',
    );
  });

  it('returns the score from a single evaluator', () => {
    const evaluator: Evaluator = {
      evaluate: () => 500,
    };

    const composite = new CompositeEvaluator([evaluator]);

    expect(composite.evaluate(new Position())).toBe(500);
  });

  it('combines scores from multiple evaluators', () => {
    const first: Evaluator = {
      evaluate: () => 900,
    };

    const second: Evaluator = {
      evaluate: () => -320,
    };

    const composite = new CompositeEvaluator([first, second]);

    expect(composite.evaluate(new Position())).toBe(580);
  });

  it('evaluates every evaluator exactly once', () => {
    const firstEvaluate = vi.fn(() => 100);
    const secondEvaluate = vi.fn(() => 200);

    const composite = new CompositeEvaluator([
      { evaluate: firstEvaluate },
      { evaluate: secondEvaluate },
    ]);

    const position = new Position();

    expect(composite.evaluate(position)).toBe(300);
    expect(firstEvaluate).toHaveBeenCalledOnce();
    expect(secondEvaluate).toHaveBeenCalledOnce();
    expect(firstEvaluate).toHaveBeenCalledWith(position);
    expect(secondEvaluate).toHaveBeenCalledWith(position);
  });
});
