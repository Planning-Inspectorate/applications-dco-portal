import type { FunctionService } from '../../service.ts';
import type { ServiceBusTopicHandler } from '@azure/functions';

interface ServiceUserMessage {
	id: string;
	caseReference: string;
	serviceUserType: string;
	emailAddress: string;
}

export function buildNsipServiceUserFunction(service: FunctionService): ServiceBusTopicHandler {
	return async (message, context) => {
		const { db } = service;
		const serviceUserMessage = message as ServiceUserMessage;

		try {
			const serviceUserUpdate = {
				id: serviceUserMessage.id,
				caseReference: serviceUserMessage.caseReference,
				serviceUserType: serviceUserMessage.serviceUserType,
				email: serviceUserMessage.emailAddress
			};

			await db.$transaction(async ($tx) => {
				await $tx.nsipServiceUser.upsert({
					where: { caseReference: serviceUserMessage.caseReference },
					update: serviceUserUpdate,
					create: serviceUserUpdate
				});
			});

			context.log('NSIP Service User function run successfully');
		} catch (error) {
			let message;
			if (error instanceof Error) {
				context.error('Error during NSIP Service User function run: ', error);
				message = error.message;
			}
			throw new Error('Error during NSIP Service User function run: ' + message);
		}
	};
}
