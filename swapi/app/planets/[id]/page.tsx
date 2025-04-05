"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { MainLayout } from "../../../components/layout/main-layout"
import { fetchPlanet } from "../../../lib/api"
import type { Planet } from "../../../lib/types"
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
    rotation_period: yup.string().required("Rotation period is required"),
    orbital_period: yup.string().required("Orbital period is required"),
    diameter: yup.string().required("Diameter is required"),
    climate: yup.string().required("Climate is required"),
    gravity: yup.string().required("Gravity is required"),
    terrain: yup.string().required("Terrain is required"),
    surface_water: yup.string().required("Surface water is required"),
    population: yup.string().required("Population is required"),
  })
  .required()

type FormData = yup.InferType<typeof schema>

export default function PlanetDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [planet, setPlanet] = useState<Planet | null>(null)
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
    const loadPlanet = async () => {
      try {
        setLoading(true)
        const data = await fetchPlanet(id)
        setPlanet(data)
        reset(data)
        setError(null)
      } catch (err) {
        setError("Failed to load planet data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadPlanet()
  }, [id, reset])

  const onSubmit = (data: FormData) => {
    // In a real app, you would send this data to the API
    // For this demo, we'll just update the local state
    setPlanet({ ...planet!, ...data })
    setIsEditing(false)
    setSuccessMessage("Planet information updated successfully")

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null)
    }, 3000)
  }

  const handleEdit = () => {
    setIsEditing(true)
    reset(planet!)
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

  if (error || !planet) {
    return (
      <MainLayout>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-red-500">{error || "Planet not found"}</div>
            <div className="flex justify-center">
              <Link href="/planets">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Planets
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
        <Link href="/planets">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Planets
          </Button>
        </Link>
      </div>

      {successMessage && <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md">{successMessage}</div>}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{planet.name}</CardTitle>
              <CardDescription>Planet Details</CardDescription>
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
                  <Label htmlFor="climate">Climate</Label>
                  <Input id="climate" {...register("climate")} />
                  {errors.climate && <p className="text-sm text-red-500">{errors.climate.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terrain">Terrain</Label>
                  <Input id="terrain" {...register("terrain")} />
                  {errors.terrain && <p className="text-sm text-red-500">{errors.terrain.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diameter">Diameter (km)</Label>
                  <Input id="diameter" {...register("diameter")} />
                  {errors.diameter && <p className="text-sm text-red-500">{errors.diameter.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="population">Population</Label>
                  <Input id="population" {...register("population")} />
                  {errors.population && <p className="text-sm text-red-500">{errors.population.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rotation_period">Rotation Period</Label>
                  <Input id="rotation_period" {...register("rotation_period")} />
                  {errors.rotation_period && <p className="text-sm text-red-500">{errors.rotation_period.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orbital_period">Orbital Period</Label>
                  <Input id="orbital_period" {...register("orbital_period")} />
                  {errors.orbital_period && <p className="text-sm text-red-500">{errors.orbital_period.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gravity">Gravity</Label>
                  <Input id="gravity" {...register("gravity")} />
                  {errors.gravity && <p className="text-sm text-red-500">{errors.gravity.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surface_water">Surface Water</Label>
                  <Input id="surface_water" {...register("surface_water")} />
                  {errors.surface_water && <p className="text-sm text-red-500">{errors.surface_water.message}</p>}
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
                <p>{planet.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Climate</h3>
                <p>{planet.climate}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Terrain</h3>
                <p>{planet.terrain}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Diameter</h3>
                <p>{planet.diameter} km</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Population</h3>
                <p>{planet.population}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Rotation Period</h3>
                <p>{planet.rotation_period} days</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Orbital Period</h3>
                <p>{planet.orbital_period} days</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Gravity</h3>
                <p>{planet.gravity}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Surface Water</h3>
                <p>{planet.surface_water}%</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  )
}

