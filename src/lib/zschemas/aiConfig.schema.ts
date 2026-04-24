import { z } from 'zod';
import { nodeSchema } from './scenario.schema';

export const aiCapabilities = ['canCensor', 'canTriggerNodes', 'canEndSession'] as const;

const aiNodeDefSchema = nodeSchema.extend({
	side: z.string().min(1, { message: 'Node side is required' })
});

export const aiConfigSchema = z.object({
	vision: z
		.string()
		.max(5000, { message: 'AI vision must be at most 5000 characters long' })
		.optional()
		.or(z.literal('')),
	capabilities: z
		.array(z.enum(aiCapabilities))
		.min(1, { message: 'Select at least one AI capability' }),
	script: z.object({
		bannedWords: z.array(z.string().min(1)).optional(),
		triggerRules: z
			.array(
				z.object({
					condition: z
						.string()
						.min(3, { message: 'Trigger condition must be at least 3 characters long' })
						.max(2000),
					node: aiNodeDefSchema,
					requiresFired: z.array(z.number().int().min(0)).optional()
				})
			)
			.optional(),
		endCondition: z
			.object({
				condition: z
					.string()
					.min(3, { message: 'End condition must be at least 3 characters long' })
					.max(2000),
				endTitle: z.string().min(1, { message: 'End title is required' })
			})
			.optional()
	})
});
