export interface Config {
	gitSha: string;
	fileUpload: {
		maxSizeInBytes: number;
		path: string;
	};
	logLevel: string;
	NODE_ENV: string;
	httpPort: number;
}
