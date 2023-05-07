const httpResponses = require("../utils/httpResponses");

module.exports = (allowedRoles) => {
  return (req, res, next) => {
    const { roleId } = req.user.dataValues;

    //Check if given roleId is allowed in this route
    if (allowedRoles.includes(roleId)) {
      next();
    } else {
      return httpResponses.forbiddenError(res);
    }
  };
};
