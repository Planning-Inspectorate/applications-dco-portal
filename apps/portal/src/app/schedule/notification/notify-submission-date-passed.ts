import cron from 'node-cron';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import { PortalService } from '#service';
import { formatDateForDisplay } from '@planning-inspectorate/dynamic-forms';
import { DEFAULT_PROJECT_EMAIL_ADDRESS } from '@pins/dco-portal-lib/govnotify/constants.ts';

export function registerDailyJob(service: PortalService) {
	cron.schedule('* * * * *', async () => {
		await dispatchSubmissionDatePassedNotifications(service);
	});
}

export async function dispatchSubmissionDatePassedNotifications(service: PortalService) {
	const { db, logger, notifyClient, redisClient } = service;
	if (!db || !notifyClient || !redisClient) {
		logger.warn('Required client interfaces not started. Daily scheduled cron will be skipped.');
		return;
	}

	const lockKey = 'submission-date-passed-lock';

	try {
		const acquired = await redisClient?.set(lockKey, 'locked', {
			condition: 'NX', // Only set the key if it does not exist
			expiration: { type: 'EX', value: 60 * 10 } // TTL - 10 minutes
		});

		if (!acquired) {
			logger.info('Another instance is running the daily submission date passed job.');
			return;
		}

		logger.info('Running daily submission date passed job...');

		logger.info('fetching cases not submitted and anticipated date of submission is two days in the past');

		const twoDaysAgo = subDays(new Date(), 2);
		const cases = await db.case.findMany({
			where: {
				anticipatedDateOfSubmission: {
					gte: startOfDay(twoDaysAgo),
					lte: endOfDay(twoDaysAgo)
				},
				submissionDate: null
			}
		});

		cases.forEach((caseData) => {
			logger.info(`sending submission date passed email to case reference: ${caseData.reference}`);
			notifyClient.sendSubmissionDatePassedNotification(caseData.email, {
				case_reference_number: caseData.reference,
				due_date: formatDateForDisplay(caseData.anticipatedDateOfSubmission as Date, { format: 'd MMMM yyyy' }),
				relevant_team_email_address: caseData.projectEmailAddress || DEFAULT_PROJECT_EMAIL_ADDRESS
			});
		});
	} catch (err) {
		logger.error(`Daily submission date passed job failed: ${err}`);
	} finally {
		await redisClient.del(lockKey);
		logger.info('Lock released.');
	}
}
