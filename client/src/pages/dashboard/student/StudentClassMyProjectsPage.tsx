import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { RoleGate } from "@/components/role-gate"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getStudentClassMyProjects, type StudentMyProjectRow } from "@/lib/dashboard-api"
import { useAuth } from "@/lib/auth-context"
import { formatTimeAgo } from "@/lib/datetime-display"

export function StudentClassMyProjectsPage() {
  const { id = "" } = useParams()
  const { user } = useAuth()
  const [rows, setRows] = useState<StudentMyProjectRow[]>([])

  useEffect(() => {
    if (!id || !user) return
    void getStudentClassMyProjects(id, user.id).then(setRows)
  }, [id, user])

  return (
    <AuthGuard>
      <RoleGate allowedRoles={["student"]}>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold">My Project Submissions</h1>
              <Link className="text-sm text-primary hover:underline" to="/dashboard/student/classes">
                Back to classes
              </Link>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Class {id}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {rows.map((row) => (
                  <div key={row.submissionId} className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{row.projectTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          Submitted {formatTimeAgo(row.submittedAt)}
                        </p>
                      </div>
                      <Badge variant={row.status === "approved" ? "default" : row.status === "rejected" ? "destructive" : "secondary"}>
                        {row.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {rows.length === 0 && (
                  <p className="text-sm text-muted-foreground">You have not submitted any projects in this class yet.</p>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </RoleGate>
    </AuthGuard>
  )
}

