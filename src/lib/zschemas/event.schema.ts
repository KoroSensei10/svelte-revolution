import { z } from 'zod';

export const eventSchema = z.object({
	title: z.string().min(3).max(250),
	text: z.string().min(3).max(5000),
	author: z.string().min(1).max(100)
});
