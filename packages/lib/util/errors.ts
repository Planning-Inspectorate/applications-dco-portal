import type { ExpressValidationErrors } from '@planning-inspectorate/dynamic-forms';
import type { FieldValidationError } from 'express-validator/lib/base.d.ts';

export function validationError(field: string, msg: string): ExpressValidationErrors {
	return {
		[field]: validationMsg(msg)
	};
}

export function validationMsg(msg: string) {
	return { msg } as FieldValidationError;
}
