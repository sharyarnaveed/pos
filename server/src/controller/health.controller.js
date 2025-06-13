const health = async (req, res) => {
  try {
    res.json("in good health");
  } catch (error) {
    console.log("notgood in health", error);
  }
};

const authcheck = (req, res) => {
  console.log(req.session);
  if (req.session.isAuthenticated) {
    res.json({ authenticated: true, user: req.session.user });
  } else {
    res.json({ authenticated: false });
  }
};

const logout = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Could not log out" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logout successful", success: true });
    });
  } catch (error) {
    console.log("error in logout", error);
    res.json({
      message: "error in logout",
      success: false,
    });
  }
};

module.exports = { health, authcheck, logout };
