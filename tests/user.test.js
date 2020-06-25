import { getFirstName } from '../src/utils/user'

test('Should return only the individuals first name', () => {
      const firstName = getFirstName('Thiago Lima')
      
      expect(firstName).toBe('Thiago')
})

test('Should return first name when given first name', () => {
    const firstName = getFirstName('Jen')

    expect(firstName).toBe('Jen')
})