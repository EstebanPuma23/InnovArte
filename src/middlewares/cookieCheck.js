module.exports = (req, res, next) => {
    if(req.cookies.InnovArte)
    {
        req.session.userLogin = req.cookies.InnovArte
    }
    next()
}