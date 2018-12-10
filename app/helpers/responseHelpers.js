function missingBody(res, msg) {
    res.status(400).json({
        statusCode: 1,
        success: false,
        message: msg || 'Required Parameters Missing/Invalid Parameters'
    });
}

function errorResponse(res, err, status, msg) {
    res.status(status || 501).json({
        statusCode: 2,
        success: false,
        message: msg || 'Server Error, Please Try Again Later',
        devInfo: err
    });
}

function successPostResponse(res, data, msg) {
    console.log('The Data is:', data);
    res.status(200).json({
        statusCode: 3,
        success: true,
        message: msg || 'Success',
        result: data
    });
}

function successGetResponse(res, data, msg) {
    console.log('The Data is:', data);
    res.status(200).json({
        statusCode: 3,
        success: true,
        message: msg || 'Success',
        result: data
    });
}

function successPutResponse(res, data, msg) {
    console.log('The Data is:', data);
    res.status(200).json({
        statusCode: 3,
        success: true,
        message: msg || 'Success',
        result: data
    });
}

function successDeleteResponse(res, data, msg) {
    console.log('The Data is:', data);
    res.status(200).json({
        statusCode: 3,
        success: true,
        message: msg || 'Success',
        result: data
    });
}

function noRecordsFound(res, msg) {
    res.status(200).json({
        statusCode: 4,
        success: false,
        message: msg || 'Unable to find required information',
        result: null
    });
}

function alreadyRegistered(res, msg) {
    res.status(200).json({
        statusCode: 5,
        success: true,
        message: msg || 'User Already Registered',
        result: null
    });
}

function alreadyRegisteredWithGoogle(res, msg) {
    res.status(200).json({
        statusCode: 6,
        success: true,
        message: msg || 'User Already Registered Using Google',
        result: null
    });
}

function alreadyRegisteredWithFacebook(res, msg) {
    res.status(200).json({
        statusCode: 7,
        success: true,
        message: msg || 'User Already Registered Using Facebook',
        result: null
    });
}

function unauthorized(res, msg) {
    res.status(401).json({
        statusCode: 8,
        success: false,
        message: msg || 'User Is Not Allowed',
        result: null
    });
}

module.exports = { missingBody, errorResponse, successPostResponse, successGetResponse, successPutResponse, successDeleteResponse, noRecordsFound, alreadyRegistered, alreadyRegisteredWithGoogle, alreadyRegisteredWithFacebook, unauthorized }
