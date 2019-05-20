import * as controls from "../../src/controls";
import { Control, FailureError, State, SuccessResponse } from "../../src";

describe("Compose", () => {
    test("return details containing controls responses", async () => {
        const resultA = "Result A";
        const resultB = "Result B";
        const controlA = jest.fn().mockResolvedValue(resultA);
        const controlB = jest.fn().mockResolvedValue(resultB);

        const controlsMocks = new Map<string, Control>();
        controlsMocks.set("A", controlA);
        controlsMocks.set("B", controlB);

        const details = await controls.Compose(controlsMocks)() as {
            A: SuccessResponse<string>,
            B: SuccessResponse<string>,
        };

        expect(details).toHaveProperty("A.details");
        expect(details).toHaveProperty("B.details");
        expect(details.A.details).toEqual(resultA);
        expect(details.B.details).toEqual(resultB);
    });

    test("throw error if some control return error", async () => {
        const resultA = "Result A";
        const resultB = new FailureError("Failure", 1);
        const controlA = jest.fn().mockResolvedValue(resultA);
        const controlB = jest.fn().mockResolvedValue(Promise.reject(resultB));

        const controlsMocks = new Map<string, Control>();
        controlsMocks.set("A", controlA);
        controlsMocks.set("B", controlB);

        const promise = controls.Compose(controlsMocks)() as {
            A: SuccessResponse<string>,
            B: FailureError,
        };

        const failureMatcher = await expect(promise).rejects;
        failureMatcher.toMatchObject({
            message: "One or more control failed.",
            code: 0,
            type: "ComposeError",
            details: {
                A: {
                    state: State.ok,
                    details: resultA,
                },
                B: {
                    state: State.error,
                    error: resultB.toRaw(),
                },
            }
        });

    });
});
