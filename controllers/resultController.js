function checkAndSendError(res, err)
{
    if (err)
    {
        res.status(500).json(err);
        res.send();
        return true;
    }
    return false;
}

function sendSuccess(res, information)
{
    if (information)
        res.status(200).json(information);
    else
        res.status(200).send();
}

module.exports.sendSuccess = sendSuccess;

module.exports.checkAndSendError = checkAndSendError;

module.exports.sendRequestError = function(res, errorText)
{
    res.status(400).json({message:errorText});
    res.send();
}

module.exports.sendNotFound = function(res, errorText)
{
    res.status(404).json({message:errorText});
    res.send();
}

module.exports.sendSuccessAfterCheckingError = function(res, err, information)
{
    if (!checkAndSendError(res, err))
        sendSuccess(res, information);
}