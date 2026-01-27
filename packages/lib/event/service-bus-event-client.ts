import { DefaultAzureCredential } from '@azure/identity';
import { ServiceBusClient, type ServiceBusSender } from '@azure/service-bus';
import type { Logger } from 'pino';

export const DATA_SUBMISSIONS_TOPIC_NAME = 'dco-portal-data-submissions';

export const EVENT_TYPE = {
	CREATE: 'Create',
	UPDATE: 'Update',
	DELETE: 'Delete',
	PUBLISH: 'Publish',
	UNPUBLISH: 'Unpublish'
};

export class ServiceBusEventClient {
	private logger: Logger;
	private client: ServiceBusClient;

	constructor(logger: Logger, serviceBusHostname: string) {
		this.client = new ServiceBusClient(serviceBusHostname, new DefaultAzureCredential(), {
			retryOptions: { maxRetries: 3 }
		});
		this.logger = logger;
	}

	#createSender = (topic: string): ServiceBusSender => {
		return this.client.createSender(topic);
	};

	#createTraceId = (): number => {
		return Date.now();
	};

	#transformMessagesToSend = (events: object[], traceId: number, type: string) => {
		return events.map((body) => ({
			body,
			contentType: 'application/json',
			applicationProperties: {
				version: '0.1',
				traceId,
				type
			}
		}));
	};

	sendEvents = async (topic: string, events: any[], eventType: string) => {
		const traceId = this.#createTraceId();
		const sender = this.#createSender(topic);

		this.logger.info(
			`Publishing ${events.length} events to topic ${topic} with type ${eventType} and trace id ${traceId}`
		);

		await sender.sendMessages(this.#transformMessagesToSend(events, traceId, eventType));

		return events;
	};
}
