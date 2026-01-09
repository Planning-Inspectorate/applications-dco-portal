import { CUSTOM_COMPONENT_CLASSES, CUSTOM_COMPONENTS } from '@pins/dco-portal-lib/forms/custom-components/index.ts';
// @ts-expect-error - due to not having @types
import RequiredValidator from '@planning-inspectorate/dynamic-forms/src/validator/required-validator.js';
// @ts-expect-error - due to not having @types
import StringValidator from '@planning-inspectorate/dynamic-forms/src/validator/string-validator.js';
// @ts-expect-error - due to not having @types
import { questionClasses } from '@planning-inspectorate/dynamic-forms/src/questions/questions.js';
// @ts-expect-error - due to not having @types
import { createQuestions } from '@planning-inspectorate/dynamic-forms/src/questions/create-questions.js';
// @ts-expect-error - due to not having @types
import { COMPONENT_TYPES } from '@planning-inspectorate/dynamic-forms';
import {
	DOCUMENT_CATEGORY_ID,
	DOCUMENT_SUB_CATEGORY,
	DOCUMENT_SUB_CATEGORY_ID
} from '@pins/dco-portal-database/src/seed/data-static.ts';
import { referenceDataToRadioOptions } from '@pins/dco-portal-lib/util/questions.ts';
import HTML_TEMPLATES from './html-templates.ts';
import { SELECT_ALL_THAT_APPLY_HTML } from '../common-html-templates.ts';

