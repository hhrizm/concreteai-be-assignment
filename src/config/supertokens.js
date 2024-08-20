const supertokens = require("supertokens-node");
const Session = require("supertokens-node/recipe/session");
const EmailPassword = require("supertokens-node/recipe/emailpassword");

const domain = process.env.DOMAIN_URL;

supertokens.init({
    framework: "express",
    supertokens: {
        connectionURI: process.env.SUPERTOKENS_CONNECTION_URI,
        apiKey: process.env.SUPERTOKENS_API_KEY,
    },
    appInfo: {
        appName: "testapp",
        apiDomain: domain,
        websiteDomain: domain,
        apiBasePath: "/auth",
        websiteBasePath: "/auth",
    },
    recipeList: [
        EmailPassword.init(),
        Session.init(),
    ],
});

module.exports = supertokens;