
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertTriangle, Eye, CheckCircle, TrendingUp } from "lucide-react"

const reports = [
  {
    id: 1,
    type: "course Content",
    reporter: "Alice Johnson",
    reportedItem: "Advanced React Development",
    reason: "Outdated content in module 3",
    status: "Open",
    priority: "Medium",
    date: "2024-01-18",
    description: "The React hooks section contains deprecated patterns that are no longer recommended.",
  },
  {
    id: 2,
    type: "Instructor Behavior",
    reporter: "Bob Smith",
    reportedItem: "Mike Rodriguez",
    reason: "Inappropriate response to student question",
    status: "Under Investigation",
    priority: "High",
    date: "2024-01-17",
    description: "Instructor was dismissive and rude when responding to a legitimate question in the course forum.",
  },
  {
    id: 3,
    type: "Technical Issue",
    reporter: "Carol Davis",
    reportedItem: "Digital Marketing Strategy",
    reason: "Video playback issues",
    status: "Resolved",
    priority: "Low",
    date: "2024-01-15",
    description: "Videos in chapter 2 were not loading properly. Issue has been fixed.",
  },
  {
    id: 4,
    type: "course Content",
    reporter: "David Wilson",
    reportedItem: "Machine Learning Basics",
    reason: "Plagiarized content",
    status: "Open",
    priority: "High",
    date: "2024-01-16",
    description: "Several sections appear to be copied from other online resources without attribution.",
  },
]

export default function ReportsTab() {
  const [selectedReport, setSelectedReport] = useState(null)

  const handleResolveReport = (reportId) => {
    console.log("Resolving report:", reportId)
    // Implementation for resolving report
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              Open Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.filter((r) => r.status === "Open").length}</div>
            <p className="text-sm text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2 text-yellow-500" />
              Under Investigation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.filter((r) => r.status === "Under Investigation").length}</div>
            <p className="text-sm text-muted-foreground">Being reviewed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              Resolved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.filter((r) => r.status === "Resolved").length}</div>
            <p className="text-sm text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
              High Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.filter((r) => r.priority === "High").length}</div>
            <p className="text-sm text-muted-foreground">Need immediate action</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reports & Feedback</CardTitle>
          <CardDescription>Manage user reports and feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead className="hidden md:table-cell">Reported Item</TableHead>
                  <TableHead className="hidden lg:table-cell">Reason</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <Badge variant="outline">{report.type}</Badge>
                    </TableCell>
                    <TableCell>{report.reporter}</TableCell>
                    <TableCell className="hidden md:table-cell">{report.reportedItem}</TableCell>
                    <TableCell className="hidden lg:table-cell">{report.reason}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          report.priority === "High"
                            ? "destructive"
                            : report.priority === "Medium"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {report.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          report.status === "Open"
                            ? "destructive"
                            : report.status === "Under Investigation"
                              ? "secondary"
                              : "default"
                        }
                      >
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{report.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)} className="cursor-pointer">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Report Details</DialogTitle>
                              <DialogDescription>
                                Full details of the report from {selectedReport?.reporter}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedReport && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Report Type</Label>
                                    <p className="font-medium">{selectedReport.type}</p>
                                  </div>
                                  <div>
                                    <Label>Reporter</Label>
                                    <p className="font-medium">{selectedReport.reporter}</p>
                                  </div>
                                  <div>
                                    <Label>Reported Item</Label>
                                    <p className="font-medium">{selectedReport.reportedItem}</p>
                                  </div>
                                  <div>
                                    <Label>Priority</Label>
                                    <Badge
                                      variant={
                                        selectedReport.priority === "High"
                                          ? "destructive"
                                          : selectedReport.priority === "Medium"
                                            ? "secondary"
                                            : "outline"
                                      }
                                    >
                                      {selectedReport.priority}
                                    </Badge>
                                  </div>
                                  <div>
                                    <Label>Status</Label>
                                    <Badge
                                      variant={
                                        selectedReport.status === "Open"
                                          ? "destructive"
                                          : selectedReport.status === "Under Investigation"
                                            ? "secondary"
                                            : "default"
                                      }
                                    >
                                      {selectedReport.status}
                                    </Badge>
                                  </div>
                                  <div>
                                    <Label>Date Reported</Label>
                                    <p className="font-medium">{selectedReport.date}</p>
                                  </div>
                                </div>
                                <div>
                                  <Label>Reason</Label>
                                  <p className="font-medium">{selectedReport.reason}</p>
                                </div>
                                <div>
                                  <Label>Description</Label>
                                  <p className="text-sm">{selectedReport.description}</p>
                                </div>
                                <div className="space-y-2">
                                  <Label>Admin Response</Label>
                                  <Textarea placeholder="Add your response or resolution notes..." />
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button onClick={() => handleResolveReport(selectedReport?.id || 0)} className="cursor-pointer bg-destructive text-destructive-foreground">
                                Mark as Resolved
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        {report.status !== "Resolved" && (
                          <Button variant="outline" size="sm" onClick={() => handleResolveReport(report.id)} className="cursor-pointer">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Resolve
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
