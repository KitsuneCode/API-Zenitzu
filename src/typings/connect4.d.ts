interface solution {
    column: number;
    spacesFromBottom: number;
}

interface status {
    movesPlayed: number
    currentPlayer: number
    gameOver: boolean
    winner: number | void
    solution: solution[];
}

declare module 'connect4-ai' {

    class Connect4 {

        jugadores: string[];
        play(play: number): void;
        gameStatus(): status
        ascii(): string;
        canPlay(number: number): boolean
        playAI(play: string): void
        solution: solution[] | null
        winner: number | null

    }

    class Connect4AI extends Connect4 {

        playAI(play: string): void

    }

}