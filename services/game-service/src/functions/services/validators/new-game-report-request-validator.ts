import {UserService} from "../user-service";
import {inject, injectable} from "inversify";
import {getAllLeadersData} from "../leaders-service";

@injectable()
export class NewGameReportRequestValidator {

    constructor(@inject(UserService) private userService: UserService) {
    }

    async validate(gameReport: GameReportRequest): Promise<boolean> {
        //check that report contains at least 2 players
        if (gameReport.playersResults == null || gameReport.playersResults.length < 2) {
            throw new Error('Report should contain least of 2 players');
        }

        let leaders = getAllLeadersData();
        let winnersCount = 0;
        const validWinConditions = ["Science", "Culture", "Domination", "Religion", "Diplomacy", "Territory", "Score"];

        // find max player score
        let maxPlayerScore = gameReport.playersResults.reduce((acc, player) => Math.max(acc, player.playerScore), Number.MIN_SAFE_INTEGER);

        //check that all players exist and leaders exist
        for (let player of gameReport.playersResults) {
            if (!leaders.find(leader => leader.name === player.playerLeader)) {
                throw new Error(`Leader '${player.playerLeader}' does not exist`);
            }
            if (!await this.userService.isUserExists(player.player)) {
                throw new Error(`Player '${player.player}' does not exist`);
            }

            //check that score should be non-negative and no zero
            if (player.playerScore <= 0) {
                throw new Error(`Player '${player.player}' score should be positive`);
            }

            if (validWinConditions.includes(player.winCondition)) {
                winnersCount++;
            }

            if (player.winCondition == "Score" && player.playerScore != maxPlayerScore) {
                throw new Error(`Player '${player.player}' should have the biggest score to win the game`);
            }
        }

        if (winnersCount != 1) {
            throw new Error('Report should contain exactly 1 winner from' + JSON.stringify(validWinConditions));
        }

        return true;
    }
}