import { describe, expect, it } from 'vitest';

describe('Test infrastructure', () => {
  it('runs Typescript tests successfully', () => {
    const engineName = 'chess-engine-typescript';
    expect(engineName).toBe('chess-engine-typescript');
  });
});
