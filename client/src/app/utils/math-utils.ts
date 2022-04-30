
export default class MathUtils {
    static sum(a, b) {
        return a + b;
    }

    static sumArray(array) {
        return array.reduce((c, v) => c + v, 0);
    }
}