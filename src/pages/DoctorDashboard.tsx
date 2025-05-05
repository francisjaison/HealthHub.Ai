import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { doctorApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface Appointment {
  id: string;
  patientName: string;
  date: Date;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  patientId: string;
}

interface PatientHistory {
  id: string;
  name: string;
  riskReports: RiskReport[];
  lastVisit: Date;
}

interface RiskReport {
  id: string;
  date: Date;
  riskLevel: 'low' | 'medium' | 'high';
  details: string;
}

export default function DoctorDashboard() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedPatient, setSelectedPatient] = useState<PatientHistory | null>(null);
  const [advice, setAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const data = await doctorApi.getAppointments();
      setAppointments(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch appointments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPatientHistory = async (patientId: string, patientName: string) => {
    try {
      setIsLoading(true);
      const history = await doctorApi.getPatientHistory(patientId);
      setSelectedPatient({
        id: patientId,
        name: patientName,
        riskReports: history.riskReports,
        lastVisit: new Date(history.lastVisit)
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch patient history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendAdvice = async (patientId: string) => {
    if (!advice.trim()) {
      toast({
        title: "Error",
        description: "Please enter advice before sending",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await doctorApi.sendAdvice(patientId, advice);
      toast({
        title: "Success",
        description: "Advice sent successfully",
      });
      setAdvice('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send advice",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAppointmentStatus = async (appointmentId: string, status: 'scheduled' | 'completed' | 'cancelled') => {
    try {
      setIsLoading(true);
      await doctorApi.updateAppointmentStatus(appointmentId, status);
      await fetchAppointments();
      toast({
        title: "Success",
        description: "Appointment status updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
      <p className="text-gray-600">Welcome, Dr. {user?.name}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Appointment Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <p>Loading appointments...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.patientName}</TableCell>
                      <TableCell>{appointment.date.toLocaleDateString()}</TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>
                        <Badge variant={appointment.status === 'scheduled' ? 'default' : 'secondary'}>
                          {appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPatientHistory(appointment.patientId, appointment.patientName)}
                        >
                          View History
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateAppointmentStatus(appointment.id, 'completed')}
                        >
                          Complete
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleUpdateAppointmentStatus(appointment.id, 'cancelled')}
                        >
                          Cancel
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Patient History and Advice Section */}
      {selectedPatient && (
        <Card>
          <CardHeader>
            <CardTitle>Patient History: {selectedPatient.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Risk Reports</h3>
              {selectedPatient.riskReports.map((report) => (
                <div key={report.id} className="border p-4 rounded-lg">
                  <p>Date: {report.date.toLocaleDateString()}</p>
                  <p>Risk Level: {report.riskLevel}</p>
                  <p>Details: {report.details}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Send Advice</h3>
              <Textarea
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                placeholder="Enter your advice for the patient..."
                className="min-h-[100px]"
              />
              <Button 
                onClick={() => handleSendAdvice(selectedPatient.id)}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Advice'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 