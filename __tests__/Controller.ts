import express from "express";
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';
import { Controller, FailureError, State } from "../src";

jest.mock('express', () => {
    return require('jest-express');
});

describe("Controller", () => {

    describe("controls configuration", () => {
        test("array of objects { id, control }", () => {
            const control = jest.fn();
            const controls = [
                {
                    id: "A",
                    control,
                },
            ];
            const controller = new Controller({ controls });

            expect(controller.controls.size).toEqual(controls.length);
            expect(controller.controls.get("A")).toEqual(control);
        });

        test("map", () => {
            const controls = new Map;
            const controller = new Controller({ controls });

            expect(controller.controls).toEqual(controls);
        });

        test("object { [id]: control }", () => {
            const control = jest.fn();
            const controls = {
                A: control,
            };
            const controller = new Controller({ controls });

            expect(controller.controls.size).toEqual(1);
            expect(controller.controls.get("A")).toEqual(control);
        });
    });

    describe("control handler", () => {

        let controller: Controller;
        let response: express.Response;
        beforeAll(() => {
            controller = new Controller({
                controls: new Map,
            });
            response = new Response as any;
        });

        test("returns 400 if missing id", async () => {
            const request = new Request("/monitoring");

            await controller.control(request as any, response as any);

            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toMatchSnapshot();
        });

        test("returns 404 if requested control not found", async () => {
            const request = new Request("/monitoring");
            request.setParams("id", "controlID");

            await controller.control(request as any, response);

            expect(response.status).toHaveBeenCalledWith(404);
            expect(response.json).toMatchSnapshot();
        });

        test("returns control successful response", async () => {
            const controlId = "A";
            const details = {
                key: Math.random(),
            };
            const request = new Request("/monitoring");
            request.setParams("id", controlId);
            controller.controls.set(controlId, () => (details));

            await controller.control(request as any, response);

            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledTimes(1);
            expect((response.json as jest.Mock).mock.calls[ 0 ][ 0 ]).toMatchObject({
                state: State.ok,
                details,
            });
        });

        test("returns control failure response", async () => {
            const controlId = "A";
            const details = {
                key: Math.random(),
            };
            const failureError = new FailureError("Failure", 1, details, "TestFailure");
            const request = new Request("/monitoring");
            request.setParams("id", controlId);
            controller.controls.set(controlId, () => Promise.reject(failureError));

            await controller.control(request as any, response);

            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledTimes(1);
            expect((response.json as jest.Mock).mock.calls[ 0 ][ 0 ]).toMatchObject({
                state: State.error,
                error: failureError.toRaw(),
            });
        });
    });

    describe("full handler", () => {

        let controller: Controller;
        let response: express.Response;
        beforeAll(() => {
            controller = new Controller({
                controls: new Map,
            });
            response = new Response as any;
        });

        test("returns compose control response", async () => {
            const resultA = "Result A";
            const resultB = new FailureError("Failure", 1, "Details");
            const controlA = jest.fn().mockResolvedValue(resultA);
            const controlB = jest.fn().mockResolvedValue(Promise.reject(resultB));

            controller.controls.set("A", controlA);
            controller.controls.set("B", controlB);

            await controller.full(new Request("/monitoring/full") as any, response);

            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledTimes(1);
            expect((response.json as jest.Mock).mock.calls[0][0]).toMatchObject({
                state: State.error,
                error: {
                    details: {
                        A: {
                            state: State.ok,
                            details: resultA,
                        },
                        B: {
                            state: State.error,
                            error: {
                                details: resultB.details,
                            }
                        }
                    }
                }
            });
        });
    });
});
