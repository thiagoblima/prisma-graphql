import jwt from 'jsonwebtoken'

const generatedToken = (userId) => {
    return jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: '7 days' })
}

export { generatedToken as default }
