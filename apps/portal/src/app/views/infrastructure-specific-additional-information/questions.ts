import { CUSTOM_COMPONENT_CLASSES, CUSTOM_COMPONENTS } from '@pins/dco-portal-lib/forms/custom-components/index.ts';
// @ts-expect-error - due to not having @types
import RequiredValidator from '@planning-inspectorate/dynamic-forms/src/validator/required-validator.js';
// @ts-expect-error - due to not having @types
import MultiFieldInputValidator from '@planning-inspectorate/dynamic-forms/src/validator/multi-field-input-validator.js';
// @ts-expect-error - due to not having @types
import StringValidator from '@planning-inspectorate/dynamic-forms/src/validator/string-validator.js';
// @ts-expect-error - due to not having @types
import { questionClasses } from '@planning-inspectorate/dynamic-forms/src/questions/questions.js';
// @ts-expect-error - due to not having @types
import { createQuestions } from '@planning-inspectorate/dynamic-forms/src/questions/create-questions.js';
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
			validators: [new RequiredValidator('Select yes if additional information is required')]
		},
		additionalInformationDescription: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Additional Information Description',
			pageTitle: 'Additional Information Description',
			question: 'Describe the additional information required',
			fieldName: 'additionalInformationDescription',
			url: 'additional-information-description',
			validators: [
				new RequiredValidator('Enter the additional information description'),
				new StringValidator({
					minLength: {
						minLength: 2,
						minLengthMessage: 'Additional information description must be 2 characters or more'
					},
					maxLength: {
						maxLength: 2000,
						maxLengthMessage: 'Additional information description must be 2000 characters or less'
					}
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
			validators: [new RequiredValidator('Select the type of development')]
		},
		electricityGrid: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Electricity Grid',
			pageTitle: 'Electricity Grid',
			question: 'Who will design and build the connection to the electricity grid?',
			fieldName: 'electricityGrid',
			url: 'electricity-grid',
			validators: [
				new RequiredValidator('Enter who will design and build the connection to the electricity grid'),
				new StringValidator({
					minLength: {
						minLength: 2,
						minLengthMessage:
							'Who will design and build the connection to the electricity grid must be 2 characters or more'
					},
					maxLength: {
						maxLength: 2000,
						maxLengthMessage:
							'Who will design and build the connection to the electricity grid must be 2000 characters or less'
					}
				})
			]
		},
		gasFuelledGeneratingStation: {
			type: COMPONENT_TYPES.BOOLEAN,
			title: 'Gas Fuelled Generating Station',
			question: 'Gas Fuelled Generating Station',
			fieldName: 'gasFuelledGeneratingStation',
			url: 'gas-fuelled-generating-station',
			validators: [new RequiredValidator('Select yes if the project is a gas fuelled generating station')]
		},
		gasPipelineConnection: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Gas Pipeline Connection',
			pageTitle: 'Gas Pipeline Connection',
			question: 'Who will design and build the gas pipeline connection to the generating station?',
			fieldName: 'gasPipelineConnection',
			url: 'gas-pipeline-connection',
			validators: [
				new RequiredValidator('Enter who will design and build the gas pipeline connection'),
				new StringValidator({
					minLength: {
						minLength: 2,
						minLengthMessage: 'Who will design and build the gas pipeline connection must be 2 characters or more'
					},
					maxLength: {
						maxLength: 2000,
						maxLengthMessage: 'Who will design and build the gas pipeline connection must be 2000 characters or less'
					}
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
			validators: [new RequiredValidator('Select which documents provide additional information')]
		},
		cableInstallation: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Offshore Cable Installation',
			pageTitle: 'Offshore Cable Installation',
			question: 'Provide details of the route and method of installation for any cable',
			fieldName: 'cableInstallation',
			url: 'cable-installation',
			validators: [
				new RequiredValidator('Enter the details of the route and method of installation for any cable'),
				new StringValidator({
					minLength: {
						minLength: 2,
						minLengthMessage:
							'Details of the route and method of installation for any cable must be 2 characters or more'
					},
					maxLength: {
						maxLength: 2000,
						maxLengthMessage:
							'Details of the route and method of installation for any cable must be 2000 characters or less'
					}
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
				new RequiredValidator('Enter whether you will apply for safety zones'),
				new StringValidator({
					minLength: {
						minLength: 2,
						minLengthMessage: 'Statement about applications for safety zones must be 2 characters or more'
					},
					maxLength: {
						maxLength: 2000,
						maxLengthMessage: 'Statement about applications for safety zones must be 2000 characters or less'
					}
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
			validators: [new RequiredValidator('Select which documents provide additional information')]
		},
		highwayGroundLevels: {
			type: COMPONENT_TYPES.SINGLE_LINE_INPUT,
			title: 'Highway Ground Levels',
			pageTitle: 'Highway Ground Levels',
			question: 'What are the ground levels of the project?',
			fieldName: 'highwayGroundLevels',
			url: 'highway-ground-levels',
			validators: [new RequiredValidator('Enter the ground levels of the project')]
		},
		highwayBridgeHeights: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Highway Bridge Heights and Elevated Works',
			pageTitle: 'Highway Bridge Heights and Elevated Works',
			question: 'What is the height of every bridge, viaduct, aqueduct, embankment and elevated guide way?',
			fieldName: 'highwayBridgeHeights',
			url: 'highway-height-of-bridges-and-elevated-works',
			validators: [
				new RequiredValidator(
					'Enter the heights of every bridge, viaduct, aqueduct, embankment and elevated guide way'
				),
				new StringValidator({
					minLength: {
						minLength: 2,
						minLengthMessage:
							'Information about the heights of every bridge, viaduct, aqueduct, embankment and elevated guide way must be 2 characters or more'
					},
					maxLength: {
						maxLength: 2000,
						maxLengthMessage:
							'Information about the heights of every bridge, viaduct, aqueduct, embankment and elevated guide way must be 2000 characters or less'
					}
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
				new RequiredValidator('Enter the depth of every cutting and tunnel'),
				new StringValidator({
					minLength: {
						minLength: 2,
						minLengthMessage: 'Information about the depth of every cutting and tunnel must be 2 characters or more'
					},
					maxLength: {
						maxLength: 2000,
						maxLengthMessage: 'Information about the depth of every cutting and tunnel must be 2000 characters or less'
					}
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
				new RequiredValidator('Enter the bed levels of relevant tidal waters or inland waterways'),
				new StringValidator({
					minLength: {
						minLength: 2,
						minLengthMessage: 'Bed levels of relevant tidal waters or inland waterways must be 2 characters or more'
					},
					maxLength: {
						maxLength: 2000,
						maxLengthMessage: 'Bed levels of relevant tidal waters or inland waterways must be 2000 characters or less'
					}
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
				new RequiredValidator(
					'Enter the height of every structure or device intended to be erected above, on or below the bed of tidal waters or inland waterways'
				),
				new StringValidator({
					minLength: {
						minLength: 2,
						minLengthMessage:
							'Information about the height of every tidal and inland waterway bed structure or device must be 2 characters or more'
					},
					maxLength: {
						maxLength: 2000,
						maxLengthMessage:
							'Information about the height of every tidal and inland waterway bed structure or device must be 2000 characters or less'
					}
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
				new RequiredValidator('Enter the drainage outfall details for highways '),
				new StringValidator({
					minLength: {
						minLength: 2,
						minLengthMessage: 'Drainage outfall details for highways must be 2 characters or more'
					},
					maxLength: {
						maxLength: 2000,
						maxLengthMessage: 'Drainage outfall details for highways must be 2000 characters or less'
					}
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
			validators: [new RequiredValidator('Select which documents provide additional information')]
		},
		railwayGroundLevels: {
			type: COMPONENT_TYPES.SINGLE_LINE_INPUT,
			title: 'Railway Ground Levels',
			pageTitle: 'Railway Ground Levels',
			question: 'What are the ground levels of the project?',
			fieldName: 'railwayGroundLevels',
			url: 'railway-ground-levels',
			validators: [new RequiredValidator('Enter the ground levels of the project')]
		},
		railwayBridgeHeights: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Railway Bridge Heights and Elevated Works',
			pageTitle: 'Railway Bridge Heights and Elevated Works',
			question: 'What is the height of every bridge, viaduct, aqueduct, embankment and elevated guide way?',
			fieldName: 'railwayBridgeHeights',
			url: 'railway-height-of-bridges-and-elevated-works',
			validators: [
				new RequiredValidator(
					'Enter the heights of every bridge, viaduct, aqueduct, embankment and elevated guide way'
				),
				new StringValidator({
					minLength: {
						minLength: 2,
						minLengthMessage:
							'Information about the heights of every bridge, viaduct, aqueduct, embankment and elevated guide way must be 2 characters or more'
					},
					maxLength: {
						maxLength: 2000,
						maxLengthMessage:
							'Information about the heights of every bridge, viaduct, aqueduct, embankment and elevated guide way must be 2000 characters or less'
					}
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
				new RequiredValidator('Enter the depth of every cutting and tunnel'),
				new StringValidator({
					minLength: {
						minLength: 2,
						minLengthMessage: 'Information about the depth of every cutting and tunnel must be 2 characters or more'
					},
					maxLength: {
						maxLength: 2000,
						maxLengthMessage: 'Information about the depth of every cutting and tunnel must be 2000 characters or less'
					}
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
				new RequiredValidator('Enter the levels of the bed of relevant tidal waters or inland waterways'),
				new StringValidator({
					minLength: {
						minLength: 2,
						minLengthMessage:
							'The levels of the bed of relevant tidal waters or inland waterways must be 2 characters or more'
					},
					maxLength: {
						maxLength: 2000,
						maxLengthMessage:
							'The levels of the bed of relevant tidal waters or inland waterways must be 2000 characters or less'
					}
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
				new RequiredValidator(
					'Enter the height of every structure or device intended to be erected above, on or below the bed of tidal waters or inland waterways'
				),
				new StringValidator({
					minLength: {
						minLength: 2,
						minLengthMessage:
							'Information about the height of every tidal and inland waterway bed structure or device must be 2 characters or more'
					},
					maxLength: {
						maxLength: 2000,
						maxLengthMessage:
							'Information about the height of every tidal and inland waterway bed structure or device must be 2000 characters or less'
					}
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
				new RequiredValidator('Enter the drainage outfall details for railways'),
				new StringValidator({
					minLength: {
						minLength: 2,
						minLengthMessage: 'Drainage outfall details for railways must be 2 characters or more'
					},
					maxLength: {
						maxLength: 2000,
						maxLengthMessage: 'Drainage outfall details for railways must be 2000 characters or less'
					}
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
			validators: [new RequiredValidator('Select which documents provide additional information')]
		},
		whyHarbourOrderNeeded: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Why is Harbour Order Needed',
			pageTitle: 'Why is Harbour Order Needed',
			question: 'Why is the order needed to improve, maintain or manage the harbour?',
			fieldName: 'whyHarbourOrderNeeded',
			url: 'why-is-order',
			validators: [
				new RequiredValidator('Enter why the order is needed to improve, maintain or manage the harbour'),
				new StringValidator({
					minLength: {
						minLength: 2,
						minLengthMessage:
							'Why the order is needed to improve, maintain or manage the harbour must be 2 characters or more'
					},
					maxLength: {
						maxLength: 2000,
						maxLengthMessage:
							'Why the order is needed to improve, maintain or manage the harbour must be 2000 characters or less'
					}
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
				new RequiredValidator(
					'Enter how the order will benefit transport by sea or recreational use of sea-going ships'
				),
				new StringValidator({
					minLength: {
						minLength: 2,
						minLengthMessage:
							'How the order will benefit transport by sea or recreational use of sea-going ships must be 2 characters or more'
					},
					maxLength: {
						maxLength: 2000,
						maxLengthMessage:
							'How the order will benefit transport by sea or recreational use of sea-going ships must be 2000 characters or less'
					}
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
			validators: [new RequiredValidator('Select which documents provide additional information')]
		},
		pipelineDetails: {
			type: COMPONENT_TYPES.MULTI_FIELD_INPUT,
			title: `Pipeline Details`,
			pageTitle: `Pipeline Details`,
			question: `Enter pipeline details`,
			fieldName: `pipelineDetails`,
			url: `pipeline-details`,
			validators: [
				new MultiFieldInputValidator({
					fields: [
						{
							fieldName: `pipelineName`,
							required: true,
							errorMessage: 'Enter the pipeline’s name',
							regex: { regex: /^[A-Za-z ]+$/, regexMessage: 'Name must only contain letters' },
							minLength: { minLength: 2, minLengthMessage: 'Name must be at least 2 characters in length' }
						},
						{
							fieldName: `pipelineOwner`,
							required: true,
							errorMessage: 'Enter the pipeline’s owner',
							regex: { regex: /^[A-Za-z ]+$/, regexMessage: 'Owner must only contain letters' },
							minLength: { minLength: 2, minLengthMessage: 'Owner must be at least 2 characters in length' }
						},
						{
							fieldName: `pipelineStartPoint`,
							required: true,
							errorMessage: 'Enter the pipeline’s start point',
							minLength: { minLength: 2, minLengthMessage: 'Start point must be at least 2 characters in length' }
						},
						{
							fieldName: `pipelineEndPoint`,
							required: true,
							errorMessage: 'Enter the pipeline’s end point',
							minLength: { minLength: 2, minLengthMessage: 'End point must be at least 2 characters in length' }
						},
						{
							fieldName: `pipelineLength`,
							required: true,
							errorMessage: 'Enter the pipeline’s length',
							regex: { regex: /^\d+$/, regexMessage: 'Length must be a number' },
							minLength: { minLength: 2, minLengthMessage: 'Length must be at least 2 characters in length' }
						},
						{
							fieldName: `pipelineExternalDiameter`,
							required: true,
							errorMessage: 'Enter the pipeline’s external diameter',
							regex: { regex: /^\d+$/, regexMessage: 'Diameter must be a number' },
							minLength: { minLength: 2, minLengthMessage: 'Diameter must be at least 2 characters in length' }
						}
					]
				})
			],
			inputFields: [
				{ fieldName: `pipelineName`, label: 'Name' },
				{ fieldName: `pipelineOwner`, label: 'Owner' },
				{ fieldName: `pipelineStartPoint`, label: 'Start point' },
				{ fieldName: `pipelineEndPoint`, label: 'End point' },
				{ fieldName: `pipelineLength`, label: 'Length (in kilometres)' },
				{ fieldName: `pipelineExternalDiameter`, label: 'External diameter (in mm)' }
			]
		},
		pipelineConveyance: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Pipeline Conveyance',
			pageTitle: 'Pipeline Conveyance',
			question: 'What will the pipeline convey?',
			fieldName: 'pipelineConveyance',
			url: 'what-will-pipeline-convey',
			validators: [
				new RequiredValidator('Enter what the pipeline will convey'),
				new StringValidator({
					minLength: {
						minLength: 2,
						minLengthMessage: 'What the pipeline will convey must be 2 characters or more'
					},
					maxLength: {
						maxLength: 2000,
						maxLengthMessage: 'What the pipeline will convey must be 2000 characters or less'
					}
				})
			]
		},
		landRightsCrossingConsents: {
			type: COMPONENT_TYPES.BOOLEAN,
			title: 'Land Rights Crossing Consents Needed',
			pageTitle: 'Land Rights Crossing Consents Needed',
			question: 'Are rights in land or crossing consents needed?',
			fieldName: 'landRightsCrossingConsents',
			url: 'land-rights-crossing-consents-needed',
			validators: [new RequiredValidator('Select yes if the project needs rights in land or crossing consents')]
		},
		landRightsCrossingConsentsAgreement: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Land Rights Crossing Consents Agreement',
			pageTitle: 'Land Rights Crossing Consents Agreement',
			question: 'Can the rights in land or crossing consents be obtained by agreement?',
			fieldName: 'landRightsCrossingConsentsAgreement',
			url: 'land-rights-crossing-consents-agreement',
			validators: [
				new RequiredValidator('Enter whether parties can obtain rights in land or crossing consents by agreement'),
				new StringValidator({
					minLength: {
						minLength: 2,
						minLengthMessage:
							'Whether the rights in land or crossing consents can be obtained by agreement must be 2 characters or more'
					},
					maxLength: {
						maxLength: 2000,
						maxLengthMessage:
							'Whether the rights in land or crossing consents can be obtained by agreement must be 2000 characters or less'
					}
				})
			]
		},
		pipelines: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Pipelines',
			pageTitle: 'Pipelines',
			question: 'Pipelines',
			html: HTML_TEMPLATES.OPTIONAL_SUBCATEGORY_SUBTITLE_HTML,
			fieldName: 'pipelines',
			url: DOCUMENT_SUB_CATEGORY_ID.PIPELINES,
			validators: [new RequiredValidator('Select which documents provide additional information')]
		},
		whyIsFacilityNeeded: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Why is Hazardous Waste Facility Needed',
			pageTitle: 'Why is Hazardous Waste Facility Needed',
			question: 'Why is the facility needed?',
			fieldName: 'whyIsFacilityNeeded',
			url: 'why-is-facility-needed',
			validators: [
				new RequiredValidator('Enter why this facility is needed'),
				new StringValidator({
					minLength: {
						minLength: 2,
						minLengthMessage: 'Why this facility is needed must be 2 characters or more'
					},
					maxLength: {
						maxLength: 2000,
						maxLengthMessage: 'Why this facility is needed must be 2000 characters or less'
					}
				})
			]
		},
		annualCapacity: {
			type: COMPONENT_TYPES.SINGLE_LINE_INPUT,
			title: 'Hazardous Waste Annual Capacity',
			pageTitle: 'Hazardous Waste Annual Capacity',
			question: 'What is the plants estimated annual capacity for disposing or recovering hazardous waste?',
			fieldName: 'annualCapacity',
			url: 'annual-capacity',
			validators: [
				new RequiredValidator('Enter the plant’s estimated capacity for disposing or recovering hazardous waste')
			]
		},
		hazardousWasteFacility: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Hazardous Waste Facility',
			pageTitle: 'Hazardous Waste Facility',
			question: 'Hazardous Waste Facility',
			html: HTML_TEMPLATES.OPTIONAL_SUBCATEGORY_SUBTITLE_HTML,
			fieldName: 'hazardousWasteFacility',
			url: DOCUMENT_SUB_CATEGORY_ID.HAZARDOUS_WASTE_FACILITY,
			validators: [new RequiredValidator('Select which documents provide additional information')]
		},
		recreationalAmenities: {
			type: COMPONENT_TYPES.BOOLEAN,
			title: 'Dam or Reservoir Recreational Amenities',
			pageTitle: 'Dam or Reservoir Recreational Amenities',
			question: 'Will the project include any recreational amenities?',
			fieldName: 'recreationalAmenities',
			url: 'recreational-amenities',
			validators: [new RequiredValidator('Select yes if the project includes recreational amenities')]
		},
		recreationalAmenitiesDescription: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Dam or Reservoir Recreatonal Amenities Description',
			pageTitle: 'Dam or Reservoir Recreatonal Amenities Description',
			question: "Describe the project's recreational amenities",
			fieldName: 'recreationalAmenitiesDescription',
			url: 'describe-recreational-amenities',
			validators: [
				new RequiredValidator('Enter a description of the project’s recreational amenities'),
				new StringValidator({
					minLength: {
						minLength: 2,
						minLengthMessage: 'Recreational amenities description must be 2 characters or more'
					},
					maxLength: {
						maxLength: 2000,
						maxLengthMessage: 'Recreational amenities description must be 2000 characters or less'
					}
				})
			]
		},
		damOrReservoir: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Dam or Reservoir',
			pageTitle: 'Dam or Reservoir',
			question: 'Dam or Reservoir',
			html: HTML_TEMPLATES.OPTIONAL_SUBCATEGORY_SUBTITLE_HTML,
			fieldName: 'damOrReservoir',
			url: DOCUMENT_SUB_CATEGORY_ID.DAM_OR_RESERVOIR,
			validators: [new RequiredValidator('Select which documents provide additional information')]
		}
	};

	const classes = {
		...questionClasses,
		...CUSTOM_COMPONENT_CLASSES
	};

	return createQuestions(questions, classes, {});
}
