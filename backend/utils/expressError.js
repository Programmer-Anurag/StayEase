export class expressError extends Error
    {
        constructor(statusCode,errorMessage) {

        super();
        this.statusCode=statusCode;
        this.errorMessage=errorMessage;
    }
}
