import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { RoleGate } from "@/components/role-gate"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getStudentClasses } from "@/lib/dashboard-api"
import type { DashboardClass } from "@/lib/mock-dashboard-data"

export function StudentClassesPage() {
  const [classes, setClasses] = useState<DashboardClass[]>([])

  useEffect(() => {
    void getStudentClasses().then(setClasses)
  }, [])

  return (
    <AuthGuard>
      <RoleGate allowedRoles={["student"]}>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <h1 className="mb-6 text-2xl font-bold">My Classes</h1>
            <div className="grid gap-4 md:grid-cols-2">
              {classes.map((cls) => (
                <Card key={cls.id}>
                  <CardHeader>
                    <CardTitle>{cls.code}: {cls.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>{cls.term}</p>
                    <p>Instructor: {cls.instructorName}</p>
                    <div className="flex gap-4 pt-2">
                      <Link className="text-primary hover:underline" to={`/dashboard/student/classes/${cls.id}/projects`}>
                        Browse projects
                      </Link>
                      <Link className="text-primary hover:underline" to={`/dashboard/student/classes/${cls.id}/my-projects`}>
                        My submissions
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </RoleGate>
    </AuthGuard>
  )
}

