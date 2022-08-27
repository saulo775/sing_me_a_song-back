import recommendationRepository from '../../src/repositories/recommendationRepository.js';
import supertest from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/database";
import recommendationFactory from '../factories/recomendationFactory.js';




describe("recommendation test suite", () => {
    beforeEach(async () => {
        await prisma.$executeRaw`DELETE FROM recommendations`
    });

    it("given name and youtube link, create recommendation", async () => {
        const recomendation = recommendationFactory.createDataRecomendation();
        const response = await recommendationFactory.saveRecommendation(recomendation);
        expect(response.statusCode).toBe(201);
    });

    it("given name and youtube link, do not create if a recommendation with the same name already exists", async () => {
        const recomendation = recommendationFactory.createDataRecomendation();

        await recommendationFactory.saveRecommendation(recomendation);
        const response = await recommendationFactory.saveRecommendation(recomendation);
        expect(response.statusCode).toBe(409);
    });

    it("should be able, get first ten recommendations", async () => {
        const recomendation = recommendationFactory.createDataRecomendation();

        await recommendationFactory.saveRecommendation(recomendation);
        const response = await supertest(app).get("/recommendations/");

        const recommendations = response.body.recommendations
        expect(recommendations).not.toBeNull();
    });

    it("should be able, get random recommendations", async () => {
        const recomendation = recommendationFactory.createDataRecomendation();

        await recommendationFactory.saveRecommendation(recomendation);
        const response = await supertest(app).get("/recommendations/random");
        const recommendations = response.body.recommendations;

        expect(recommendations).not.toBeNull();
    });

    it("given amount, take this amount recommendations", async () => {
        const recomendation = recommendationFactory.createDataRecomendation();

        await recommendationFactory.saveRecommendation(recomendation);
        const response = await supertest(app).get(`/recommendations/top/${recomendation.name}`);
        const recommendations = response.body.recommendations;

        expect(recommendations).not.toBeNull();
    });

    it("given id, take this especific recommendation", async () => {
        const recomendation = recommendationFactory.createDataRecomendation();

        await recommendationFactory.saveRecommendation(recomendation);
        const rec = await recommendationFactory.findRecommendationByName(recomendation);

        const response = await supertest(app).get(`/recommendations/${rec.id}`);
        const recommendation = response.body.recommendations;

        expect(rec).not.toBeNull();
    });

    it("should be able to upvote a link by its id", async () => {
        const recomendation = recommendationFactory.createDataRecomendation();

        await recommendationFactory.saveRecommendation(recomendation);
        const rec = await recommendationFactory.findRecommendationByName(recomendation);

        const response = await supertest(app).post(`/recommendations/${rec.id}/upvote`);
        expect(response.statusCode).toBe(200);
    });

    it("should be able to upvote a link by its id", async () => {
        const recomendation = recommendationFactory.createDataRecomendation();

        await recommendationFactory.saveRecommendation(recomendation);
        const rec = await recommendationFactory.findRecommendationByName(recomendation);

        const response = await supertest(app).post(`/recommendations/${rec.id}/downvote`);

        expect(response.statusCode).toBe(200);
    });


});