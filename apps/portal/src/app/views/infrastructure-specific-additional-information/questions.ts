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
		electricityGrid: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Electricity Grid',
			pageTitle: 'Electricity Grid',
			question: 'Who will design and build the connection to the electricity grid?',
			fieldName: 'electricityGrid',
			url: 'electricity-grid',
			validators: [
				new StringValidator({
					maxLength: { maxLength: 2000 },
					minLength: { minLength: 2 }
				})
			]
		},
		gasFuelledGeneratingStation: {
			type: COMPONENT_TYPES.BOOLEAN,
			title: 'Gas Fuelled Generating Station',
			question: 'Gas Fuelled Generating Station',
			fieldName: 'gasFuelledGeneratingStation',
			url: 'gas-fuelled-generating-station',
			validators: [new RequiredValidator()]
		},
		gasPipelineConnection: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Gas Pipeline Connection',
			pageTitle: 'Gas Pipeline Connection',
			question: 'Who will design and build the gas pipeline connection to the generating station?',
			fieldName: 'gasPipelineConnection',
			url: 'gas-pipeline-connection',
			validators: [
				new StringValidator({
					maxLength: { maxLength: 2000 },
					minLength: { minLength: 2 }
				})
			]
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
		highwayGroundLevels: {
			type: COMPONENT_TYPES.SINGLE_LINE_INPUT,
			title: 'Highway Ground Levels',
			pageTitle: 'Highway Ground Levels',
			question: 'What are the ground levels of the project?',
			fieldName: 'highwayGroundLevels',
			url: 'highway-ground-levels',
			validators: [new RequiredValidator()]
		},
		highwayBridgeHeights: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Highway Bridge Heights and Elevated Works',
			pageTitle: 'Highway Bridge Heights and Elevated Works',
			question: 'What is the height of every bridge, viaduct, aqueduct, embankment and elevated guide way?',
			fieldName: 'highwayBridgeHeights',
			url: 'highway-height-of-bridges-and-elevated-works',
			validators: [
				new StringValidator({
					maxLength: { maxLength: 2000 },
					minLength: { minLength: 2 }
				})
			]
		},
		highwayTunnelDepths: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Highway Cutting and Tunnel Depths',
			pageTitle: 'Highway Cutting and Tunnel Depths',
			question: 'What is the depth of every cutting and tunnel?',
			fieldName: 'highwayTunnelDepths',
			url: 'highway-depth-of-cuttings-and-tunnels',
			validators: [
				new StringValidator({
					maxLength: { maxLength: 2000 },
					minLength: { minLength: 2 }
				})
			]
		},
		highwayTidalWaterLevels: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Highway Levels of Tidal Waters or Inland Waterways',
			pageTitle: 'Highway Levels of Tidal Waters or Inland Waterways',
			question: 'What are the levels of the bed of relevant tidal waters or inland waterways?',
			fieldName: 'highwayTidalWaterLevels',
			url: 'highway-levels-of-tidal-waters-or-inland-waterways',
			validators: [
				new StringValidator({
					maxLength: { maxLength: 2000 },
					minLength: { minLength: 2 }
				})
			]
		},
		highwayHeightOfStructures: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Highway Height of Structures or Devices',
			pageTitle: 'Highway Height of Structures or Devices',
			question:
				'What is the height of every structure or device intended to be erected above, on or below the bed of tidal waters or inland waterways?',
			fieldName: 'highwayHeightOfStructures',
			url: 'highway-height-of-structures-or-devices',
			validators: [
				new StringValidator({
					maxLength: { maxLength: 2000 },
					minLength: { minLength: 2 }
				})
			]
		},
		highwayDrainageOutfallDetails: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Highway Drainage Outfall Details',
			pageTitle: 'Highway Drainage Outfall Details',
			question: 'What are the drainage outfall details for highways?',
			fieldName: 'highwayDrainageOutfallDetails',
			url: 'highway-drainage-outfall-details',
			validators: [
				new StringValidator({
					maxLength: { maxLength: 2000 },
					minLength: { minLength: 2 }
				})
			]
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
		railwayGroundLevels: {
			type: COMPONENT_TYPES.SINGLE_LINE_INPUT,
			title: 'Railway Ground Levels',
			pageTitle: 'Railway Ground Levels',
			question: 'What are the ground levels of the project?',
			fieldName: 'railwayGroundLevels',
			url: 'railway-ground-levels',
			validators: [new RequiredValidator()]
		},
		railwayBridgeHeights: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Railway Bridge Heights and Elevated Works',
			pageTitle: 'Railway Bridge Heights and Elevated Works',
			question: 'What is the height of every bridge, viaduct, aqueduct, embankment and elevated guide way?',
			fieldName: 'railwayBridgeHeights',
			url: 'railway-height-of-bridges-and-elevated-works',
			validators: [
				new StringValidator({
					maxLength: { maxLength: 2000 },
					minLength: { minLength: 2 }
				})
			]
		},
		railwayTunnelDepths: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Railway Cutting and Tunnel Depths',
			pageTitle: 'Railway Cutting and Tunnel Depths',
			question: 'What is the depth of every cutting and tunnel?',
			fieldName: 'railwayTunnelDepths',
			url: 'railway-depth-of-cuttings-and-tunnels',
			validators: [
				new StringValidator({
					maxLength: { maxLength: 2000 },
					minLength: { minLength: 2 }
				})
			]
		},
		railwayTidalWaterLevels: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Railway Levels of Tidal Waters or Inland Waterways',
			pageTitle: 'Railway Levels of Tidal Waters or Inland Waterways',
			question: 'What are the levels of the bed of relevant tidal waters or inland waterways?',
			fieldName: 'railwayTidalWaterLevels',
			url: 'railway-levels-of-tidal-waters-or-inland-waterways',
			validators: [
				new StringValidator({
					maxLength: { maxLength: 2000 },
					minLength: { minLength: 2 }
				})
			]
		},
		railwayHeightOfStructures: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Railway Height of Structures or Devices',
			pageTitle: 'Railway Height of Structures or Devices',
			question:
				'What is the height of every structure or device intended to be erected above, on or below the bed of tidal waters or inland waterways?',
			fieldName: 'railwayHeightOfStructures',
			url: 'railway-height-of-structures-or-devices',
			validators: [
				new StringValidator({
					maxLength: { maxLength: 2000 },
					minLength: { minLength: 2 }
				})
			]
		},
		railwayDrainageOutfallDetails: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Railway Drainage Outfall Details',
			pageTitle: 'Railway Drainage Outfall Details',
			question: 'What are the drainage outfall details for railways?',
			fieldName: 'railwayDrainageOutfallDetails',
			url: 'railway-drainage-outfall-details',
			validators: [
				new StringValidator({
					maxLength: { maxLength: 2000 },
					minLength: { minLength: 2 }
				})
			]
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
		whyHarbourOrderNeeded: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Why is Harbour Order Needed',
			pageTitle: 'Why is Harbour Order Needed',
			question: 'Why is the order needed to improve, maintain or manage the harbour?',
			fieldName: 'whyHarbourOrderNeeded',
			url: 'why-is-order',
			validators: [
				new StringValidator({
					maxLength: { maxLength: 2000 },
					minLength: { minLength: 2 }
				})
			]
		},
		benefitsToSeaTransport: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Benefits to Sea Transport',
			pageTitle: 'Benefits to Sea Transport',
			question: 'How will the order benefit transport by sea or recreational use of sea-going ships?',
			fieldName: 'benefitsToSeaTransport',
			url: 'benefits-to-sea-transport-and-recreation',
			validators: [
				new StringValidator({
					maxLength: { maxLength: 2000 },
					minLength: { minLength: 2 }
				})
			]
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
