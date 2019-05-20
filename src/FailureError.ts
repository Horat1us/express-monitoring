import { Details, ErrorDetails } from "./Response";

export class FailureError<TDetails = Details> extends Error implements ErrorDetails<TDetails> {
    public readonly code: number;
    public readonly type: string;
    public readonly details?: TDetails;

    constructor(message: string, code: number, details?: TDetails, type?: string) {
        super(message);

        this.code = code;
        this.details = details;
        this.type = type || this.constructor.name;
    }

    public toRaw(): ErrorDetails<TDetails> {
        const error: ErrorDetails<TDetails> =  { code: this.code, type: this.type,  message: this.message };

        if (this.details) {
            error.details = this.details;
        }

        return error;
    }
}
