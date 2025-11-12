import type { FunctionService } from '../../service.ts';
import type { ServiceBusTopicHandler } from '@azure/functions';
import type { Schemas } from '@planning-inspectorate/data-model';
type ServiceUser = Schemas.ServiceUser;

export function buildNsipServiceUserFunction(service: FunctionService): ServiceBusTopicHandler {
	return async (message, context) => {
		const { db } = service;
		const serviceUserMessage = message as ServiceUser;

		try {
			const normalisedEmail = serviceUserMessage.emailAddress.toLowerCase();
			const serviceUserUpdate = {
				id: serviceUserMessage.id,
				caseReference: serviceUserMessage.caseReference,
				serviceUserType: serviceUserMessage.serviceUserType,
				email: normalisedEmail
			};

			await db.nsipServiceUser.upsert({
				where: {
					caseReference_email: {
						caseReference: serviceUserMessage.caseReference,
						email: normalisedEmail
					}
				},
				update: serviceUserUpdate,
				create: serviceUserUpdate
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
