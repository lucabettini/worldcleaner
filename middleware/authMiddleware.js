import jwt from 'jsonwebtoken';

// Auth middleware
const auth = (req, res, next) => {
  // Get token from header
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token not valid' });
  }
};

const sendToken = (req, res) => {
  const { id, isAdmin } = req.tokenInfo;

  // Create new jwt token
  const payload = {
    user: {
      id,
    },
  };
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign(payload, secret, { expiresIn: '2h' });

  // Store token on session cookie
  const cookieOptions = {
    secure: process.env.NODE_ENV === 'development' ? false : true,
    httpOnly: true,
    sameSite: 'Strict',
  };
  res.cookie('jwt', token, cookieOptions);

  // Send infos to client
  res.json({
    id: id,
    isAdmin: isAdmin,
  });
};

export { auth, sendToken };
