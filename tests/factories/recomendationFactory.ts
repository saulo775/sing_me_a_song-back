import supertest from 'supertest';
import { faker } from "@faker-js/faker";
import { CreateRecommendationData } from "../../src/services/recommendationsService";
import app from '../../src/app';
import { prisma } from '../../src/database';


function createDataRecomendation() {
    const data: CreateRecommendationData = {
        name: faker.name.jobTitle(),
        youtubeLink: 'https://youtu.be/74TfUKhfVMk',
    }
    return data;
}

async function saveRecommendation(recommendationData: CreateRecommendationData) {
    const response = await supertest(app).post("/recommendations/").send(recommendationData);
    return response;
}

async function findRecommendationByName(recommendationData: CreateRecommendationData) {
    const response = await prisma.recommendation.findUnique({
        where: { name: recommendationData.name },
    });
    return response;
}

const recommendationFactory = {
    createDataRecomendation,
    saveRecommendation,
    findRecommendationByName
}

export default recommendationFactory;