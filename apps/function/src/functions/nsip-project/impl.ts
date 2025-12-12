import type { FunctionService } from '../../service.ts';
import type { InvocationContext, ServiceBusTopicHandler } from '@azure/functions';
import type { Schemas } from '@planning-inspectorate/data-model';
type NSIPProject = Schemas.NSIPProject;

export function buildNsipProjectFunction(service: FunctionService): ServiceBusTopicHandler {
	return async (message: NSIPProject, context: InvocationContext) => {
		const { db } = service;

		if (!message || !message.caseId || !message.caseReference) {
			context.log('NSIP Project function exited with no caseReference');
			return;
		}

		try {
			const nsipProjectUpdate = {
				caseId: message.caseId,
				caseReference: message.caseReference,
				...(message.projectName && { projectName: message.projectName }),
				...(message.projectDescription && { projectDescription: message.projectDescription }),
				...(message.projectLocation && { projectLocation: message.projectLocation }),
				...(message.easting && { easting: message.easting }),
				...(message.northing && { northing: message.northing })
			};

			await db.nsipProject.upsert({
				where: {
					caseReference: message.caseReference
				},
				update: nsipProjectUpdate,
				create: nsipProjectUpdate
			});

			context.log('NSIP Project function run successfully');
		} catch (error) {
			let errorMessage;
			if (error instanceof Error) {
				context.error('Error during NSIP Project function run: ', error);
				errorMessage = error.message;
			}
			throw new Error('Error during NSIP Project function run: ' + errorMessage);
		}
	};
}
