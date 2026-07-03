import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { RoleGate } from "@/components/role-gate"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  getInstructorClassProjects,
  updateInstructorProjectStatus,
  type InstructorProjectRow,
} from "@/lib/dashboard-api"
import { formatTimeAgo } from "@/lib/datetime-display"

export function InstructorClassProjectsPage() {
  const { id = "" } = useParams()
  const [rows, setRows] = useState<InstructorProjectRow[]>([])

  useEffect(() => {
    if (!id) return
    void getInstructorClassProjects(id).then(setRows)
  }, [id])

  const refresh = async () => {
    if (!id) return
    setRows(await getInstructorClassProjects(id))
  }

  const decide = async (submissionId: string, status: "approved" | "rejected") => {
    if (!id) return
    await updateInstructorProjectStatus(id, submissionId, status)
    await refresh()
  }

  return (
    <AuthGuard>
      <RoleGate allowedRoles={["instructor"]}>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold">Project Submissions</h1>
              <Link className="text-sm text-primary hover:underline" to="/dashboard/instructor/classes">
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
                          {row.studentName} · submitted {formatTimeAgo(row.submittedAt)}
                        </p>
                      </div>
                      <Badge variant={row.status === "approved" ? "default" : row.status === "rejected" ? "destructive" : "secondary"}>
                        {row.status}
                      </Badge>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => void decide(row.submissionId, "approved")}
                        disabled={row.status === "approved"}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => void decide(row.submissionId, "rejected")}
                        disabled={row.status === "rejected"}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
                {rows.length === 0 && (
                  <p className="text-sm text-muted-foreground">No mock submissions for this class yet.</p>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </RoleGate>
    </AuthGuard>
  )
}

