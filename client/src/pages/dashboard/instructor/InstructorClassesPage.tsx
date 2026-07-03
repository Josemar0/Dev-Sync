import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { RoleGate } from "@/components/role-gate"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  getInstructorClasses,
  type InstructorClassSummary,
} from "@/lib/dashboard-api"

export function InstructorClassesPage() {
  const [classes, setClasses] = useState<InstructorClassSummary[]>([])

  useEffect(() => {
    void getInstructorClasses().then(setClasses)
  }, [])

  return (
    <AuthGuard>
      <RoleGate allowedRoles={["instructor"]}>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <h1 className="mb-6 text-2xl font-bold">Instructor Classes</h1>
            <div className="grid gap-4 md:grid-cols-2">
              {classes.map((cls) => (
                <Card key={cls.id}>
                  <CardHeader>
                    <CardTitle>{cls.code}: {cls.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>{cls.term}</p>
                    <p>{cls.studentCount} students</p>
                    <p>{cls.submissionCount} submissions</p>
                    <div className="flex gap-4 pt-2">
                      <Link className="text-primary hover:underline" to={`/dashboard/instructor/classes/${cls.id}/students`}>
                        View students
                      </Link>
                      <Link className="text-primary hover:underline" to={`/dashboard/instructor/classes/${cls.id}/projects`}>
                        Review projects
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

