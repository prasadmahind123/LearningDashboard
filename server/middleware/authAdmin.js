import jwt from 'jsonwebtoken';  

const authAdmin = async (req, res, next) => {
    const {adminToken} = req.cookies; // Get the admin token from cookies
    if (!adminToken) {
        return res.status(401).json({ message: 'Unauthorized, no token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);

        if (decoded.email === process.env.ADMIN_EMAIL) {
            next(); // Proceed to the next middleware or route handler
        } else {
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Unauthorized, invalid token' });
    }
}

export default authAdmin;