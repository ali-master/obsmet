import ServiceResolver from "./services";

// All project config
import propjectConfig from "./project.config";

import chalk from "chalk";
// lodash
import get from "lodash/get";
import once from "lodash/once";

class OBSMET {
	constructor(props = {}) {
		this.services = props.services || ServiceResolver;
	}

	init = async () => {
		await this.run("Services");
	};

	run = provider => {
		return new Promise((resolve, reject) => {
			const newProvider = `prepare${provider}`;

			if (this.hasOwnProperty(newProvider)) {
				once(get(this, newProvider))();

				resolve(true);
			} else {
				const error = new Error(`${provider} does not exist, please check it again`);

				reject(error);

				return error;
			}
		});
	};

	prepareServices = () => {
		console.log(chalk.yellow("Running Services:"));
		this.services.forEach((service, index) => {
			service
				.module(propjectConfig.services[service.name])
				.then(({ serviceName }) => {
					console.log(chalk.green(`\t #${index + 1}: The ${chalk.magenta.underline.bold(serviceName)} service was started successfully.`));
				})
				.catch(error => {
					console.error(error);
				});
		});
	};
}

new OBSMET().init();

export default OBSMET;
