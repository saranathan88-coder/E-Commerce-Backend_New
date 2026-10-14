// User profile operations
exports.getProfile = async (req, res) => {
  res.json(req.user);
};
