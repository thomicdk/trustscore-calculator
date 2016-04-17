///<reference path="../type-definitions/node.d.ts" />
///<reference path="../type-definitions/promise.d.ts" />
///<reference path="../type-definitions/trustpilot.d.ts" />

import { IHttpService } from "./http-service";
const reviewsPerPageMax = 100;

export class BusinessUnitReviewApiService {  
    private http: IHttpService;
    private apiKey: string;
        
    constructor(http: IHttpService, apiKey: string) {
        this.http = http;
        this.apiKey = apiKey;
    }
        
    public findReviews(domain: string, count: number): Promise<Array<BusinessUnitReview>> {
        return new Promise((resolve, reject) => {
            this.findBusinessUnitId(domain).then((businessUnitId: string) => {
                this.getReviews(businessUnitId, count).then((reviews) => {
                    resolve(reviews);
                }, reject);   
            }, reject);
        });
    }
    
    private getReviews(businessUnitId: string, count: number): Promise<Array<BusinessUnitReview>> {
        // The Trustpilot API cannot return more than 100 reviews per call,
        // so we must split into several API calls, if more than 100 reviews are requested.
        return new Promise((resolve, reject) => {
            let reviews = [];
            const promises = [];
            const pageCount = Math.ceil(count / reviewsPerPageMax);
            
            for (let page = 1; page <= pageCount; page++) {
                // Ensure we do not request more reviews than we actually need
                var reviewCount = page * reviewsPerPageMax > count 
                    ? count - ((page - 1) * reviewsPerPageMax)
                    : reviewsPerPageMax;
                const url = this.buildReviewApiUrl(businessUnitId, page, reviewCount);
                promises.push(this.http.get(url).then((result: any) => {
                    // Convert JSON date string to Date object
                    result.reviews.forEach((review) => {
                        review.createdAt = new Date(review.createdAt);
                    });
                    reviews = reviews.concat(result.reviews);   
                }, reject));
            }
            
            Promise.all(promises).then(() => resolve(reviews), reject);
        });
    }
    
    private findBusinessUnitId(domain: string): Promise<string> {
        const url = this.buildFindBusinessUnitApiUrl(domain);
        return this.http.get(url).then((businessUnit: BusinessUnit) => businessUnit.id);
    }
        
    private buildReviewApiUrl(businessUnitId: string, page: number, perPage: number): string {
        return `https://api.trustpilot.com/v1/business-units/${businessUnitId}/reviews?apikey=${this.apiKey}&page=${page}&perPage=${perPage}`;
    }
    
    private buildFindBusinessUnitApiUrl(domain: string): string {
        return `https://api.trustpilot.com/v1/business-units/find?name=${domain}&apikey=${this.apiKey}`;
    }
}