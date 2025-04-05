"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { MainLayout } from "../../components/layout/main-layout"
import { DataTable } from "../../components/data-table"
import { fetchPeople } from "../../lib/api"
import type { Person, ApiResponse } from "../../lib/types"
import { extractIdFromUrl } from "../../lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Loader2 } from "lucide-react"

export default function PeoplePage() {
  const searchParams = useSearchParams()
  const pageParam = searchParams.get("page") || "1"
  const page = Number.parseInt(pageParam, 10)

  const [peopleData, setPeopleData] = useState<ApiResponse<Person> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPeople = async () => {
      try {
        setLoading(true)
        const data = await fetchPeople(page)
        setPeopleData(data)
        setError(null)
      } catch (err) {
        setError("Failed to load people data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadPeople()
  }, [page])

  const columns = [
    { key: "name", label: "Name" },
    { key: "gender", label: "Gender" },
    { key: "birth_year", label: "Birth Year" },
    { key: "height", label: "Height (cm)" },
    { key: "mass", label: "Mass (kg)" },
  ]

  const getRowId = (person: Person) => {
    return extractIdFromUrl(person.url)
  }

  const totalPages = peopleData ? Math.ceil(peopleData.count / 10) : 0

  return (
    <MainLayout>
      <Card>
        <CardHeader>
          <CardTitle>Star Wars Characters</CardTitle>
          <CardDescription>Browse characters from the Star Wars universe</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : peopleData && peopleData.results.length > 0 ? (
            <DataTable
              data={peopleData.results}
              columns={columns}
              totalPages={totalPages}
              currentPage={page}
              basePath="/people"
              getRowId={getRowId}
            />
          ) : (
            <div className="text-center py-8">No characters found</div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  )
}

