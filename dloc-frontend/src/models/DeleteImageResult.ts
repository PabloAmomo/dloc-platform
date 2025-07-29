import { ServiceError } from './ServiceError';

export type DeleteImageResult = { delete: boolean; error?: ServiceError };
