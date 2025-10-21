function assertType(exactMatch) {
	return exactMatch ? 'have.text' : 'include.text';
}
export { assertType };
