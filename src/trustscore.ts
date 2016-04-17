/**
 * Simple CLI for the TrustScore calculator
 */
import { HttpsService } from "./http-service";
import { BusinessUnitReviewApiService } from "./review-service";
import { TrustScoreCalculator } from "./calculator";

const config = require("./config");
const http = new HttpsService();
const reviewService = new BusinessUnitReviewApiService(http, config.trustpilotApiKey);
const calculator = new TrustScoreCalculator();

function trustScore(domain: string, reviewCount: number) {
    let actualReviewCount;
    reviewService
        .findReviews(domain, reviewCount)
        .then((reviews) => {
            actualReviewCount = reviews.length;   
            return reviews;
        })
        .then(calculator.calculate)
        .then((trustscore) => {
            console.log(`TrustScore for '${domain}' is ${trustscore}, based on the latest ${actualReviewCount} reviews.`)
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

var domain = process.argv[2];
if (typeof domain === "string") {
    trustScore(domain, config.defaultReviewCount);
} else {
    console.error(`Please specify a domain as argument to this script. 
Example: 
> trustscore trustpilot.dk`);
}
