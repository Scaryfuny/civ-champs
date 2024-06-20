import 'reflect-metadata';
import {GameStatsCalculator} from '../../../src/functions/services/game-stats-calculator';
import {UserService} from '../../../src/functions/services/user-service';
import {InvocationContext} from '@azure/functions';



describe('GameStatsCalculator', () => {
    let gameStatsCalculator: GameStatsCalculator;
    let mockUserService: jest.Mocked<UserService>;
    let mockContext: InvocationContext;

    beforeEach(() => {
        mockUserService = {} as any;
        mockContext = {} as any;
        gameStatsCalculator = new GameStatsCalculator(mockUserService);
    });

    test('should calculate game stats correctly for equals ranks', async () => {
        mockUserService.findUsersByIds = jest.fn().mockReturnValue(getUsersWithEqualsRank());
        mockContext.log = jest.fn();

        const gameReport: GameReportRequest = {
            playersResults: prepareGameReportInfo()
        }
        const gameResult: GameReportResultModel = await gameStatsCalculator.calculateGameStats(gameReport, mockContext);

        const expectedGameResult: GameReportResultModel = getExpectedResultWithEqualsRanks();
        expectedGameResult.creationDate = gameResult.creationDate;
        expect(expectedGameResult).toEqual(gameResult);
    });

    test('should calculate game stats correctly for not equals ranks', async () => {
        mockUserService.findUsersByIds = jest.fn().mockReturnValue(getUsersWithNotEqualsRank());
        mockContext.log = jest.fn();

        const gameReport: GameReportRequest = {
            playersResults: prepareGameReportInfo()
        }
        const gameResult: GameReportResultModel = await gameStatsCalculator.calculateGameStats(gameReport, mockContext);

        const expectedGameResult: GameReportResultModel = getExpectedResultWithNotEqualsRanks();
        expectedGameResult.creationDate = gameResult.creationDate;
        expect(expectedGameResult).toEqual(gameResult);
    });
});

function getUsersWithNotEqualsRank() {
    return [
        {
            accountName: "Ingvar",
            rankingScore: 2500
        },
        {
            accountName: "untdofman",
            rankingScore: 1700
        },
        {
            accountName: "DeadVoodoo",
            rankingScore: 1300
        },
        {
            accountName: "Baurman",
            rankingScore: 1000
        },
        {
            accountName: "Ayzrian",
            rankingScore: 800
        },
        {
            accountName: "Shakespeare",
            rankingScore: -350
        }
    ]
}

function getExpectedResultWithNotEqualsRanks(): GameReportResultModel {
    return {
        creationDate: new Date(),
        averageGameScore: 623,
        players: [
            {
                playerName: "Ingvar",
                playerScore: 514,
                playerLeader: "Cleopatra (Ptolemaic)",

                results: {
                    playerRankCompareToAverage: 1000,
                    playerRankChange: -59,

                    isPositiveResult: false,
                    isWinner: false,
                    winCondition: "none"
                }

            },
            {
                playerName: "untdofman",
                playerScore: 640,
                playerLeader: "Nader Shah",

                results: {
                    playerRankCompareToAverage: 542,
                    playerRankChange: 5,

                    isPositiveResult: true,
                    isWinner: false,
                    winCondition: "none"
                }
            },
            {
                playerName: "DeadVoodoo",
                playerScore: 442,
                playerLeader: "Gitarja",

                results: {
                    playerRankCompareToAverage: 142,
                    playerRankChange: -66,

                    isPositiveResult: false,
                    isWinner: false,
                    winCondition: "none"
                }
            },
            {
                playerName: "Baurman",
                playerScore: 624,
                playerLeader: "Qin Shi Huang (Unifier)",

                results: {
                    playerRankCompareToAverage: -158,
                    playerRankChange: 2,

                    isPositiveResult: true,
                    isWinner: false,
                    winCondition: "none"
                }
            },
            {
                playerName: "Ayzrian",
                playerScore: 727,
                playerLeader: "Trajan",

                results: {
                    playerRankCompareToAverage: -358,
                    playerRankChange: 46,

                    isPositiveResult: true,
                    isWinner: false,
                    winCondition: "none"
                }
            },
            {
                playerName: "Shakespeare",
                playerScore: 793,
                playerLeader: "Lady Six Sky",

                results: {
                    playerRankCompareToAverage: -1000,
                    playerRankChange: 120,

                    isPositiveResult: true,
                    isWinner: true,
                    winCondition: "Score"
                }
            }
        ]
    }
}

