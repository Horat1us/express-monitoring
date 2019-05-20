import { FailureError } from "../src";

const code = Math.random();
const type = (new Date).toISOString();
const details = {
    key: Math.random(),
};
const message = 'Test Failure';

test('constructor()', () => {
    const error = new FailureError(message, code, details, type);

    expect(error.message).toStrictEqual(message);
    expect(error.code).toStrictEqual(code);
    expect(error.details).toStrictEqual(details);
    expect(error.type).toStrictEqual(type);
});

test('toRaw()', () => {
    const error = new FailureError(message, code, details, type);
    const raw = error.toRaw();

    expect(raw).toStrictEqual({
        message, type, code, details,
    });
});

test('toRaw() without details', () => {
    const error = new FailureError(message, code, undefined, type);

    expect(error.toRaw().details).toBeUndefined();
});

test('toRaw() without type', () => {
    const error = new FailureError(message, code);

    expect(error.toRaw().type).toStrictEqual("FailureError");
});
