import jwt from 'jsonwebtoken'

const getUserId = (request, requireAuth = true) => {
    const header = request.request ? request.request.headers.authorization : request.connection.context.Authorization
    
    if (header) {
        const token = header.replace('Bearer ', '')
        const decoded = jwt.verify(token, '61133F2EABE79CA4475F9CAB14124')
        return decoded.userId
    }

    if (requireAuth) {
        throw new Error('Authentication required')
    }

    return null
}

export { getUserId as default }
