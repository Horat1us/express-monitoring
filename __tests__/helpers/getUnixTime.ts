import { getUnixTime } from "../../src/helpers";

describe("getUnixTime", () => {
    const RealDate = Date;

    beforeAll(() => {
        (global.Date as any) = class extends RealDate {
            public getTime(): number {
                return 1558332698615;
            }
        };
    });

    afterAll(() => {
        global.Date = RealDate;
    });

    test("return unix time in seconds", () => {
        const unixTime = getUnixTime();
        expect(unixTime).toEqual(1558332698.615);
    });
});
