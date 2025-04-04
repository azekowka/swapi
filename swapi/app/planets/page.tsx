"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { DataTable } from "@/components/data-table"
import { fetchPlanets } from "@/lib/api"
import type { Planet, ApiResponse } from "@/lib/types"
import { extractIdFromUrl } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function PlanetsPage() {
  const searchParams = useSearchParams()
  const pageParam = searchParams.get("page") || "1"
  const page = Number.parseInt(pageParam, 10)

  const [planetsData, setPlanetsData] = useState<ApiResponse<Planet> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPlanets = async () => {
      try {
        setLoading(true)
        const data = await fetchPlanets(page)
        setPlanetsData(data)
        setError(null)
      } catch (err) {
        setError("Failed to load planets data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadPlanets()
  }, [page])

  const columns = [
    { key: "name", label: "Name" },
    { key: "terrain", label: "Terrain" },
    { key: "climate", label: "Climate" },
    { key: "population", label: "Population" },
    { key: "diameter", label: "Diameter (km)" },
  ]

  const getRowId = (planet: Planet) => {
    return extractIdFromUrl(planet.url)
  }

  const totalPages = planetsData ? Math.ceil(planetsData.count / 10) : 0

  return (
    <MainLayout>
      <Card>
        <CardHeader>
          <CardTitle>Star Wars Planets</CardTitle>
          <CardDescription>Browse planets from the Star Wars universe</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : planetsData && planetsData.results.length > 0 ? (
            <DataTable
              data={planetsData.results}
              columns={columns}
              totalPages={totalPages}
              currentPage={page}
              basePath="/planets"
              getRowId={getRowId}
            />
          ) : (
            <div className="text-center py-8">No planets found</div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  )
}

