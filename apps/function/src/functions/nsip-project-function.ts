import { initialiseService } from '../init.ts';
import { app } from '@azure/functions';
import { buildNsipProjectFunction } from './nsip-project/impl.ts';

const service = initialiseService();
const { logger, serviceBusConfig } = service;

logger.info('registering nsip-project function to consume on the associated service bus topic');

app.serviceBusTopic('nsip-project', {
	topicName: serviceBusConfig.topics.nsipProject,
	subscriptionName: serviceBusConfig.subscriptions.nsipProject,
	connection: 'ServiceBusConnection',
	handler: buildNsipProjectFunction(service)
});
