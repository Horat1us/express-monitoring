import { resolve } from "../../src/helpers";
import { FailureError, FailureResponse, State, SuccessResponse } from "../../src";

describe("resolve", () => {
    test(`call onFulfilled if control succeed`, async () => {
        const details = { key: Math.random(), };
        const control = jest.fn().mockResolvedValue(details);

        const response = await resolve(control) as SuccessResponse;
        expect(response.state).toEqual(State.ok);
        expect(response.details).toStrictEqual(details);
    });

    test('call onRejected if control throw error', async () => {
        const error = new FailureError("Error", 0);
        const control = jest.fn();
        control.mockImplementation(() => {
            throw error;
        });

        const response = await resolve(control) as FailureResponse;
        expect(response.state).toEqual(State.error);
        expect(response.error).toStrictEqual(error.toRaw());
    });

    test('call onRejected if control reject promise', async () => {
        const error = new FailureError("Error", 0);
        const control = jest.fn();
        control.mockImplementation(() => Promise.reject(error));

        const response = await resolve(control) as FailureResponse;
        expect(response.state).toEqual(State.error);
        expect(response.error).toStrictEqual(error.toRaw());
    });

    test('call onFulfilled with details from async control', async () => {
        const details = { key: Math.random(), };
        const control = jest.fn().mockImplementation(() => Promise.resolve(details));

        const response = await resolve(control) as SuccessResponse;
        expect(response.state).toEqual(State.ok);
        expect(response.details).toStrictEqual(details);
    });
});
