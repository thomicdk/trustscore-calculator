///<reference path="../type-definitions/node.d.ts" />
///<reference path="../type-definitions/promise.d.ts" />

import * as https from 'https';

export interface IHttpService {
    get<T>(url: string) : Promise<T>;
}

export class HttpsService implements IHttpService {  
    public get<T>(url: string) : Promise<T> {
        return new Promise((resolve, reject) => {
            const request = https.get(url, (response) => {
                let body = '';
                response.on('data', (chunk) => body += chunk);
                response.on('end', () => {           
                    let result: Object | string;
                    if (response.headers['content-type'].indexOf('application/json') === 0) {
                        result = JSON.parse(body);
                    } else {
                        result = body;
                    }
                                        
                    if (response.statusCode < 200 || response.statusCode > 299) {
                        reject(result);
                    } else {
                        resolve(result);    
                    }
                });
            });
            request.on('error', (err) => reject(err))
        });
    }
}