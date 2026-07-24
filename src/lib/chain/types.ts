/** Shared pipeline types with zero runtime imports — safe to load anywhere. */

export interface Step {
	op: string;
	arg?: string;
}

export interface Recipe {
	input: string;
	steps: Step[];
}
