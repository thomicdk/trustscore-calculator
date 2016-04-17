# trustscore-calculator

A simple TrustScore calculator for Trustpilot reviews.

## Getting started
1. Run ```npm install``` to install build dependencies
2. Run ```gulp``` to build calculator
3. Update ```dist/config.json``` with your Trustpilot API key

### Run from command line
Run calculator like this: 
```
> node dist/trustscore skoringen.dk
TrustScore for 'skoringen.dk' is 8.9, based on the latest 300 reviews.
```

### Use in Amazon AWS Lambda
1. Run ```gulp publish:aws``` to create a ZIP package for AWS Lambda
2. Locate ZIP-package here ```dist/aws/trustscore-calculator.zip```
3. Create or update AWS Lambda function using ZIP-package
4. Configure handler name for Lambda function: ```aws-lambda-function.handler```

## Roadmap
* Add unit tests, especially to ```TrustScoreCalculator``` and ```BusinessUnitReviewApiService```
