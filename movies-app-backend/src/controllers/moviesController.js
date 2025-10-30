const { PrismaClient } = require('@prisma/client');
const mediaSchema = require('../schemas/mediaSchema');

const prisma = new PrismaClient();

const createMovie = async (req, res) => {
    try {
        const validationResult = mediaSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({ 
                message: 'Validation Failed',
                errors: validationResult.error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }))
            });
        }
        const validatedData = validationResult.data;

        const showsData = await prisma.movies.findUnique({ where: { title: validatedData.title } });
        if (showsData) {
            return res.status(409).json({ result: [], status: 409, error: `Data with this title "${validatedData.title}" already exists.` });
        }

        const movie = await prisma.movies.create({ data: validatedData });
        if(movie) {
            res.status(201).json({ result: movie, status:201, message: 'Data created successfully' });
        }else{
            res.status(400).json({ result: [], status: 400, error: 'Data not saved' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: [], status: 500, error: 'Internal Server Error' });
    }
};

const getAllMovies = async (req, res) => {
    try {
        const movies = await prisma.movies.findMany();
        if(movies){
            res.status(200).json({ result: movies, status: 200, message: 'Data found successfully' });
        }else{
            res.status(404).json({ result: [], status: 404, error: 'Data not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: [], status: 500, error: 'Internal Server Error' });
    }
};

const getAllMoviesWithPagination = async (req, res) => {
    try {
        const page = parseInt(req.params.page);
        const skipPages = (page - 1) * 10;

        const movies = await prisma.movies.findMany({
            skip: skipPages,
            take: 10,
            orderBy: {
                id: 'asc',
            },
        });
        const totalCount = await prisma.movies.count();
        const totalPages = Math.ceil(totalCount / 10);
        if(movies){
            res.status(200).json({
                message: `Page ${page} of data retrieved successfully`, 
                data: movies,
                status: 200,
                result: {
                    totalEntries: totalCount,
                    totalPages: totalPages,
                    currentPage: page,
                    pageSize: 10,
                }
            });
        }else{
            res.status(404).json({ result: [], status: 404, error: 'Data not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: [], status: 500, error: 'Internal Server Error' });
    }
};

const getMovieById = async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await prisma.movies.findUnique({
            where: { id: Number(id) },
        });
        if (movie) {
            res.status(200).json({ result: movie, status: 200, message: 'Data found successfully' });
        } else {
            res.status(404).json({ result: [], status: 404, error: 'Data not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: [], status: 500, error: 'Internal Server Error' });
    }
};

const updateMovie = async (req, res) => {
    try {
        
        const { id } = req.params;
        const validationResult = mediaSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ 
                message: 'Validation Failed',
                errors: validationResult.error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }))
            });
        }
        const validatedData = validationResult.data;
        const movie = await prisma.movies.update({
            where: { id: Number(id) },
            data: validatedData,
        });
        if(movie){
            res.status(200).json({ result: movie, status: 200, message: 'Data updated successfully' });
        }else{
            res.status(404).json({ result: [], status: 404, error: 'Data not updated' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: [], status: 500, error: 'Internal Server Error' });
    }
};

const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await prisma.movies.delete({ where: { id: Number(id) } });
        if(movie){
            res.status(200).json({ result: movie, status: 200, message: 'Data deleted successfully' });
        }else{
            res.status(404).json({ result: [], status: 404, error: 'Data not deleted' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ result:[], status:500, error: 'Internal Server Error' });
    }
};

module.exports = {
    createMovie,
    getAllMovies,
    getAllMoviesWithPagination,
    getMovieById,
    updateMovie,
    deleteMovie,
};