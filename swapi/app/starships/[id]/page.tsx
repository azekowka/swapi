"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { MainLayout } from "../../../components/layout/main-layout"
import { fetchStarship } from "../../../lib/api"
import type { Starship } from "../../../lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Loader2, Edit, Save, ArrowLeft } from "lucide-react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import Link from "next/link"

const schema = yup
  .object({
    name: yup.string().required("Name is required"),
    model: yup.string().required("Model is required"),
    manufacturer: yup.string().required("Manufacturer is required"),
    cost_in_credits: yup.string().required("Cost is required"),
    length: yup.string().required("Length is required"),
    max_atmosphering_speed: yup.string().required("Max speed is required"),
    crew: yup.string().required("Crew is required"),
    passengers: yup.string().required("Passengers is required"),
    cargo_capacity: yup.string().required("Cargo capacity is required"),
    consumables: yup.string().required("Consumables is required"),
    hyperdrive_rating: yup.string().required("Hyperdrive rating is required"),
    starship_class: yup.string().required("Starship class is required"),
  })
  .required()

type FormData = yup.InferType<typeof schema>

export default function StarshipDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [starship, setStarship] = useState<Starship | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    const loadStarship = async () => {
      try {
        setLoading(true)
        const data = await fetchStarship(id)
        setStarship(data)
        reset(data)
        setError(null)
      } catch (err) {
        setError("Failed to load starship data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadStarship()
  }, [id, reset])

  const onSubmit = (data: FormData) => {
    // In a real app, you would send this data to the API
    // For this demo, we'll just update the local state
    setStarship({ ...starship!, ...data })
    setIsEditing(false)
    setSuccessMessage("Starship information updated successfully")

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null)
    }, 3000)
  }

  const handleEdit = () => {
    setIsEditing(true)
    reset(starship!)
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    )
  }

  if (error || !starship) {
    return (
      <MainLayout>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-red-500">{error || "Starship not found"}</div>
            <div className="flex justify-center">
              <Link href="/starships">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Starships
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="mb-4">
        <Link href="/starships">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Starships
          </Button>
        </Link>
      </div>

      {successMessage && <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md">{successMessage}</div>}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{starship.name}</CardTitle>
              <CardDescription>Starship Details</CardDescription>
            </div>
            {!isEditing && (
              <Button onClick={handleEdit} variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" {...register("model")} />
                  {errors.model && <p className="text-sm text-red-500">{errors.model.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input id="manufacturer" {...register("manufacturer")} />
                  {errors.manufacturer && <p className="text-sm text-red-500">{errors.manufacturer.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="starship_class">Starship Class</Label>
                  <Input id="starship_class" {...register("starship_class")} />
                  {errors.starship_class && <p className="text-sm text-red-500">{errors.starship_class.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost_in_credits">Cost (credits)</Label>
                  <Input id="cost_in_credits" {...register("cost_in_credits")} />
                  {errors.cost_in_credits && <p className="text-sm text-red-500">{errors.cost_in_credits.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="length">Length</Label>
                  <Input id="length" {...register("length")} />
                  {errors.length && <p className="text-sm text-red-500">{errors.length.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_atmosphering_speed">Max Speed</Label>
                  <Input id="max_atmosphering_speed" {...register("max_atmosphering_speed")} />
                  {errors.max_atmosphering_speed && (
                    <p className="text-sm text-red-500">{errors.max_atmosphering_speed.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crew">Crew</Label>
                  <Input id="crew" {...register("crew")} />
                  {errors.crew && <p className="text-sm text-red-500">{errors.crew.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passengers">Passengers</Label>
                  <Input id="passengers" {...register("passengers")} />
                  {errors.passengers && <p className="text-sm text-red-500">{errors.passengers.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo_capacity">Cargo Capacity</Label>
                  <Input id="cargo_capacity" {...register("cargo_capacity")} />
                  {errors.cargo_capacity && <p className="text-sm text-red-500">{errors.cargo_capacity.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consumables">Consumables</Label>
                  <Input id="consumables" {...register("consumables")} />
                  {errors.consumables && <p className="text-sm text-red-500">{errors.consumables.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hyperdrive_rating">Hyperdrive Rating</Label>
                  <Input id="hyperdrive_rating" {...register("hyperdrive_rating")} />
                  {errors.hyperdrive_rating && (
                    <p className="text-sm text-red-500">{errors.hyperdrive_rating.message}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                <p>{starship.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Model</h3>
                <p>{starship.model}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Manufacturer</h3>
                <p>{starship.manufacturer}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Starship Class</h3>
                <p>{starship.starship_class}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Cost</h3>
                <p>{starship.cost_in_credits} credits</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Length</h3>
                <p>{starship.length} m</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Max Speed</h3>
                <p>{starship.max_atmosphering_speed}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Crew</h3>
                <p>{starship.crew}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Passengers</h3>
                <p>{starship.passengers}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Cargo Capacity</h3>
                <p>{starship.cargo_capacity} tons</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Consumables</h3>
                <p>{starship.consumables}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Hyperdrive Rating</h3>
                <p>{starship.hyperdrive_rating}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  )
}

