import { Control } from "../Control";
import * as helpers from "../helpers";
import { Details, Response, State } from "../Response";
import { FailureError } from "../FailureError";

export const Compose = (controls: Map<string, Control>): Control => async (): Promise<Details> => {
    const promises = new Array<Promise<Response>>();
    const responses: { [ k: string ]: Response } = {};

    controls.forEach((control, id) => {
        promises.push(helpers.resolve(control).then((response) => responses[ id ] = response));
    });

    await Promise.all(promises.values());

    const someControlRejected = Object.values(responses).some((response) => response.state === State.error);
    if (someControlRejected) {
        throw new FailureError("One or more control failed.", 0, responses, "ComposeError");
    }

    return responses;
};
