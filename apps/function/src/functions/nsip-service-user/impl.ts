import type { FunctionService } from '../../service.ts';
import type { InvocationContext, ServiceBusTopicHandler } from '@azure/functions';
import type { Schemas } from '@planning-inspectorate/data-model';
type ServiceUser = Schemas.ServiceUser;

export function buildNsipServiceUserFunction(service: FunctionService): ServiceBusTopicHandler {
	return async (message: ServiceUser, context: InvocationContext) => {
		const { db } = service;

		if (!message || !message.id || !message.caseReference || !message.emailAddress) {
			context.log('NSIP Service User function exited with no caseReference or emailAddress');
			return;
		}

		try {
			const normalisedEmail = message.emailAddress.toLowerCase();
			const serviceUserUpdate = {
				id: message.id,
				caseReference: message.caseReference,
				email: normalisedEmail,
				...(message.serviceUserType && { serviceUserType: message.serviceUserType }),
				...(message.firstName && { firstName: message.firstName }),
				...(message.lastName && { lastName: message.lastName }),
				...(message.organisation && { organisation: message.organisation }),
				...(message.telephoneNumber && { telephoneNumber: message.telephoneNumber }),
				...(message.addressLine1 && { addressLine1: message.addressLine1 }),
				...(message.addressLine2 && { addressLine2: message.addressLine2 }),
				...(message.addressTown && { addressTown: message.addressTown }),
				...(message.addressCounty && { addressCounty: message.addressCounty }),
				...(message.postcode && { postcode: message.postcode }),
				...(message.addressCountry && { addressCountry: message.addressCountry })
			};

			await db.nsipServiceUser.upsert({
				where: {
					caseReference_email: {
						caseReference: message.caseReference,
						email: normalisedEmail
					}
				},
				update: serviceUserUpdate,
				create: serviceUserUpdate
			});

			context.log('NSIP Service User function run successfully');
		} catch (error) {
			let errorMessage;
			if (error instanceof Error) {
				context.error('Error during NSIP Service User function run: ', error);
				errorMessage = error.message;
			}
			throw new Error('Error during NSIP Service User function run: ' + errorMessage);
		}
	};
}
