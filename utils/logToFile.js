const fs = require("fs");
const moment = require("moment");
const path = require("path");

/**
 * logs파일에 log를 저장합니다.
 * @param {string} message 저장할 메시지
 */
const logToFile = (message) => {
	const ltf = () => {
		const now = moment();

		const logDir = "./logs";
		const logFile = `log-${now.format("YYYY-MM-DD")}.txt`;
		const msg = `${now.format("YYYY-MM-DD HH:mm:ss")} ${message}`;

		if (!fs.existsSync(logDir)) {
			fs.mkdirSync(logDir, { recursive: true });
		}

		const logFilePath = path.join(logDir, logFile);

		if (!fs.existsSync(logFilePath)) {
			fs.writeFileSync(logFilePath, `${msg}\n`);
		} else {
			fs.appendFileSync(logFilePath, `${msg}\n`);
		}
	};
	ltf();
};

module.exports = logToFile;
