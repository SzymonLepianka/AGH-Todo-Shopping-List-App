const { sumFunction } = require("../src/test_helper")
//tests take a description and a function
test('test sumFunction, expected to pass', () => {
    const a = 5
    const b = 6
    const result = sumFunction(a, b)
    expect(result).toBe(11)
})
// test('test sumFunction, expected to fail', () => {
//     const a = 5
//     const b = 6
//     const result = sumFunction(a, b)
//     expect(result).toBe(12)
// })
