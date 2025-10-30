import { deleteMovie, getMoviesWithPagination } from '@/api/moviesApi';
import { MovieFormDialog } from '@/components/common/MovieFormDialog';
import { PageHeader } from '@/components/common/PageHeader'
import { ToastDialog, type ToastType } from '@/components/common/ToastDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MoviesTypes } from '@/types/movies.types';
import { Check, Edit2, Loader2, Plus, Search, Trash2, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const List = () => {
    const [movies, setMovies] = useState<MoviesTypes[]>([]);
    const [allMovies, setAllMovies] = useState<MoviesTypes[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<MoviesTypes | null>(null);
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    
    // toast dialog
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string>("");
    const [toastType, setToastType] = useState<ToastType>("info");

    // delete states
    const [deleteId, setDeleteId] = useState<number | undefined>(undefined);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

    // filter states
    const [filterType, setFilterType] = useState<string>("ALL");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(searchTerm);

    // pagination states
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const observer = useRef<IntersectionObserver | null>(null);
    const tableContainerRef = useRef<HTMLDivElement>(null);

    // reset pagination after filters change
    useEffect(() => {
        setPage(1);
        setHasMore(true);
    }, [filterType, debouncedSearchTerm]);

    const lastMovieRef = useCallback(
        (node: HTMLTableRowElement | null) => {
            if (loadingMore || !hasMore) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && hasMore && !loadingMore) {
                        setPage(prev => prev + 1);
                    }
                },
                {
                    root: tableContainerRef.current,
                    rootMargin: '50px',
                    threshold: 0.1,
                }
            );

            if (node) observer.current.observe(node);
        },
        [loadingMore, hasMore]
    );

    useEffect(() => {
        fetchAllShows(page);
    }, [page]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    const filteredMovies = useMemo(() => {
        if (!allMovies) return [];

        return allMovies.filter((movie) => {
            if (filterType && filterType !== "ALL" && movie.type !== filterType) return false;
            if(movie.type === "MOVIE") movie.type = "Movie";
            if(movie.type === "TV_SHOW") movie.type = "TV Show";

            if (debouncedSearchTerm.trim() !== "") {
                const term = debouncedSearchTerm.toLowerCase();
                const matches =
                    movie.title.toLowerCase().includes(term) ||
                    movie.director.toLowerCase().includes(term) ||
                    (movie.location && movie.location.toLowerCase().includes(term));
                if (!matches) return false;
            }

            return true;
        });
    }, [allMovies, filterType, debouncedSearchTerm]);

    useEffect(() => {
        setMovies(filteredMovies);
    }, [filteredMovies]);
    
    const fetchAllShows = async (pageNum: number = 1) => {
        if (pageNum > totalPages && totalPages > 0) {
            setHasMore(false);
            return;
        }

        pageNum === 1 ? setLoading(true) : setLoadingMore(true);
        
        try {
            await getMoviesWithPagination(pageNum)
            .then((res) => {
                if(res.status === 200){
                    let updatedResult = res?.data.map((movie: MoviesTypes) => {
                        return {
                            ...movie,
                            type: movie.type === "MOVIE" ? "Movie" : "TV Show"
                        }
                    });
                    
                    if (pageNum === 1) {
                        setAllMovies(updatedResult);
                        setMovies(updatedResult);
                    } else {
                        setAllMovies(prev => [...prev, ...updatedResult]);
                        setMovies(prev => [...prev, ...updatedResult]);
                    }
                    
                    setTotalPages(res.result.totalPages);
                    setHasMore(pageNum < res.result.totalPages);
                }
            })
            .catch((error) => {
                console.log(error, "error in get all data");
                setToastType("error");
                setToastMessage("Failed to fetch data.");
                setToastOpen(true);
            });
        } catch (error) {
            console.error(error);
            setToastType("error");
            setToastMessage("Failed to fetch movies.");
            setToastOpen(true);
        } finally {
            pageNum === 1 ? setLoading(false) : setLoadingMore(false);
        }
    }

    const handleEdit = (movie: MoviesTypes) => {
        setSelectedMovie(movie);
        setIsFormOpen(true);
    };

    const handleCreatedOrUpdated = () => {
        setPage(1);
        fetchAllShows(1);
        setIsFormOpen(false);
        setSelectedMovie(null);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteId) return;
        try {
            await deleteMovie(deleteId)
            .then((res) => {
                if(res.status === 200){
                    setToastType("success");
                    setToastMessage("Data deleted successfully.");
                    setToastOpen(true);
                    setPage(1);
                    fetchAllShows(1);
                }
            })
            .catch((error) => {
                console.log(error, "error in delete data");
                setToastType("error");
                setToastMessage("Failed to delete data.");
                setToastOpen(true);
            });
        } catch (err) {
            console.error(err);
            setToastType("error");
            setToastMessage("Failed to delete data.");
            setToastOpen(true);
        } finally {
            setDeleteOpen(false);
            setDeleteId(undefined);
        }
    };

    return (
        <div className="min-h-screen">
            {/* heading */}
            <PageHeader
                title="Favorite Movies / Tv Shows"
                subtitle="Manage your all entertainment at one place"
            />

            {/* search and filter ui */}
            <Card className="flex flex-col min-h-0 mb-6 bg-white/10 backdrop-blur-lg border-white/200">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-white-400" />
                            <Input
                                placeholder="Search by title, director, or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-white/50 border-white/30 text-white placeholder:text-gray-300"
                            />
                            {searchTerm && (
                                <X
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-3 top-3 h-4 w-4 text-white cursor-pointer"
                                />
                            )}
                        </div>
                        <Select
                            value={filterType}
                            onValueChange={(value) => setFilterType(value)}
                        >
                            <SelectTrigger className="w-full md:w-48 bg-white/50 border-white/30 text-white">
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent className="text-black bg-white">
                                <SelectItem value="ALL">All</SelectItem>
                                <SelectItem value="Movie">Movie</SelectItem>
                                <SelectItem value="TV Show">TV Show</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            onClick={() => setIsFormOpen(true)}
                            className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add New
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* add new */}
            <MovieFormDialog
                open={isFormOpen}
                onOpenChange={(open) => {
                    setIsFormOpen(open);
                    if (!open) setSelectedMovie(null);
                }}
                onCreated={() => handleCreatedOrUpdated()}
                movie={selectedMovie}
            />
        
            {/* show all records */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                    <CardTitle className="text-white text-lg">
                        Movies / TV Shows List
                        {movies.length > 0 && (
                            <span className="text-sm text-purple-300 ml-2">
                                ({movies.length} items)
                            </span>
                        )}
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex justify-center items-center py-10 text-purple-200">
                            <Loader2 className="h-6 w-6 animate-spin mr-2" /> 
                            Loading your collection...
                        </div>
                    ) : movies.length === 0 ? (
                        <div className="text-center py-12 text-purple-200">
                            <p className="text-xl">No items found</p>
                            <p className="text-sm mt-2">
                                Try adding a new movie or TV show to see it here.
                            </p>
                        </div>
                    ) : (
                        <div 
                            ref={tableContainerRef}
                            className="overflow-auto max-h-[500px] relative"
                        >
                            <Table className="text-white">
                                <TableHeader className="sticky top-0 bg-linear-to-br from-slate-800 to-purple-900 border-b border-white/20 backdrop-blur-md z-10">
                                    <TableRow>
                                        <TableHead className="sticky top-0 bg-linear-to-br from-slate-800 to-purple-900">Title</TableHead>
                                        <TableHead className="sticky top-0 bg-linear-to-br from-slate-800 to-purple-900">Type</TableHead>
                                        <TableHead className="sticky top-0 bg-linear-to-br from-slate-800 to-purple-900">Director</TableHead>
                                        <TableHead className="sticky top-0 bg-linear-to-br from-slate-800 to-purple-900">Budget</TableHead>
                                        <TableHead className="sticky top-0 bg-linear-to-br from-slate-800 to-purple-900">Location</TableHead>
                                        <TableHead className="sticky top-0 bg-linear-to-br from-slate-800 to-purple-900">Duration</TableHead>
                                        <TableHead className="sticky top-0 bg-linear-to-br from-slate-800 to-purple-900">Year</TableHead>
                                        <TableHead className="sticky top-0 bg-linear-to-br from-slate-800 to-purple-900">Details</TableHead>
                                        <TableHead className="sticky top-0 bg-linear-to-br from-slate-800 to-purple-900 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {movies.map((item, index) => {
                                        const isLast = index === movies.length - 1;
                                        return (
                                            <TableRow
                                                key={item.id}
                                                ref={isLast && hasMore ? lastMovieRef : null}
                                                className="hover:bg-white/5 border-b border-white/10 transition-colors"
                                            >
                                                <TableCell className="font-medium">{item.title}</TableCell>
                                                <TableCell>{item.type}</TableCell>
                                                <TableCell>{item.director}</TableCell>
                                                <TableCell>${item.budget}M</TableCell>
                                                <TableCell>{item.location}</TableCell>
                                                <TableCell>{item.duration} min</TableCell>
                                                <TableCell>{item.year_time}</TableCell>
                                                <TableCell>{item.details ? item.details : "-"}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleEdit(item)}
                                                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => {
                                                                setDeleteId(item.id);
                                                                setDeleteOpen(true);
                                                            }}
                                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                            
                            {/* Sticky bottom loading state */}
                            <div className="sticky bottom-0 left-0 right-0 z-10">
                                {loadingMore && (
                                    <div className="bg-purple-700/80 backdrop-blur-sm border-t border-white/20 py-3 px-4">
                                        <div className="flex justify-center items-center gap-2 text-white font-medium">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Loading more...
                                        </div>
                                    </div>
                                )}
                                
                                {!hasMore && movies.length > 0 && (
                                    <div className="bg-green-600/80 backdrop-blur-sm border-t border-white/20 py-3 px-4">
                                        <div className="flex justify-center items-center gap-2 text-white font-medium">
                                            <span className="text-lg">
                                                <Check className="h-5 w-5" />
                                            </span>
                                            All records loaded
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete confirmation */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent className="bg-white/10 border-white/20 text-white backdrop-blur-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this movie / tv show? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* toast configuration */}
            <ToastDialog
                open={toastOpen}
                onOpenChange={setToastOpen}
                title={toastMessage}
                type={toastType}
            />
        </div>
    )
}

export default List;