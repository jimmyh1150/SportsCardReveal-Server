const isAdminRole = async (req, res, next) => {
  if (req.method == "OPTIONS") {
    next();
  } else if (!req.user || !req.user.role) {
    return res.status(403).send({ message: "Forbidden" });
  }
  if (req.user.role !== "Admin") {
    return res.status(403).send({ message: "Forbidden" });
  }

  next();
};
module.exports = isAdminRole;
