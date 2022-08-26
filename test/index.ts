import { intString, zeroPad } from "../common/utils";

function assert(expected, actual) {
    if (expected !== actual) {
        throw new Error(`Expected '${expected}' but got '${actual}'`);
    }
}

assert("01", zeroPad(1))
assert("12", zeroPad(12))
assert("123", zeroPad(123))

assert("0", intString(0))
assert("1", intString(1))
assert("10", intString(10))
assert("100", intString(100))
assert("1,010", intString(1010))
assert("999", intString(999))
assert("1,000", intString(1000))
assert("1,001", intString(1001))
assert("10,000", intString(10000))
assert("10,001", intString(10001))
