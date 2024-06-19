export class NewGameReportRequestValidator {

    validate(gameReport: NewGameReportRequest): boolean {
        if (gameReport.players == null || gameReport.players.length < 2) {
            throw new Error('Report should contain least of 2 players');
        }
        return true;
    }
}