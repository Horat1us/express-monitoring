import { onFulfilled } from "../../src/helpers";
import { State } from "../../src";

describe('onFulfilled', () => {
    const getExecutionTime = () => ({ begin: 0, total: 0 });

    test('correct state', () => {
        const response = onFulfilled(getExecutionTime)();
        expect(response.state).toStrictEqual(State.ok);
    });

    test('without details', () => {
        const response = onFulfilled(getExecutionTime)();
        expect(response).not.toHaveProperty("details");
    });

    test('with details', () => {
        const number = Math.random();
        const details = { number };
        const response = onFulfilled(getExecutionTime)(details);

        expect(response.details).toStrictEqual(details);
    });

    test('execution time', () => {
        const ExecutionTime = { begin: (new Date).getTime() / 1000, total: 1 };
        const getExecutionTime = () => ExecutionTime;

        const response = onFulfilled(getExecutionTime)();

        expect(response.ms).toStrictEqual(ExecutionTime);
    });
});
