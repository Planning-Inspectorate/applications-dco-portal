import type { InputField } from '@planning-inspectorate/dynamic-forms/src/questions/question-props.js';

export interface InputGroup {
	title: string;
	fields: InputField[];
}
