import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { RoleGate } from "@/components/role-gate"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getInstructorClassStudents } from "@/lib/dashboard-api"
import type { ClassStudent } from "@/lib/mock-dashboard-data"

export function InstructorClassStudentsPage() {
  const { id = "" } = useParams()
  const [students, setStudents] = useState<ClassStudent[]>([])

  useEffect(() => {
    if (!id) return
    void getInstructorClassStudents(id).then(setStudents)
  }, [id])

  return (
    <AuthGuard>
      <RoleGate allowedRoles={["instructor"]}>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold">Enrolled Students</h1>
              <Link className="text-sm text-primary hover:underline" to="/dashboard/instructor/classes">
                Back to classes
              </Link>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Class {id}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {students.map((student) => (
                    <li key={student.userId} className="rounded-md border p-3">
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                    </li>
                  ))}
                  {students.length === 0 && (
                    <li className="text-sm text-muted-foreground">No mock students found for this class.</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </main>
        </div>
      </RoleGate>
    </AuthGuard>
  )
}

