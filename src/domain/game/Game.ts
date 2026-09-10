import { Position } from './Position.js';
import { Move } from '../moves/Move.js';
import { MoveValidator } from '../moves/MoveValidator.js';
import { RepetitionTracker } from './RepetitionTracker.js';
import { GameStatusDetector } from './GameStatusDetector.js';
import { GameStatus } from './GameStatus.js';
import { PositionTransition } from './PositionTransition.js';

export class Game {
  private readonly moveValidator: MoveValidator;
  private readonly positionTransition: PositionTransition;
  private readonly history: Move[];
  private readonly repetitionTracker: RepetitionTracker;
  private readonly gameStatusDetector: GameStatusDetector;

  public readonly position: Position;

  public constructor(
    position: Position = new Position(),
    moveValidator: MoveValidator = new MoveValidator(),
    positionTransition: PositionTransition = new PositionTransition(),
  ) {
    this.position = position;
    this.moveValidator = moveValidator;
    this.positionTransition = positionTransition;
    this.repetitionTracker = new RepetitionTracker(this.position);
    this.gameStatusDetector = new GameStatusDetector();
    this.history = [];
  }

  public play(move: Move): void {
    const status = this.getStatus();

    if (status === GameStatus.Checkmate || status === GameStatus.Stalemate) {
      throw new Error(`Cannot play move: game is ${status}`);
    }

    if (!this.moveValidator.isLegal(this.position, move)) {
      throw new Error(
        `Illegal move: ${move.from.toAlgebraic()}-${move.to.toAlgebraic()}`,
      );
    }

    this.positionTransition.apply(this.position, move);

    this.repetitionTracker.record(this.position);
    this.history.push(move);
  }

  public getPosition(): Position {
    return this.position;
  }

  public getHistory(): readonly Move[] {
    return this.history;
  }

  public getStatus(): GameStatus {
    return this.gameStatusDetector.getStatus(
      this.position,
      this.repetitionTracker.getCount(this.position),
    );
  }

  public isThreefoldRepetition(): boolean {
    return this.repetitionTracker.isThreefoldRepetition(this.position);
  }
}
