import { getFirstName } from '../src/utils/user'

test('Testing users first name', () => {
      const firstName = getFirstName('Thiago Lima')
      
      expect(firstName).toBe('Thiago')
})