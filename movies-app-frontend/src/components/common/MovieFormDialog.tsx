import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { ToastDialog, type ToastType } from "@/components/common/ToastDialog";
import { addMovie, updateMovie } from "@/api/moviesApi";
import type { MoviesTypes } from "@/types/movies.types";

interface MovieFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
  movie?: MoviesTypes | null;
}

type FormErrors = {
  title?: string;
  type?: string;
  director?: string;
  budget?: string;
  location?: string;
  duration?: string;
  year_time?: string;
};


export const MovieFormDialog: React.FC<MovieFormDialogProps> = ({
  open,
  onOpenChange,
  onCreated,
  movie,
}) => {
  const [formData, setFormData] = useState<MoviesTypes>({
    title: "",
    type: "",
    director: "",
    budget: 0,
    location: "",
    duration: 0,
    year_time: 0,
    details: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<ToastType>("info");

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title,
        type: movie.type === "Movie" ? "MOVIE" : movie.type === "TV Show" ? "TV_SHOW" : movie.type,
        director: movie.director,
        budget: movie.budget,
        location: movie.location,
        duration: movie.duration,
        year_time: movie.year_time,
        details: movie.details || "",
      });
    } else {
      resetForm();
    }
  }, [movie]);

  const resetForm = () => {
    setFormData({
      title: "",
      type: "",
      director: "",
      budget: "",
      location: "",
      duration: "",
      year_time: "",
      details: "",
    });
    setErrors({});
    
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    let newValue = value;
    if (type === "number") {
        newValue = value === "" ? "" : Math.max(Number(value), 0).toString();
    }
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    // clear the error for the field for which the user is typing
    setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
    });
  };

    const validateForm = (): FormErrors => {
        const newErrors: FormErrors = {};

        if (!formData.title) newErrors.title = "Title is required";
        if (!formData.type) newErrors.type = "Type is required";
        if (!formData.director) newErrors.director = "Director is required";
        if (!formData.budget) newErrors.budget = "Budget is required";
        if (!formData.location) newErrors.location = "Location is required";
        if (!formData.duration) newErrors.duration = "Duration is required";
        if (!formData.year_time) newErrors.year_time = "Year is required";

        return newErrors;
    };

  const handleSubmit = async () => {
    
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return false;
    }
    try {
        setLoading(true);
        const payload = {
            title: formData.title,
            type: formData.type,
            director: formData.director,
            budget: formData.budget,
            location: formData.location,
            duration: formData.duration,
            year_time: formData.year_time,
            details: formData.details || "",
        };
        console.log(payload, "payload")
        if(movie && movie.id != null){
            await updateMovie(movie.id, payload)
            .then((res) => {
                if(res.status === 200){
                    setToastType("success");
                    setToastMessage("Data updated successfully.");
                    setToastOpen(true);
                    resetForm();
                    onOpenChange(false);
                    onCreated?.();
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.log(error, "error in update data");
            })
        } else{
            await addMovie(payload)
            .then((res) => {
                debugger
                if(res.status === 201){
                    setToastType("success");
                    setToastMessage("Data added successfully.");
                    setToastOpen(true);
                    resetForm();
                    onOpenChange(false);
                    onCreated?.();
                    setLoading(false);
                }
            })
            .catch((err) => {
                debugger
                console.error(err);
                const message = err.response?.data?.error || "Failed to add data. Please try again.";
                setToastType("error");
                setToastMessage(message);
                setToastOpen(true);
                setLoading(false);
            })
        }
    } catch (error) {
        console.log(error, "error in save data");
        setLoading(false);
    } finally{
        setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(newOpen) => {
          onOpenChange(newOpen);
          if (!newOpen) resetForm();
        }}
      >
        <DialogContent className="max-w-2xl bg-linear-to-br from-slate-800 to-purple-900 text-white border-white/20">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Add New Movie / TV Show
            </DialogTitle>
            <DialogDescription className="text-purple-200">
              Fill in the details below to add your movie or TV show.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="md:col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="bg-white/10 border-white/20 text-white"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Type */}
              <div>
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="MOVIE">Movie</SelectItem>
                    <SelectItem value="TV_SHOW">TV Show</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.type}
                  </p>
                )}
              </div>

              {/* Director */}
              <div>
                <Label htmlFor="director">Director *</Label>
                <Input
                  id="director"
                  name="director"
                  placeholder="Enter director"
                  value={formData.director}
                  onChange={handleInputChange}
                  className="bg-white/10 border-white/20 text-white"
                />
                {errors.director && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.director}
                  </p>
                )}
              </div>

              {/* Budget */}
              <div>
                <Label htmlFor="budget">Budget ($) *</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  min={0}
                  step="0.01"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="Enter bugdet"
                  className="bg-white/10 border-white/20 text-white"
                />
                {errors.budget && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.budget}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter location"
                  className="bg-white/10 border-white/20 text-white"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.location}
                  </p>
                )}
              </div>

              {/* Duration */}
              <div>
                <Label htmlFor="duration">Duration (min) *</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min={0}
                  step="1"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="Enter duration"
                  className="bg-white/10 border-white/20 text-white"
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.duration}
                  </p>
                )}
              </div>

              {/* Year */}
              <div>
                <Label htmlFor="year_time">Year *</Label>
                <Input
                  id="year_time"
                  name="year_time"
                  type="number"
                  min={0}
                //   max={4}
                  value={formData.year_time}
                  onChange={handleInputChange}
                  placeholder="Enter year"
                  className="bg-white/10 border-white/20 text-white"
                />
                {errors.year_time && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.year_time}
                  </p>
                )}
              </div>

              {/* Details */}
              <div className="md:col-span-2">
                <Label htmlFor="details">Details</Label>
                <textarea
                  id="details"
                  name="details"
                  value={formData.details}
                  onChange={handleInputChange}
                  placeholder="Add any additional notes or details..."
                  className="w-full p-2 bg-white/10 border-white/20 text-white rounded-md"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={loading}
              onClick={handleSubmit}
              className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? "Saving..." : movie ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ToastDialog
        open={toastOpen}
        onOpenChange={setToastOpen}
        title={toastMessage}
        type={toastType}
        duration={3000} // auto-close after 3s
      />
    </>
  );
};
