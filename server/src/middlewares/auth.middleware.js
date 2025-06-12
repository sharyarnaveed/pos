const requireAuth=(req,res,next)=>
{
    if(req.session&&req.session.isAuthenticated)
    {
        return next()
    }
    else {
        return res.status(401).json({ error: "Authentication required", authenticated:false });
    }
}


module.exports={requireAuth}