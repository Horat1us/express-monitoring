import { onFulfilled } from "../../src/helpers";
import { State } from "../../src";

describe("onFulfilled", () => {
    const ExecutionTime = { begin: (new Date).getTime() / 1000, total: 1 };
    const getExecutionTime = () => ExecutionTime;

    test("correct state", () => {
        const response = onFulfilled(getExecutionTime)();
        expect(response.state).toStrictEqual(State.ok);
    });

    test("without details", () => {
        const response = onFulfilled(getExecutionTime)();
        expect(response).not.toHaveProperty("details");
    });

    test("with details", () => {
        const random = Math.random();
        const details = { random };
        const response = onFulfilled(getExecutionTime)(details);

        expect(response.details).toStrictEqual(details);
    });

    test("execution time", () => {
        const response = onFulfilled(getExecutionTime)();

        expect(response.ms).toStrictEqual(ExecutionTime);
    });
});
