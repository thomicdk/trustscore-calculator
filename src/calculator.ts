///<reference path="../type-definitions/trustpilot.d.ts" />

// Simplification: 1 month = 30 days
const oneMonthMillis = 1000 * 60 * 60 * 24 * 30;
// From: https://support.trustpilot.com/hc/en-us/articles/201748946
const stars2TrustScore = [0, 2.5, 5, 7.5, 10];

/**
 * A weighted mean TrustScore calculator for Trustpilot reviews.
 * Weight is based on the age of reviews:
 *      < 1  month   => 1.0
 *      1-3  months  => 0.8
 *      3-6  months  => 0.5
 *      6-12 months  => 0.3
 *      > 12 months  => 0.1 
 */
export class TrustScoreCalculator {
    
    public calculate(reviews : Array<BusinessUnitReview>): number {
        let numerator = 0,
            denominator = 0;
        reviews.forEach((review) => {
            const reviewWeight = TrustScoreCalculator.getReviewWeight(review);
            const reviewTrustScore = TrustScoreCalculator.getReviewTrustScore(review);
            numerator += reviewWeight * reviewTrustScore;
            denominator += reviewWeight;
        });
        return Math.round((numerator / denominator) * 10 ) / 10;        
    } 
    
    private static getReviewTrustScore(review: BusinessUnitReview): number {
        return stars2TrustScore[review.stars - 1];
    }
    
    private static getReviewWeight(review: BusinessUnitReview): number {
        const todayMillis = new Date().valueOf(),
              reviewAgeMillis = todayMillis - review.createdAt.valueOf();
        
        if (reviewAgeMillis < oneMonthMillis) {
            return 1.0;
        } else if (reviewAgeMillis < 3 * oneMonthMillis) {
            return 0.8;
        } else if (reviewAgeMillis < 6 * oneMonthMillis) {
            return 0.5;
        } else if (reviewAgeMillis < 12 * oneMonthMillis) {
            return 0.3;
        } else {
            return 0.1;
        }
    }
}
