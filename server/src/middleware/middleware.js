import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Access denied. No token provided."
      });
    }
    
    // Verify token and check role
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: false,
          message: "Invalid or expired token"
        });
      }
        console.log(decoded)
      // Store decoded user info and role
      req.user = {
        id : decoded.id ? decoded.id : '',
        email: decoded.email,
        role: decoded.role
      };
      
      next();
    });

  } catch (err) {
    return res.status(401).json({
      status: false,
      message: "Authentication failed"
    });
  }
};

export const isAdmin = (req, res, next) => {
  // Check for admin or super_admin roles exactly as used in your auth controller
  if (req.user.role === 'admin' || req.user.role === 'super_admin') {
    next();
  } else {
    return res.status(403).json({
      status: false,
      message: "Access denied. Admin rights required."
    });
  }
};