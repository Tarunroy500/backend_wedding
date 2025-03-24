const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await User.findOne({ email });
        if (!admin) return res.status(400).json({ message: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        const token = jwt.sign(
            { id: admin._id, email: admin.email, name: admin.name },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );
        
        res.json({
            token,
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        
        await user.save();
        
        // Create and return JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name }, 
            process.env.JWT_SECRET, 
            { expiresIn: "30d" }
        );
        
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Add forgot password functionality (optional)
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            // For security reasons, don't reveal whether the email exists
            return res.status(200).json({ message: "If your email exists in our system, you will receive a reset link" });
        }
        
        // In a real app, generate a reset token and send an email
        // For this example, we'll just return success
        
        res.status(200).json({ 
            message: "Password reset instructions sent to your email" 
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
