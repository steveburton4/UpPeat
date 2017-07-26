module.exports = function(app, baseUrl, documentationDirName) {
    var express = require('express'),
        documentationSubPath = express(),
        swagger = require('swagger-node-express').createNew(documentationSubPath);

    swagger.setApiInfo({
            title: "UpPeat RESTful API",
            description: "API to provide CRUD functionality for UpPeat data",
            termsOfServiceUrl: "",
            contact: "steven.burton@hotmail.co.uk",
            license: "Steven Burton",
            licenseUrl: ""
        });

    swagger.configureSwaggerPaths('', 'api-docs', '');
    swagger.setAppHandler(documentationSubPath);
    swagger.configure(baseUrl+"/v1", "1.0.1");

    app.use(express.static(documentationDirName));
    app.use("/v1", documentationSubPath);
    app.get('/v1', function (req, res) {
        res.sendFile(documentationDirName + '/index.html');
    });

    return app;
}