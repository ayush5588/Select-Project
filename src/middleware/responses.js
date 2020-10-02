var error = (req,res,messageProperty,fileToBeRendered,errorMessage) => {
    req.flash(messageProperty,errorMessage);
    res.locals.message = req.flash();
    res.render(fileToBeRendered);
}

var success = (req,res,messageProperty,fileToBeRendered,successMessage) => {
    req.flash(messageProperty,successMessage);
    res.locals.message = req.flash();
    res.render(fileToBeRendered);
}

module.exports = {
    error,
    success
};