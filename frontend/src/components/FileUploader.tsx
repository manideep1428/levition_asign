import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Search, Calendar, FileIcon } from 'lucide-react';
import axios from 'axios';
import { BACKEND_URL } from '../../config';

interface Address {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  userId: string;
  date: string;
}

interface Interest {
  id: string;
  userId: string;
  value: string;
  date: string;
}

interface File {
  id: string;
  name: string;
  url: string;
  publicId?: string;
  size: number;
  mimeType: string;
  date: string;
  userId: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  addresses: Address[];
  interests: Interest[];
  files: File[];
}

export default function TableComponent() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<User[]>(`${BACKEND_URL}/api/v1/form-bundle`);
        console.log(response.data);
        if (Array.isArray(response.data)) {
          setUsers(response.data);
          setFilteredUsers(response.data);
        } else {
          setError('Received data is not an array');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError('An error occurred while fetching data.');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!Array.isArray(users)) {
      setError('Users data is not an array');
      return;
    }
    const filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.addresses.some(address => 
                              `${address.firstName} ${address.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              address.email.toLowerCase().includes(searchTerm.toLowerCase())
                            );
      const matchesDateRange = user.addresses.some(address => {
        const addressDate = new Date(address.date);
        return (!startDate || addressDate >= startDate) &&
               (!endDate || addressDate <= endDate);
      });
      return matchesSearch && matchesDateRange;
    });
    setFilteredUsers(filtered);
  }, [searchTerm, startDate, endDate, users]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>User Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              selectsStart
              //@ts-expect-error ddsdds
              startDate={startDate}
              //@ts-expect-error ddsdds
              endDate={endDate}
              placeholderText="Start Date"
              className="w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date)}
              selectsEnd
              //@ts-expect-error ddsdds
              startDate={startDate}
              //@ts-expect-error ddsdds
              endDate={endDate}
              //@ts-expect-error ddsdds
              minDate={startDate}
              placeholderText="End Date"
              className="w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>
        </div>
        {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Addresses</TableHead>
                <TableHead>Interests</TableHead>
                <TableHead>Files</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.addresses.map((address, index) => (
                      <div key={address.id}>
                        {`${address.firstName} ${address.lastName}, ${address.city}, ${address.country}`}
                        {index < user.addresses.length - 1 && <br />}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {user.interests.map(interest => interest.value).join(', ')}
                  </TableCell>
                  <TableCell>
                    {user.files.map((file, index) => (
                      <div key={file.id} className="flex items-center space-x-2">
                        <FileIcon className="h-4 w-4" />
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          {file.name}
                        </a>
                        {index < user.files.length - 1 && <br />}
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div>No users found</div>
        )}
      </CardContent>
    </Card>
  );
}