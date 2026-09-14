import type { ValidationError } from 'express-validator';

export type ValidationErrors = Record<string, ValidationError | { msg: string }>;
