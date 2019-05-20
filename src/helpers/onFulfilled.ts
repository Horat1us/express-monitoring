import { Details, ExecutionTime, State, SuccessResponse } from "../Response";

export const onFulfilled = (getExecutionTime: () => ExecutionTime) => (details?: Details): SuccessResponse => {
    const response: SuccessResponse = {
        state: State.ok,
        ms: getExecutionTime(),
    };

    if (details) {
        response.details = details;
    }

    return response;
};
