const svgCaptcha = require("svg-captcha");
exports.getCaptchaService = async () => {
	const captcha = svgCaptcha.create({
		size: 6,
		ignoreChars: "iIl10o6",
		noise: 6,
		color: true
	});
	return captcha;
};
