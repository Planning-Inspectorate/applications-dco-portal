export interface Config {
	gitSha: string;
	fileUpload: {
		maxSizeInBytes: number;
	};
	logLevel: string;
	NODE_ENV: string;
	httpPort: number;
}
