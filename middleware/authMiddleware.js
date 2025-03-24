const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).json({ message: "Access Denied!" });

    try {
        // Extract the token from the Authorization header
        // Format is typically "Bearer [token]"
        const token = authHeader.startsWith("Bearer ") 
            ? authHeader.substring(7) 
            : authHeader;
            
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        console.error("Token verification error:", error.message);
        res.status(400).json({ message: "Invalid Token" });
    }
};
