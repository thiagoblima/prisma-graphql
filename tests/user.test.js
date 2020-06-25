import { getFirstName } from '../src/utils/user'

test('Testing users first name', () => {
      const firstName = getFirstName('Thiago Lima')

      if (firstName !== 'Thiago') {
        throw new Error('This should trigger a failure')
      }
})