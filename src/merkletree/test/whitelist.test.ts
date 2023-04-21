import { whitelist } from "../whitelist";
import { Grant } from "../../Types";

describe("Whitelist", () => {

    describe("run()", () => {
        it("should generate merkle tree with correct root and proofs", async() => {
        const data: Grant[] =  [
            {
            address:
                "0x208555013ffe57ce0f78be91ce8b368eba6645a52bb90fed2c427617d619d03",
            allocation: 5,
            },
            {
            address:
                "0x009d02bAA050B9e8F3eb98fF0FA1eDe8e1b20D65CEae9f05E018b4d8dA3E4b7f",
            allocation: 1,
            },
        ];

        const result = whitelist.run(data);

        expect(result.root).toEqual(
            "3360113208160104531126311151413775021287568672669734343931496313109553562643"
        );

        expect(result.leaves[0].index).toEqual(0);
        expect(result.leaves[0].allocation).toEqual(5);
        expect(result.leaves[0].proof).toEqual([
            "1489335374474017495857579265074565262713421005832572026644103123081435719307"
        ]);

        expect(result.leaves[1].index).toEqual(1);
        expect(result.leaves[1].allocation).toEqual(1);
        expect(result.leaves[1].proof).toEqual([
            "1021615307502727721556822164826770330207352365337674294210223376878289133173"
        ]);

        });

    });

    describe("assert()", () => {
        it("should throw error if the condition is false", () => {
            expect(() => whitelist.assert(false)).toThrow("Verification failed");
        });

        it("should compute big merkle trees under 1s", () => {
            const data = Array(10).fill({
                address:
                    "0x009d02bAA050B9e8F3eb98fF0FA1eDe8e1b20D65CEae9f05E018b4d8dA3E4b7f",
                allocation: 1,
            })

            const preDate = Date.now();
            whitelist.run(data);
            const newDate = Date.now();

            expect(1000).toBeGreaterThan(newDate - preDate);
        })
    })

});
