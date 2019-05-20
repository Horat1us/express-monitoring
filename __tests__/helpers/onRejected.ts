import { onRejected } from "../../src/helpers";
import { FailureError, State } from "../../src";

describe("onRejected", () => {
    const ExecutionTime = { begin: (new Date).getTime() / 1000, total: 1 };
    const getExecutionTime = () => ExecutionTime;

    const error = new Error;

    test("correct state", () => {
        const response = onRejected(getExecutionTime)(error);
        expect(response.state).toStrictEqual(State.error);
    });

    test("execution time", () => {
        const response = onRejected(getExecutionTime)(error);

        expect(response.ms).toStrictEqual(ExecutionTime);
    });

    test("using NodeJS error code as type", () => {
        const nodeError: NodeJS.ErrnoException = new Error;
        nodeError.code = "ERR_ASSERTION";

        const response = onRejected(getExecutionTime)(nodeError);

        expect(response.error.type).toStrictEqual(nodeError.code);
    });

    test("error object for NodeJS errors", () => {
        const response = onRejected(getExecutionTime)(error);

        expect(response.error).toStrictEqual({
            type: "Unknown Error",
            code: 0,
            message: "Control Failed",
        });
    });

    test("using toRaw() for FailureError", () => {
        const raw = {
            key: Math.random(),
        };
        const failureError = new class extends FailureError {
            constructor() {
                super("Failed", 0);
            }

            public toRaw(): any {
                return raw;
            }
        };

        const response = onRejected(getExecutionTime)(failureError);
        expect(response.error).toStrictEqual(raw);
    });
});
