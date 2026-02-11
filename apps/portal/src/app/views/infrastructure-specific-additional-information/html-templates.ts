import { SELECT_ALL_THAT_APPLY_HTML } from '../common-html-templates.ts';

const HAS_ADDITIONAL_INFORMATION_HTML = `
<p class="govuk-body">
    You should refer to <a class="govuk-link govuk-link--no-visited-state" href="https://www.legislation.gov.uk/uksi/2009/2264/regulation/6/made">Regulation 6 of The Infrastructure Planning (Applications: Prescribed Forms and Procedure)
    Regulations 2009 (opens in a new tab)</a> which sets out when additional information is needed, for example, the height of proposed
    bridges for a new motorway.
</p>

<h2 class="govuk-heading-m">Is there any additional information required for this type of infrastructure?</h2>`;

const OPTIONAL_SUBCATEGORY_SUBTITLE_HTML = `
<h3 class="govuk-heading-s">Which documents need to be declared?</h3>

${SELECT_ALL_THAT_APPLY_HTML}`;

export default {
	HAS_ADDITIONAL_INFORMATION_HTML,
	OPTIONAL_SUBCATEGORY_SUBTITLE_HTML
};
