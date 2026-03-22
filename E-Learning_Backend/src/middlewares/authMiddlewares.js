import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"]

        if (!authHeader) {
            return res.status(401).json({
                message: "Access denied. No token provided."
            })
        }

        const token = authHeader.split(" ")[1]
        if (!token) {
            return res.status(401).json({
                message: "Invalid token format."
            })
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token."
        })
    }
}

export const isInstructor = (req, res, next) => {

    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorized access."
        })
    }
    if (req.user.role !== "Instructor") {
        return res.status(403).json({
            message: "Access denied. Instructor only."
        })
    }
    next()
}

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized access."
            })
        }
        if (!allowedRoles.includes(req.user.role)) {

            return res.status(403).json({
                message: "Access denied. Insufficient role."
            })
        }
        next()
    }
}