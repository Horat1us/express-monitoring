import { ExecutionTime, FailureResponse, State } from "../Response";
import { FailureError } from "../FailureError";

export const onRejected = (getExecutionTime: () => ExecutionTime) =>
    (error: NodeJS.ErrnoException | FailureError): FailureResponse => {
        return {
            state: State.error,
            ms: getExecutionTime(),
            error: error instanceof FailureError
                ? error.toRaw()
                : {
                    type: error.code || "Unknown Error",
                    code: 0,
                    message: `Control Failed`,
                },
        };
    };
