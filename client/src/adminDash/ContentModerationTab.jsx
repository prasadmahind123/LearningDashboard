
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, XCircle, Eye } from "lucide-react"

const courses = [
  {
    id: 2,
    title: "Machine Learning Basics",
    instructor: "Mike Rodriguez",
    category: "Data Science",
    status: "Under Review",
  },
]

export default function ContentModerationTab() {
  const handleApprovecourse = (courseId) => {
    console.log("Approving course:", courseId)
    // Implementation for approving course
  }

  const handleRejectcourse = (courseId) => {
    console.log("Rejecting course:", courseId)
    // Implementation for rejecting course
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-sm text-muted-foreground">courses awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              Approved Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-sm text-muted-foreground">Content approved today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <XCircle className="h-5 w-5 mr-2 text-red-500" />
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-sm text-muted-foreground">Content rejected this week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Moderation Queue</CardTitle>
          <CardDescription>Review and moderate course content and courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courses
              .filter((course) => course.status === "Under Review")
              .map((course) => (
                <div key={course.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                      <p className="text-sm text-muted-foreground">Category: {course.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="cursor-pointer">
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm" className = "cursor-pointer" onClick={() => handleApprovecourse(course.id)}>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                      <Button variant="outline" size="sm" className={"cursor-pointer"} onClick={() => handleRejectcourse(course.id)}>
                        <XCircle className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
