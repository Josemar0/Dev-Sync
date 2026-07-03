import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { RoleGate } from "@/components/role-gate"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  applyToStudentClassProject,
  getStudentClassProjects,
  type StudentProjectRow,
} from "@/lib/dashboard-api"
import { useAuth } from "@/lib/auth-context"

export function StudentClassProjectsPage() {
  const { id = "" } = useParams()
  const { user } = useAuth()
  const [projects, setProjects] = useState<StudentProjectRow[]>([])

  const load = async () => {
    if (!id || !user) return
    setProjects(await getStudentClassProjects(id, user.id))
  }

  useEffect(() => {
    void load()
  }, [id, user])

  const apply = async (projectId: string) => {
    if (!id || !user) return
    await applyToStudentClassProject(id, projectId, user.id, user.name)
    await load()
  }

  return (
    <AuthGuard>
      <RoleGate allowedRoles={["student"]}>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold">Class Projects</h1>
              <Link className="text-sm text-primary hover:underline" to="/dashboard/student/classes">
                Back to classes
              </Link>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Class {id}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {projects.map((project) => (
                  <div key={project.id} className="rounded-md border p-3">
                    <p className="font-medium">{project.title}</p>
                    <p className="mb-2 text-sm text-muted-foreground">{project.summary}</p>
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => void apply(project.id)} disabled={project.applied}>
                        {project.applied ? "Applied" : "Apply"}
                      </Button>
                      {project.latestStatus && (
                        <Badge variant={project.latestStatus === "approved" ? "default" : project.latestStatus === "rejected" ? "destructive" : "secondary"}>
                          {project.latestStatus}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {projects.length === 0 && (
                  <p className="text-sm text-muted-foreground">No mock projects for this class.</p>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </RoleGate>
    </AuthGuard>
  )
}

