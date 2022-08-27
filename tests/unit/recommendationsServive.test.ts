import { Recommendation } from '@prisma/client';
import { jest } from "@jest/globals";

import recommendationRepository from '../../src/repositories/recommendationRepository.js';
import {
    recommendationService
} from './../../src/services/recommendationsService';
import { CreateRecommendationData } from "../../src/services/recommendationsService.js";

jest.mock("./../../src/repositories/recommendationRepository")

describe("recommendation unit test suite", () => {
    it("should be able create recommendation", async () => {
        const recommendation: CreateRecommendationData = {
            name: "recomendation name",
            youtubeLink: "http://youtube.com/"
        }
        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce((): any => { });
        jest.spyOn(recommendationRepository, "create").mockImplementationOnce((): any => { });

        await recommendationService.insert(recommendation);

        expect(recommendationRepository.findByName).toBeCalled();
        expect(recommendationRepository.create).toBeCalled();
    });

    it("should not be able create recommendation if already exist", async () => {
        const recommendation: CreateRecommendationData = {
            name: "recomendationName",
            youtubeLink: "http://youtube.com/",
        }

        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce((): any => {
            return {
                name: recommendation.name,
                youtubeLink: recommendation.youtubeLink
            }
        });
        jest.spyOn(recommendationRepository, "create").mockImplementationOnce((): any => { });

        const response = recommendationService.insert(recommendation);
        expect(response).rejects.toEqual({
            message: "Recommendations names must be unique",
            type: "conflict"
        })
    });

    it("should be able increment upvote", async () => {
        const recommendation = {
            id: 1,
            youtubeLink: "https://youtube.com/",
            name: "teste",
            score: 1,
        }
        jest.spyOn(recommendationRepository, 'find').mockImplementationOnce((): any => {
            return recommendation
        });
        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => { })

        await recommendationService.upvote(recommendation.id);
        expect(recommendationRepository.updateScore).toBeCalled();
    });

    it("should be able to downvote", async () => {
        const recomendation = {
            id: 1,
            youtubeLink: "https://youtube.com/",
            name: "teste",
            score: -6,
        }
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => {
            return recomendation;
        });
        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => {
            return recomendation;
        });
        jest.spyOn(recommendationRepository, "remove").mockImplementationOnce((): any => { })

        await recommendationService.downvote(recomendation.id);
        expect(recommendationRepository.updateScore).toBeCalled();
    });

    it("should be able to remove a recommendation if its score is low", async () => {
        const recommendation = {
            id: 1,
            name: "low score",
            youtubeLink: "http://youtube.com",
            score: -6
        }
        jest.spyOn(recommendationRepository, 'find').mockImplementationOnce((): any => {
            return recommendation;
        });
        jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce((): any => {
            return recommendation;
        });
        jest.spyOn(recommendationRepository, 'remove').mockImplementationOnce((): any => { });

        await recommendationService.downvote(recommendation.id);
        expect(recommendationRepository.remove).toBeCalled();
    })

    it("should be able return one recommendation", async () => {
        const recomendation: Recommendation = {
            id: 1,
            name: "teste",
            youtubeLink: "http://youtube.com",
            score: 2
        }

        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => {
            return recomendation;
        });

        const response = await recommendationService.getById(recomendation.id);
        expect(response).toBe(recomendation);
    });

    it("should not be able return an throw", async () => {
        const id = 1;
        jest.spyOn(recommendationRepository, 'find').mockImplementationOnce((): any => { });
        const promise = recommendationService.getById(id);
        expect(promise).rejects.toEqual({ type: "not_found", message: "" });
    });

    it("should be able get all recommendations", async () => {
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => { });
        await recommendationService.get();
        expect(recommendationRepository.findAll).toBeCalled();
    });

    it("should be able to get the best recommendations in the ranking", async () => {
        const amount = 200;
        jest.spyOn(recommendationRepository, "getAmountByScore").mockImplementationOnce((): any => { });
        await recommendationService.getTop(amount);
        expect(recommendationRepository.getAmountByScore).toBeCalled();
    });

    it("should be able to get random recommendations greater than", async () => {
        const recommendation = {
            id: 1,
            youtubeLink: "https://youtube.com/",
            name: "teste",
            score: 1,
        }
        jest.spyOn(Math, "random").mockReturnValueOnce(0.6);
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {
            return [recommendation];
        });

        const promise = await recommendationService.getRandom();

        expect(promise).toEqual(recommendation);
    });

    it("should be able to get random recommendations less than", async () => {
        const recommendation = {
            id: 1,
            youtubeLink: "https://youtube.com/",
            name: "teste",
            score: 1,
        }
        jest.spyOn(Math, "random").mockReturnValueOnce(2);
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {
            return [recommendation];
        });

        const promise = await recommendationService.getRandom();

        expect(promise).toEqual(recommendation);
    });

    it("should not be able return random recommendations if not exists", async () => {
        jest.spyOn(recommendationRepository, 'findAll').mockImplementation((): any => {
            return []
        })
        const promise = recommendationService.getRandom();
        expect(promise).rejects.toEqual({ type: "not_found", message: "" })
    });
});
/**
    insert [X]
    upvote [X]

    downvote [X]
    getById: getByIdOrFail [X]
    get [X]
    getTop [X]
    getRandom [X]
**/