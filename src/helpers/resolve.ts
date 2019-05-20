import { Control } from "../Control";
import { Response } from "../Response";
import { ExecutionTimer } from "./ExecutionTimer";
import { onFulfilled } from "./onFulfilled";
import { onRejected } from "./onRejected";

export const resolve = async (control: Control): Promise<Response> => {
    const getExecutionTime = ExecutionTimer();
    try {
        return onFulfilled(getExecutionTime)(await control());
    } catch (error) {
        return onRejected(getExecutionTime)(error);
    }
};
