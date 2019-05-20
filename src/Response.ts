export enum State {
    ok = "ok",
    error = "error",
}

export interface ExecutionTime {
    begin: number; // unix timestamp, seconds
    total: number; // seconds
}

export interface Details {
    [k: string]: any;
}

export interface ErrorDetails<TDetails = Details> {
    type: string;
    code: number;
    message: string;
    details?: TDetails;
}

export interface BaseResponse {
    state: State;
    ms: ExecutionTime;
}

export interface SuccessResponse<TDetails = Details> extends BaseResponse {
    state: State.ok;
    details?: TDetails;
}

export interface FailureResponse<TDetails = Details> extends BaseResponse {
    state: State.error;
    error: ErrorDetails<TDetails>;
}

export type Response = SuccessResponse | FailureResponse;
