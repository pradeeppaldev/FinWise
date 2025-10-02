// Example protected route controller
const getProtectedData = (req, res) => {
  res.json({
    success: true,
    message: 'This is protected data',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
};

// Admin only route
const getAdminData = (req, res) => {
  res.json({
    success: true,
    message: 'This is admin-only data',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
};

module.exports = {
  getProtectedData,
  getAdminData
};