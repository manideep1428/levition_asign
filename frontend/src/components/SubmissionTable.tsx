import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Document, Page } from 'react-pdf'
import { Search, Calendar } from 'lucide-react'
import { BACKEND_URL } from '../../config'
import axios from 'axios'


export default function TableComponent() {
  const [submissions, setSubmissions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    getData();
    const filteredSubmissions = submissions.filter(submission => {
      const matchesSearch = submission.addressForm.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            submission.names.some(name => name.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesDateRange = (!startDate || submission.date >= startDate) &&
                               (!endDate || submission.date <= endDate)
      return matchesSearch && matchesDateRange
    })
    setSubmissions(filteredSubmissions)
  }, [searchTerm, startDate, endDate])

  const handleFileClick = (file) => {
    setSelectedFile(file)
  }
  
  const getData = async ()=>{
    const response  = await  axios.get(`${BACKEND_URL}/form-bundle`)
    setSubmissions(response.data)

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Form Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search submissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Start Date"
              className="w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="End Date"
              className="w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Address Form</TableHead>
              <TableHead>Files</TableHead>
              <TableHead>Names</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>{submission.date.toLocaleDateString()}</TableCell>
                <TableCell>{submission.addressForm}</TableCell>
                <TableCell>
                  {submission.files.map((file, index) => (
                    <Button
                      key={index}
                      variant="link"
                      onClick={() => handleFileClick(file)}
                    >
                      {file}
                    </Button>
                  ))}
                </TableCell>
                <TableCell>{submission.names.join(', ')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {selectedFile && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Selected File: {selectedFile}</h3>
            {selectedFile.endsWith('.pdf') ? (
              <Document file={`/path/to/${selectedFile}`}>
                <Page pageNumber={1} width={300} />
              </Document>
            ) : (
              <img src={`/path/to/${selectedFile}`} alt="Selected file" className="max-w-full h-auto" />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}