export type DashboardClass = {
  id: string
  code: string
  title: string
  term: string
  instructorName: string
}

export type ClassStudent = {
  userId: string
  name: string
  email: string
}

export type ClassProject = {
  id: string
  classId: string
  title: string
  summary: string
}

export type ProjectSubmission = {
  id: string
  classId: string
  projectId: string
  studentId: string
  studentName: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
}

export const dashboardClasses: DashboardClass[] = [
  {
    id: "c-101",
    code: "CS 3140",
    title: "Software Development Essentials",
    term: "Fall 2026",
    instructorName: "Dr. Patel",
  },
  {
    id: "c-202",
    code: "CS 3500",
    title: "Human-Computer Interaction",
    term: "Fall 2026",
    instructorName: "Prof. Nguyen",
  },
]

export const classStudents: Record<string, ClassStudent[]> = {
  "c-101": [
    { userId: "stu-01", name: "Avery Kim", email: "avery@example.edu" },
    { userId: "stu-02", name: "Jordan Lee", email: "jordan@example.edu" },
    { userId: "stu-03", name: "Sam Carter", email: "sam@example.edu" },
  ],
  "c-202": [
    { userId: "stu-04", name: "Morgan Gray", email: "morgan@example.edu" },
    { userId: "stu-01", name: "Avery Kim", email: "avery@example.edu" },
  ],
}

export const classProjects: Record<string, ClassProject[]> = {
  "c-101": [
    {
      id: "p-1001",
      classId: "c-101",
      title: "DevSync Team Collaboration Tool",
      summary: "Build a collaboration dashboard with role-based access.",
    },
    {
      id: "p-1002",
      classId: "c-101",
      title: "Realtime Classroom Q&A",
      summary: "Implement a live question queue with moderation controls.",
    },
  ],
  "c-202": [
    {
      id: "p-2001",
      classId: "c-202",
      title: "Accessible Mobile Planner",
      summary: "Design and prototype an inclusive planning app.",
    },
  ],
}

export const initialProjectSubmissions: ProjectSubmission[] = [
  {
    id: "s-9001",
    classId: "c-101",
    projectId: "p-1001",
    studentId: "stu-01",
    studentName: "Avery Kim",
    status: "pending",
    submittedAt: "2026-09-12T14:00:00.000Z",
  },
  {
    id: "s-9002",
    classId: "c-101",
    projectId: "p-1002",
    studentId: "stu-02",
    studentName: "Jordan Lee",
    status: "approved",
    submittedAt: "2026-09-10T11:30:00.000Z",
  },
  {
    id: "s-9003",
    classId: "c-202",
    projectId: "p-2001",
    studentId: "stu-01",
    studentName: "Avery Kim",
    status: "rejected",
    submittedAt: "2026-09-08T09:15:00.000Z",
  },
]

