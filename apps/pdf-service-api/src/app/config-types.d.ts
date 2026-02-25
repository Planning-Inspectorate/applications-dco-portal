export interface Config {
	gitSha?: string;
	fileUpload: {
		maxSize: string;
	};
	logLevel: string;
	NODE_ENV: string;
	httpPort: number;
}
