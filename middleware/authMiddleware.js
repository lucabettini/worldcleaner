import jwt from 'jsonwebtoken';

// Create token functionality
export const sendToken = (user, res) => {
  const { id, name } = user;

  const payload = {
    user: {
      id,
    },
  };
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign(payload, secret, { expiresIn: '2h' });

  const cookieOptions = {
    secure: process.env.NODE_ENV === 'development' ? false : true,
    httpOnly: true,
    sameSite: 'Strict',
  };

  res.cookie('jwt', token, cookieOptions);

  res.json({
    id: id,
    name: name,
  });
};

// Auth middleware
export default function (req, res, next) {
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
}