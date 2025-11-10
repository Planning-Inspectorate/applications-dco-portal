import { initialiseService } from '../init.ts';
import { app } from '@azure/functions';
import { buildNsipServiceUserFunction } from './nsip-service-user/impl.ts';

const service = initialiseService();
const { logger, serviceBusConfig } = service;

logger.info('registering nsip-service-user function to consume on the associated service bus topic');

app.serviceBusTopic('appeal-document', {
	topicName: serviceBusConfig.topics.serviceUser,
	subscriptionName: serviceBusConfig.subscriptions.serviceUser,
	connection: 'ServiceBusConnection',
	handler: buildNsipServiceUserFunction(service)
});
