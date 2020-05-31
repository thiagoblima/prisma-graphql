import jwt from 'jsonwebtoken'

const getUserId = (request) => {
    const header = request.request.headers.authorization
    
    if (!header) {
        throw new Error('Authentication required')
    }

    const token = header.replace('Bearer ', '')
    const decoded = jwt.verify(token, '61133F2EABE79CA4475F9CAB14124')

    return decoded.userId
}

export { getUserId as default }
