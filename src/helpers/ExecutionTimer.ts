import { ExecutionTime } from "../Response";
import { getUnixTime } from "./getUnixTime";

export const ExecutionTimer = (now: () => number = getUnixTime) => {
    const begin = now();

    return (): ExecutionTime => ({
        begin,
        total: now() - begin,
    });
};
