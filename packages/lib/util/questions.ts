export function referenceDataToRadioOptions(
	reference: { displayName?: string; id: string }[],
	addNullOption: boolean = false
) {
	const options = reference.map((t) => ({ text: t.displayName, value: t.id }));
	if (addNullOption) {
		options.unshift({ text: '', value: '' });
	}
	return options;
}

export function referenceDataToRadioOptionsWithHintText(
	reference: { displayName?: string; id: string; hint: { text: string } }[],
	addNullOption: boolean = false
) {
	const options = reference.map((t) => ({ text: t.displayName, value: t.id, hint: t.hint }));
	if (addNullOption) {
		options.unshift({ text: '', value: '', hint: { text: '' } });
	}
	return options;
}

export function kebabCaseToCamelCase<T extends string>(inputString: T): string {
	return inputString.replace(/-([a-z])/g, (_, character) => character.toUpperCase());
}
