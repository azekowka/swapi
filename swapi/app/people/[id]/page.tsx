"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { fetchPerson } from "@/lib/api"
import type { Person } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Edit, Save, ArrowLeft } from "lucide-react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

const schema = yup
  .object({
    name: yup.string().required("Name is required"),
    height: yup.string().required("Height is required"),
    mass: yup.string().required("Mass is required"),
    hair_color: yup.string().required("Hair color is required"),
    skin_color: yup.string().required("Skin color is required"),
    eye_color: yup.string().required("Eye color is required"),
    birth_year: yup.string().required("Birth year is required"),
    gender: yup.string().required("Gender is required"),
  })
  .required()

type FormData = yup.InferType<typeof schema>

export default function PersonDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [person, setPerson] = useState<Person | null>(null)
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
    const loadPerson = async () => {
      try {
        setLoading(true)
        const data = await fetchPerson(id)
        setPerson(data)
        reset(data)
        setError(null)
      } catch (err) {
        setError("Failed to load character data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadPerson()
  }, [id, reset])

  const onSubmit = (data: FormData) => {
    // In a real app, you would send this data to the API
    // For this demo, we'll just update the local state
    setPerson({ ...person!, ...data })
    setIsEditing(false)
    setSuccessMessage("Character information updated successfully")

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null)
    }, 3000)
  }

  const handleEdit = () => {
    setIsEditing(true)
    reset(person!)
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

  if (error || !person) {
    return (
      <MainLayout>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-red-500">{error || "Character not found"}</div>
            <div className="flex justify-center">
              <Link href="/people">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Characters
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
        <Link href="/people">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Characters
          </Button>
        </Link>
      </div>

      {successMessage && <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md">{successMessage}</div>}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{person.name}</CardTitle>
              <CardDescription>Character Details</CardDescription>
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
                  <Label htmlFor="gender">Gender</Label>
                  <Input id="gender" {...register("gender")} />
                  {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birth_year">Birth Year</Label>
                  <Input id="birth_year" {...register("birth_year")} />
                  {errors.birth_year && <p className="text-sm text-red-500">{errors.birth_year.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" {...register("height")} />
                  {errors.height && <p className="text-sm text-red-500">{errors.height.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mass">Mass (kg)</Label>
                  <Input id="mass" {...register("mass")} />
                  {errors.mass && <p className="text-sm text-red-500">{errors.mass.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hair_color">Hair Color</Label>
                  <Input id="hair_color" {...register("hair_color")} />
                  {errors.hair_color && <p className="text-sm text-red-500">{errors.hair_color.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skin_color">Skin Color</Label>
                  <Input id="skin_color" {...register("skin_color")} />
                  {errors.skin_color && <p className="text-sm text-red-500">{errors.skin_color.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eye_color">Eye Color</Label>
                  <Input id="eye_color" {...register("eye_color")} />
                  {errors.eye_color && <p className="text-sm text-red-500">{errors.eye_color.message}</p>}
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
                <p>{person.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Gender</h3>
                <p>{person.gender}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Birth Year</h3>
                <p>{person.birth_year}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Height</h3>
                <p>{person.height} cm</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Mass</h3>
                <p>{person.mass} kg</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Hair Color</h3>
                <p>{person.hair_color}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Skin Color</h3>
                <p>{person.skin_color}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Eye Color</h3>
                <p>{person.eye_color}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  )
}

