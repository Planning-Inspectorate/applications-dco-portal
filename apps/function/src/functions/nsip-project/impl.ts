import type { FunctionService } from '../../service.ts';
import type { ServiceBusTopicHandler } from '@azure/functions';
import type { Schemas } from '@planning-inspectorate/data-model';
type NSIPProject = Schemas.NSIPProject;

export function buildNsipProjectFunction(service: FunctionService): ServiceBusTopicHandler {
	return async (message, context) => {
		const { db } = service;
		const nsipProjectMessage = message as NSIPProject;

		if (!nsipProjectMessage || !nsipProjectMessage.caseReference) {
			context.log('NSIP Project function exited with no caseReference');
			return;
		}

		try {
			const nsipProjectUpdate = {
				caseId: nsipProjectMessage.caseId,
				caseReference: nsipProjectMessage.caseReference,
				...(nsipProjectMessage.projectName && { projectName: nsipProjectMessage.projectName }),
				...(nsipProjectMessage.projectDescription && { projectDescription: nsipProjectMessage.projectDescription }),
				...(nsipProjectMessage.projectLocation && { projectLocation: nsipProjectMessage.projectLocation }),
				...(nsipProjectMessage.easting && { easting: nsipProjectMessage.easting }),
				...(nsipProjectMessage.northing && { northing: nsipProjectMessage.northing })
			};

			await db.nsipProject.upsert({
				where: {
					caseReference: nsipProjectMessage.caseReference
				},
				update: nsipProjectUpdate,
				create: nsipProjectUpdate
			});

			context.log('NSIP Project function run successfully');
		} catch (error) {
			let message;
			if (error instanceof Error) {
				context.error('Error during NSIP Project function run: ', error);
				message = error.message;
			}
			throw new Error('Error during NSIP Project function run: ' + message);
		}
	};
}
