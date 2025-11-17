import type { FunctionService } from '../../service.ts';
import type { ServiceBusTopicHandler } from '@azure/functions';
import type { Schemas } from '@planning-inspectorate/data-model';
type ServiceUser = Schemas.ServiceUser;

export function buildNsipServiceUserFunction(service: FunctionService): ServiceBusTopicHandler {
	return async (message, context) => {
		const { db } = service;
		const serviceUserMessage = message as ServiceUser;

		if (
			!serviceUserMessage ||
			!serviceUserMessage.id ||
			!serviceUserMessage.caseReference ||
			!serviceUserMessage.emailAddress
		) {
			context.log('NSIP Service User function exited with no caseReference or emailAddress');
			return;
		}

		try {
			const normalisedEmail = serviceUserMessage.emailAddress.toLowerCase();
			const serviceUserUpdate = {
				id: serviceUserMessage.id,
				caseReference: serviceUserMessage.caseReference,
				email: normalisedEmail,
				...(serviceUserMessage.serviceUserType && { serviceUserType: serviceUserMessage.serviceUserType }),
				...(serviceUserMessage.firstName && { firstName: serviceUserMessage.firstName }),
				...(serviceUserMessage.lastName && { lastName: serviceUserMessage.lastName }),
				...(serviceUserMessage.organisation && { organisation: serviceUserMessage.organisation }),
				...(serviceUserMessage.telephoneNumber && { telephoneNumber: serviceUserMessage.telephoneNumber }),
				...(serviceUserMessage.addressLine1 && { addressLine1: serviceUserMessage.addressLine1 }),
				...(serviceUserMessage.addressLine2 && { addressLine2: serviceUserMessage.addressLine2 }),
				...(serviceUserMessage.addressTown && { addressTown: serviceUserMessage.addressTown }),
				...(serviceUserMessage.addressCounty && { addressCounty: serviceUserMessage.addressCounty }),
				...(serviceUserMessage.postcode && { postcode: serviceUserMessage.postcode }),
				...(serviceUserMessage.addressCountry && { addressCountry: serviceUserMessage.addressCountry })
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
