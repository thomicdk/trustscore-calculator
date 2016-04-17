
import { HttpsService } from "./http-service";
import { BusinessUnitReviewApiService } from "./review-service";
import { TrustScoreCalculator } from "./calculator";

const config = require("./config");
const http = new HttpsService();
const reviewService = new BusinessUnitReviewApiService(http, config.trustpilotApiKey);
const calculator = new TrustScoreCalculator();

function calculateTrustScore(domain: string, reviewCount: number) {
    let actualReviewCount;
    return reviewService
        .findReviews(domain, reviewCount)
        .then(reviews => {
            actualReviewCount = reviews.length;
            return reviews;
        })
        .then(calculator.calculate)
        .then((score) => {
            return {
                domain: domain,
                score: score
            };
        });
}

export function handler(event: any, context: any, callback: (error?: any, result?: any) => void) {
    const domain = event.params.querystring.domain;
    
    calculateTrustScore(domain, config.defaultReviewCount).then((trustScoreResult) => {
        callback(null, trustScoreResult);
    }).catch((error) => {
        callback(error.message || error);        
    });
}
