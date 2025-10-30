export interface MoviesTypes {
  id?: number,
  title: string
  type: string,
  director: string
  budget: string | number
  location: string
  duration: string | number
  year_time: string | number
  details: string
  createdAt?: string
  updatedAt?: string
}
