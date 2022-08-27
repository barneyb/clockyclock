import { goalY, intString, zeroPad } from "../common/utils";

function equal(expected, actual) {
    if (expected !== actual) {
        throw new Error(`Expected '${expected}' to equal '${actual}'`);
    }
}

function about(expected: number, actual: number, epsilon = expected / 10000) {
    if (Math.abs(expected - actual) > Math.abs(epsilon)) {
        throw new Error(`Expected '${expected}' to be about '${actual}'`)
    }
}

equal("01", zeroPad(1))
equal("12", zeroPad(12))
equal("123", zeroPad(123))

equal("0", intString(0))
equal("1", intString(1))
equal("10", intString(10))
equal("100", intString(100))
equal("1,010", intString(1010))
equal("999", intString(999))
equal("1,000", intString(1000))
equal("1,001", intString(1001))
equal("10,000", intString(10000))
equal("10,001", intString(10001))

about(298, goalY(0))
about(272, goalY(0.1))
about(246, goalY(0.2))
about(38, goalY(1))
about(-92, goalY(1.5))

