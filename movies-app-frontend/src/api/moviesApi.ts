import type { MoviesTypes } from '@/types/movies.types'
import api from './axiosInstance'

export const getMovies = async () => {
  const res = await api.get('/movies')
  return res.data
}

export const getMoviesWithPagination = async (page: number) => {
  const res = await api.get(`/movies/page/${page}`)
  return res.data
}

export const addMovie = async (movie: MoviesTypes) => {
  const res = await api.post('/movies', movie)
  return res.data
}

export const updateMovie = async (id: number, movie: MoviesTypes) => {
  const res = await api.put(`/movies/${id}`, movie)
  return res.data
}

export const deleteMovie = async (id: number) => {
  const res = await api.delete(`/movies/${id}`)
  return res.data
}
