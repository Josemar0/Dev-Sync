import {
  classProjects,
  classStudents,
  dashboardClasses,
  initialProjectSubmissions,
  type ClassProject,
  type ClassStudent,
  type DashboardClass,
  type ProjectSubmission,
} from "@/lib/mock-dashboard-data"

const wait = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

let submissionsStore: ProjectSubmission[] = [...initialProjectSubmissions]

export const dashboardEndpoints = {
  instructorClasses: "/dashboard/instructor/classes",
  instructorClassStudents: (classId: string) =>
    `/dashboard/instructor/classes/${classId}/students`,
  instructorClassProjects: (classId: string) =>
    `/dashboard/instructor/classes/${classId}/projects`,
  instructorProjectDecision: (classId: string, submissionId: string) =>
    `/dashboard/instructor/classes/${classId}/projects/${submissionId}`,

  studentClasses: "/dashboard/student/classes",
  studentClassProjects: (classId: string) =>
    `/dashboard/student/classes/${classId}/projects`,
  studentClassMyProjects: (classId: string) =>
    `/dashboard/student/classes/${classId}/my-projects`,
} as const

export type InstructorClassSummary = DashboardClass & {
  studentCount: number
  submissionCount: number
}

export type InstructorProjectRow = {
  submissionId: string
  projectId: string
  projectTitle: string
  studentId: string
  studentName: string
  status: ProjectSubmission["status"]
  submittedAt: string
}

export type StudentProjectRow = ClassProject & {
  applied: boolean
  latestStatus: ProjectSubmission["status"] | null
}

export type StudentMyProjectRow = {
  submissionId: string
  projectId: string
  projectTitle: string
  status: ProjectSubmission["status"]
  submittedAt: string
}

export async function getInstructorClasses(): Promise<InstructorClassSummary[]> {
  await wait()
  return dashboardClasses.map((c) => ({
    ...c,
    studentCount: classStudents[c.id]?.length ?? 0,
    submissionCount: submissionsStore.filter((s) => s.classId === c.id).length,
  }))
}

export async function getInstructorClassStudents(classId: string): Promise<ClassStudent[]> {
  await wait()
  return classStudents[classId] ?? []
}

export async function getInstructorClassProjects(
  classId: string,
): Promise<InstructorProjectRow[]> {
  await wait()
  const projectMap = new Map(
    (classProjects[classId] ?? []).map((p) => [p.id, p.title] as const),
  )
  return submissionsStore
    .filter((s) => s.classId === classId)
    .map((s) => ({
      submissionId: s.id,
      projectId: s.projectId,
      projectTitle: projectMap.get(s.projectId) ?? "Unknown project",
      studentId: s.studentId,
      studentName: s.studentName,
      status: s.status,
      submittedAt: s.submittedAt,
    }))
}

export async function updateInstructorProjectStatus(
  classId: string,
  submissionId: string,
  status: "approved" | "rejected",
): Promise<void> {
  await wait()
  submissionsStore = submissionsStore.map((s) =>
    s.classId === classId && s.id === submissionId ? { ...s, status } : s,
  )
}

export async function getStudentClasses(): Promise<DashboardClass[]> {
  await wait()
  return dashboardClasses
}

export async function getStudentClassProjects(
  classId: string,
  studentId: string,
): Promise<StudentProjectRow[]> {
  await wait()
  const projects = classProjects[classId] ?? []
  return projects.map((project) => {
    const mine = submissionsStore
      .filter((s) => s.classId === classId && s.projectId === project.id && s.studentId === studentId)
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
    return {
      ...project,
      applied: mine.length > 0,
      latestStatus: mine[0]?.status ?? null,
    }
  })
}

export async function applyToStudentClassProject(
  classId: string,
  projectId: string,
  studentId: string,
  studentName: string,
): Promise<void> {
  await wait()
  const exists = submissionsStore.some(
    (s) => s.classId === classId && s.projectId === projectId && s.studentId === studentId,
  )
  if (exists) return
  submissionsStore = [
    {
      id: `s-${Math.floor(Math.random() * 900000 + 100000)}`,
      classId,
      projectId,
      studentId,
      studentName,
      status: "pending",
      submittedAt: new Date().toISOString(),
    },
    ...submissionsStore,
  ]
}

export async function getStudentClassMyProjects(
  classId: string,
  studentId: string,
): Promise<StudentMyProjectRow[]> {
  await wait()
  const projectMap = new Map(
    (classProjects[classId] ?? []).map((p) => [p.id, p.title] as const),
  )
  return submissionsStore
    .filter((s) => s.classId === classId && s.studentId === studentId)
    .map((s) => ({
      submissionId: s.id,
      projectId: s.projectId,
      projectTitle: projectMap.get(s.projectId) ?? "Unknown project",
      status: s.status,
      submittedAt: s.submittedAt,
    }))
}

