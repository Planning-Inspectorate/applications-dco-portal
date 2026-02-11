import { SELECT_ALL_THAT_APPLY_HTML } from '../common-html-templates.ts';

const HAS_ENVIRONMENTAL_STATEMENT_HTML = `
<p class="govuk-body">
	You must submit an environmental statement where the project requires an environmental impact assessment (EIA). An EIA
	identifies and assesses the significant effects likely to arise from a project.
</p>

<p class="govuk-body">
	To see if the project requires an EIA, you should refer to
	<a class="govuk-link govuk-link--no-visited-state" href="https://www.legislation.gov.uk/uksi/2017/572/contents"
		>The Infrastructure Planning (Environmental Impact Assessment) Regulations 2017 (opens in new tab)</a
	>. Where the transitional provisions apply, you should refer to
	<a class="govuk-link govuk-link--no-visited-state" href="https://www.legislation.gov.uk/uksi/2009/2263/contents/made"
		>The Infrastructure Planning (Environmental Impact Assessment) Regulations 2009 (opens in new tab)</a
	>.
</p>

<h2 class="govuk-heading-m">Does the project require an environmental statement?</h2>`;

const NOTIFYING_CONSULTATION_BODIES_HTML = `
<p class="govuk-body">
	The Secretary of State or the relevant authority will identify the consultation bodies that you need to notify. These
	could include local authorities, the Marine Management Organisation, the Forestry Commission, or the Health and Safety
	Executive, depending on the type of project.
</p>

<p class="govuk-body">You must send a copy of the notice to these consultation bodies in addition to publishing it.</p>

<h2 class="govuk-heading-m">Have you notified the consultation bodies about the project?</h2>`;

const NOTIFYING_OTHER_PEOPLE_HTML = `
<p class="govuk-body">
	<a class="govuk-link govuk-link--no-visited-state" href="https://www.legislation.gov.uk/uksi/2017/572/regulation/11"
		>Regulation 11(1)(c) of the Infrastructure Planning (Environmental Impact Assessment) Regulations 2017 (opens in a
		new tab)</a
	>
	requires the Secretary of State or the relevant authority to notify you of any people they consider:
</p>

<ul>
	<li class="govuk-body">likely to be affected by, or have interest in, the project, or</li>
	<li class="govuk-body">unlikely to become aware of the project by the standard public notice</li>
</ul>

<p class="govuk-body">You must send a copy of the notice to any such people.</p>

<h2 class="govuk-heading-m">Have you notified any other people under Regulation 11(1)(c) about the project?</h2>`;

const OPTIONAL_SUBCATEGORY_SUBTITLE_HTML = `
<h3 class="govuk-heading-s">Which documents form part of the environmental statement?</h3>

${SELECT_ALL_THAT_APPLY_HTML}`;

const NON_TECHNICAL_SUMMARY_HTML = `<div class="govuk-hint">The environmental statement must include a non-technical summary.</div>`;

export default {
	HAS_ENVIRONMENTAL_STATEMENT_HTML,
	NOTIFYING_CONSULTATION_BODIES_HTML,
	NOTIFYING_OTHER_PEOPLE_HTML,
	OPTIONAL_SUBCATEGORY_SUBTITLE_HTML,
	NON_TECHNICAL_SUMMARY_HTML
};
