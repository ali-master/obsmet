import fs from "fs";
import path from "path";
import chalk from "chalk";
import cronjob from "node-schedule";
import PromiseFtp from "promise-ftp";

const ftp = new PromiseFtp();

function connect({ filePath, savePath, username: user, password, host }) {
	return fireDate => {
		ftp.connect({ host, user, password })
			.then(serverMessage => ftp.get(filePath))
			.then(stream => {
				return new Promise((resolve, reject) => {
					stream.once("close", resolve);
					stream.once("error", reject);
					stream.pipe(fs.createWriteStream(savePath));
				});
			})
			.then(() => {
				console.log(chalk.green("Station report file was successfully downloaded", chalk.green.bold(fireDate)));

				return ftp.end();
			})
			.catch(err => {
				console.log(chalk.red("error", err));
			});
	};
}

function createDir(dir) {
	return () => {
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);

			return true;
		}

		return false;
	};
}

export default props => {
	const host = props.host || process.env.FTP_HOST; // 192.168.2.120
	const username = props.username || process.env.FTP_USERNAME; // vista
	const password = props.password || process.env.FTP_PASSWORD; // 123
	const scheduleJob = props.scheduleJob || process.env.FTP_SCHEDULE_JOB; // "10 */5 * * * *"
	const downloadPath = props.downloadPath || process.env.FTP_DOWNLOAD_PATH; // ./downloaded
	const filePath = props.filePath || process.env.FTP_FILE_PATH; // /NandFlash/DA9000/Archivio/6.dat
	const savePath = (props.savePath || process.env.FTP_SAVE_PATH).replace(/\.\[hash\]/, ""); // ./downloaded/downloaded.dat

	const queue = [
		createDir(path.join(process.cwd(), downloadPath)),
		connect({
			host,
			username,
			password,
			filePath,
			savePath: path.join(process.cwd(), savePath),
		}),
	];

	cronjob.scheduleJob(scheduleJob, fireDate => {
		queue.forEach(fn => fn(fireDate));
	});

	return new Promise(resolve => {
		resolve({
			cronjob,
			ftp,
			serviceName: "FTP-connector",
		});
	});
};
