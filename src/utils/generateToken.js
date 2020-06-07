import jwt from 'jsonwebtoken'

const generatedToken = (userId) => {
    return jwt.sign({ userId: user.id }, '61133F2EABE79CA4475F9CAB14124', { expiresIn: '7 days' })
}

export { generatedToken as default }
