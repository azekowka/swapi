"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { MainLayout } from "../../components/layout/main-layout"
import { DataTable } from "../../components/data-table"
import { fetchStarships } from "../../lib/api"
import type { Starship, ApiResponse } from "../../lib/types"
import { extractIdFromUrl } from "../../lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Loader2 } from "lucide-react"

export default function StarshipsPage() {
  const searchParams = useSearchParams()
  const pageParam = searchParams.get("page") || "1"
  const page = Number.parseInt(pageParam, 10)

  const [starshipsData, setStarshipsData] = useState<ApiResponse<Starship> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadStarships = async () => {
      try {
        setLoading(true)
        const data = await fetchStarships(page)
        setStarshipsData(data)
        setError(null)
      } catch (err) {
        setError("Failed to load starships data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadStarships()
  }, [page])

  const columns = [
    { key: "name", label: "Name" },
    { key: "model", label: "Model" },
    { key: "manufacturer", label: "Manufacturer" },
    { key: "starship_class", label: "Class" },
    { key: "crew", label: "Crew" },
  ]

  const getRowId = (starship: Starship) => {
    return extractIdFromUrl(starship.url)
  }

  const totalPages = starshipsData ? Math.ceil(starshipsData.count / 10) : 0

  return (
    <MainLayout>
      <Card>
        <CardHeader>
          <CardTitle>Star Wars Starships</CardTitle>
          <CardDescription>Browse starships from the Star Wars universe</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : starshipsData && starshipsData.results.length > 0 ? (
            <DataTable
              data={starshipsData.results}
              columns={columns}
              totalPages={totalPages}
              currentPage={page}
              basePath="/starships"
              getRowId={getRowId}
            />
          ) : (
            <div className="text-center py-8">No starships found</div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  )
}

