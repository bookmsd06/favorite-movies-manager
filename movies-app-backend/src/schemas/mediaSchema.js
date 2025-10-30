const { z } = require("zod");

const mediaSchema = z.object({
    title: z.string().trim().min(3, { message: "Title must be at least 3 characters long" }).max(255),
    type: z.enum(["MOVIE", "TV_SHOW"], { required_error: "Type is required"}),
    director: z.string().trim().min(3, { message: "Director must be at least 3 characters long" }).max(255),
    budget: z.preprocess(value => parseFloat(value), z.number().positive({ message: "Budget must be a positive number" }).finite()),
    location: z.string().trim().max(255),
    duration: z.preprocess(value => parseFloat(value), z.number().positive({ message: "Duration must be a positive number" }).finite()),
    year_time: z.preprocess(value => parseInt(value, 10), z.number().int({ message: "Year must be a number" })),
    details: z.string().trim().optional().nullable(),
});

module.exports = mediaSchema;