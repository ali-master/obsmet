export default {
	services: {
		FTPConnector: {
			host: "192.168.2.120",
			username: "vista",
			password: "123",
			scheduleJob: "10 */5 * * * *",
			downloadPath: "./repository/ftp-connector",
			filePath: "/NandFlash/DA9000/Archivio/6.dat",
			savePath: "./repository/ftp-connector/download.[hash].dat",
		},
	},
};