function getUsersWithEqualsRank() {
    return [
        {
            accountName: "Ingvar",
            rankingScore: 1000
        },
        {
            accountName: "untdofman",
            rankingScore: 1000
        },
        {
            accountName: "DeadVoodoo",
            rankingScore: 1000
        },
        {
            accountName: "Baurman",
            rankingScore: 1000
        },
        {
            accountName: "Ayzrian",
            rankingScore: 1000
        },
        {
            accountName: "Shakespeare",
            rankingScore: 1000
        }
    ]
}

function getExpectedResultWithEqualsRanks(): GameReportResultModel {
    return {
        creationDate: new Date(),
        averageGameScore: 623,
        players: [
            {
                playerName: "Ingvar",
                playerScore: 514,
                playerLeader: "Cleopatra (Ptolemaic)",

                results: {
                    playerRankCompareToAverage: 0,
                    playerRankChange: -35,

                    isPositiveResult: false,
                    isWinner: false,
                    winCondition: "none"
                }

            },
            {
                playerName: "untdofman",
                playerScore: 640,
                playerLeader: "Nader Shah",

                results: {
                    playerRankCompareToAverage: 0,
                    playerRankChange: 8,

                    isPositiveResult: true,
                    isWinner: false,
                    winCondition: "none"
                }
            },
            {
                playerName: "DeadVoodoo",
                playerScore: 442,
                playerLeader: "Gitarja",

                results: {
                    playerRankCompareToAverage: 0,
                    playerRankChange: -60,

                    isPositiveResult: false,
                    isWinner: false,
                    winCondition: "none"
                }
            },
            {
                playerName: "Baurman",
                playerScore: 624,
                playerLeader: "Qin Shi Huang (Unifier)",

                results: {
                    playerRankCompareToAverage: 0,
                    playerRankChange: 2,

                    isPositiveResult: true,
                    isWinner: false,
                    winCondition: "none"
                }
            },
            {
                playerName: "Ayzrian",
                playerScore: 727,
                playerLeader: "Trajan",

                results: {
                    playerRankCompareToAverage: 0,
                    playerRankChange: 37,

                    isPositiveResult: true,
                    isWinner: false,
                    winCondition: "none"
                }
            },
            {
                playerName: "Shakespeare",
                playerScore: 793,
                playerLeader: "Lady Six Sky",

                results: {
                    playerRankCompareToAverage: 0,
                    playerRankChange: 80,

                    isPositiveResult: true,
                    isWinner: true,
                    winCondition: "Score"
                }
            }
        ]
    }
}

function prepareGameReportInfo(): PlayerGameReportResult[] {
    return [
        {
            player: "Ingvar",
            playerScore: 514,
            playerLeader: "Cleopatra (Ptolemaic)",
            winCondition: "none"
        },

        {
            player: "untdofman",
            playerScore: 640,
            playerLeader: "Nader Shah",
            winCondition: "none"
        },
        {
            player: "DeadVoodoo",
            playerScore: 442,
            playerLeader: "Gitarja",
            winCondition: "none"
        },
        {
            player: "Baurman",
            playerScore: 624,
            playerLeader: "Qin Shi Huang (Unifier)",
            winCondition: "none"
        },
        {
            player: "Ayzrian",
            playerScore: 727,
            playerLeader: "Trajan",
            winCondition: "none"
        },
        {
            player: "Shakespeare",
            playerScore: 793,
            playerLeader: "Lady Six Sky",
            winCondition: "Score"
        }
    ]
}