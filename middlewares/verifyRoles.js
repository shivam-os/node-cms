module.exports = (allowedRoles) => {
  return (req, res, next) => {
    const { roleId } = req.user.dataValues;

    //Check if given roleId is allowed in this route
    if (allowedRoles.includes(roleId)) {
      next();
    } else {
      return res
        .status(401)
        .json({ err: "You are not allowed to view this page!" });
    }
  };
};
