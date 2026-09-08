import { Move } from "../moves/Move.js";
import { MoveApplier } from "../moves/MoveApplier.js";
import { MoveValidator } from "../moves/MoveValidator.js";
import { Color } from "../pieces/Color.js";
import { Position } from "./Position.js";

export class Game {
    private readonly moveValidator: MoveValidator;
    private readonly moveApplier: MoveApplier;
    private readonly history: Move[];

    public readonly position: Position;

    public constructor(
        position: Position = new Position(),
        moveValidator: MoveValidator = new MoveValidator(),
        moveApplier: MoveApplier = new MoveApplier(),
    ) {
        this.position = position;
        this.moveApplier = moveApplier;
        this.moveValidator = moveValidator;
        this.history = [];
    }

    public play(move: Move): void {
        if (!this.moveValidator.isLegal(this.position, move)) {
            throw new Error(
                `Illegal move: ${move.from.toAlgebraic()}-${move.to.toAlgebraic()}`,
            );
        }

        this.moveApplier.apply(this.position, move);

        this.position.sideToMove = 
            this.position.sideToMove === Color.White
                ? Color.Black
                : Color.White;

        this.history.push(move);
    }

    public getPosition(): Position {
        return this.position;
    }

    public getHistory(): readonly Move[] {
        return this.history;
    }
}