export function getQuestions() {
	const ADDITIONAL_INFORMATION_DOCUMENTS_SUBCATEGORY_OPTIONS = DOCUMENT_SUB_CATEGORY.filter(
		(cat) => cat.categoryId === DOCUMENT_CATEGORY_ID.ADDITIONAL_PRESCRIBED_INFORMATION
	);

	const questions = {
		hasAdditionalInformation: {
			type: CUSTOM_COMPONENTS.DESCRIPTIVE_BOOLEAN,
			title: 'Additional Information',
			question: 'Additional Information',
			html: HTML_TEMPLATES.HAS_ADDITIONAL_INFORMATION_HTML,
			fieldName: 'hasAdditionalInformation',
			url: 'additional-information',
			validators: [new RequiredValidator()]
		},
		additionalInformationDescription: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Additional Information Description',
			pageTitle: 'Additional Information Description',
			question: 'Describe the additional information required',
			fieldName: 'additionalInformationDescription',
			url: 'additional-information-description',
			validators: [
				new StringValidator({
					maxLength: { maxLength: 2000 },
					minLength: { minLength: 2 }
				})
			]
		},
		additionalInformationDocuments: {
			type: COMPONENT_TYPES.CHECKBOX,
			title: 'Additional Information Documents',
			pageTitle: 'Additional Information Documents',
			question: 'Which of these types of development is the project?',
			html: SELECT_ALL_THAT_APPLY_HTML,
			fieldName: 'additionalInformationDocuments',
			url: 'additional-information-documents',
			options: referenceDataToRadioOptions(ADDITIONAL_INFORMATION_DOCUMENTS_SUBCATEGORY_OPTIONS),
			validators: [new RequiredValidator()]
		},
		nonOffshoreGeneratingStation: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Non Offshore Generating Station',
			pageTitle: 'Non Offshore Generating Station',
			question: 'Non Offshore Generating Station',
			html: HTML_TEMPLATES.OPTIONAL_SUBCATEGORY_SUBTITLE_HTML,
			fieldName: 'nonOffshoreGeneratingStation',
			url: DOCUMENT_SUB_CATEGORY_ID.NON_OFFSHORE_GENERATING_STATION,
			validators: [new RequiredValidator()]
		},
		cableInstallation: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Offshore Cable Installation',
			pageTitle: 'Offshore Cable Installation',
			question: 'Provide details of the route and method of installation for any cable',
			fieldName: 'cableInstallation',
			url: 'cable-installation',
			validators: [
				new StringValidator({
					maxLength: { maxLength: 2000 },
					minLength: { minLength: 2 }
				})
			]
		},
		safetyZones: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Offshore Safety Zones',
			pageTitle: 'Offshore Safety Zones',
			question: 'Will applications be made for safety zones?',
			fieldName: 'safetyZones',
			url: 'safety-zones',
			validators: [
				new StringValidator({
					maxLength: { maxLength: 2000 },
					minLength: { minLength: 2 }
				})
			]
		},
		offshoreGeneratingStation: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Offshore Generating Station',
			pageTitle: 'Offshore Generating Station',
			question: 'Offshore Generating Station',
			html: HTML_TEMPLATES.OPTIONAL_SUBCATEGORY_SUBTITLE_HTML,
			fieldName: 'offshoreGeneratingStation',
			url: DOCUMENT_SUB_CATEGORY_ID.OFFSHORE_GENERATING_STATION,
			validators: [new RequiredValidator()]
		},
		highwayRelatedDevelopment: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Highway Related Development',
			pageTitle: 'Highway Related Development',
			question: 'Highway Related Development',
			html: HTML_TEMPLATES.OPTIONAL_SUBCATEGORY_SUBTITLE_HTML,
			fieldName: 'highwayRelatedDevelopment',
			url: DOCUMENT_SUB_CATEGORY_ID.HIGHWAY_RELATED_DEVELOPMENT,
			validators: [new RequiredValidator()]
		},
		railwayDevelopment: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Railway Development',
			pageTitle: 'Railway Development',
			question: 'Railway Development',
			html: HTML_TEMPLATES.OPTIONAL_SUBCATEGORY_SUBTITLE_HTML,
			fieldName: 'railwayDevelopment',
			url: DOCUMENT_SUB_CATEGORY_ID.RAILWAY_DEVELOPMENT,
			validators: [new RequiredValidator()]
		},
		harbourFacilities: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Harbour Facilities',
			pageTitle: 'Harbour Facilities',
			question: 'Harbour Facilities',
			html: HTML_TEMPLATES.OPTIONAL_SUBCATEGORY_SUBTITLE_HTML,
			fieldName: 'harbourFacilities',
			url: DOCUMENT_SUB_CATEGORY_ID.HARBOUR_FACILITIES,
			validators: [new RequiredValidator()]
		},
		pipelines: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Pipelines',
			pageTitle: 'Pipelines',
			question: 'Pipelines',
			html: HTML_TEMPLATES.OPTIONAL_SUBCATEGORY_SUBTITLE_HTML,
			fieldName: 'pipelines',
			url: DOCUMENT_SUB_CATEGORY_ID.PIPELINES,
			validators: [new RequiredValidator()]
		},
		hazardousWasteFacility: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Hazardous Waste Facility',
			pageTitle: 'Hazardous Waste Facility',
			question: 'Hazardous Waste Facility',
			html: HTML_TEMPLATES.OPTIONAL_SUBCATEGORY_SUBTITLE_HTML,
			fieldName: 'hazardousWasteFacility',
			url: DOCUMENT_SUB_CATEGORY_ID.HAZARDOUS_WASTE_FACILITY,
			validators: [new RequiredValidator()]
		},
		damOrReservoir: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Dam or Reservoir',
			pageTitle: 'Dam or Reservoir',
			question: 'Dam or Reservoir',
			html: HTML_TEMPLATES.OPTIONAL_SUBCATEGORY_SUBTITLE_HTML,
			fieldName: 'damOrReservoir',
			url: DOCUMENT_SUB_CATEGORY_ID.DAM_OR_RESERVOIR,
			validators: [new RequiredValidator()]
		}
	};

	const classes = {
		...questionClasses,
		...CUSTOM_COMPONENT_CLASSES
	};

	return createQuestions(questions, classes, {});
}
