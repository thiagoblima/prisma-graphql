import {getFirstName, isValidPassword} from '../src/utils/user'

test('Should return only the individuals first name', () => {
    const firstName = getFirstName('Thiago Lima')

    expect(firstName).toBe('Thiago')
})

test('Should return first name when given first name', () => {
    const firstName = getFirstName('Jen')

    expect(firstName).toBe('Jen')
})

test('Should reject password shorter than 8 characters', () => {
    const isValid = isValidPassword('abc123')

    expect(isValid).toBe(false)
})

test('Should reject password that contains word password', () => {
    const isValid = isValidPassword('abcPassword098')

    expect(isValid).toBe(false)
})

test('Should correctly validate a valid password', () => {
    const isValid = isValidPassword('Test098!123')

    expect(isValid).toBe(true)
})
