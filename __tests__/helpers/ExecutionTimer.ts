import { ExecutionTimer } from "../../src/helpers";

describe('ExecutionTimer', () => {
    test('store begin time', () => {
        const getUnixTime = () => 1558332698.615;

        const getExecutionTime  = ExecutionTimer(getUnixTime);
        const ExecutionTime = getExecutionTime();

        expect(ExecutionTime.begin).toEqual(getUnixTime());
    });

    test('should calculate total time', () => {
        let now = 1558332698.615;
        const getUnixTime = () => now;
        const diff = 10;

        const getExecutionTime  = ExecutionTimer(getUnixTime);

        now += diff;
        const ExecutionTime = getExecutionTime();

        expect(ExecutionTime.total).toEqual(diff);
    });
});
