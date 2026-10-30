import { createQuestions, questionClasses, RequiredValidator } from '@planning-inspectorate/dynamic-forms';
import { CUSTOM_COMPONENT_CLASSES, CUSTOM_COMPONENTS } from '@pins/dco-portal-lib/forms/custom-components/index.ts';
import { DOCUMENT_SUB_CATEGORY_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';

export function getQuestions() {
	const questions = {
		newspaperNotices: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Newspaper notices documents',
			question: 'Which documents relate to newspaper notices?',
			fieldName: 'newspaperNotices',
			url: DOCUMENT_SUB_CATEGORY_ID.NEWSPAPER_NOTICES,
			validators: [new RequiredValidator('Select the documents relating to the newspaper notices')]
		}
	};

	const classes = {
		...questionClasses,
		...CUSTOM_COMPONENT_CLASSES
	};

	return createQuestions(questions, classes, {});
}
