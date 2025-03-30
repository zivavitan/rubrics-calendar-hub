
import React, { useState } from 'react';
import { addDays, format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DutyWithUser, RubricType } from '@/types';
import { useStore } from '../store';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Mail, Download, X, Settings } from 'lucide-react';
import { getRubricColors } from './RubricLegend';
import { downloadCalendarInvite, sendCalendarInviteEmail } from '@/utils/calendarUtils';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Define a schema for SMTP configuration
const smtpConfigSchema = z.object({
  host: z.string().min(1, { message: "SMTP host is required" }),
  port: z.number().int().positive().default(587),
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  from: z.string().email({ message: "Valid email address is required" }),
});

type SmtpConfigType = z.infer<typeof smtpConfigSchema>;

const DutyManagement = () => {
  const { users, rubrics, duties, addDuty, removeDuty, currentDate } = useStore();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(currentDate);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedRubric, setSelectedRubric] = useState<RubricType | ''>('');
  const [smtpDialogOpen, setSmtpDialogOpen] = useState(false);
  const [selectedDuty, setSelectedDuty] = useState<DutyWithUser | null>(null);
  
  // Store SMTP config in localStorage for persistence
  const [smtpConfig, setSmtpConfig] = useState<SmtpConfigType>(() => {
    const savedConfig = localStorage.getItem('smtpConfig');
    if (savedConfig) {
      try {
        return JSON.parse(savedConfig);
      } catch (e) {
        return {
          host: '',
          port: 587,
          username: '',
          password: '',
          from: ''
        };
      }
    }
    return {
      host: '',
      port: 587,
      username: '',
      password: '',
      from: ''
    };
  });

  // Setup form for SMTP configuration
  const smtpForm = useForm<SmtpConfigType>({
    resolver: zodResolver(smtpConfigSchema),
    defaultValues: smtpConfig,
  });

  const rubricColors = getRubricColors(rubrics);

  const handleAddDuty = () => {
    if (!selectedDate || !selectedUser || !selectedRubric) return;

    const user = users.find(u => u.id === selectedUser);
    if (!user) return;

    const newDuty: DutyWithUser = {
      id: Date.now().toString(),
      userId: selectedUser,
      type: selectedRubric,
      date: format(selectedDate, 'yyyy-MM-dd'),
      user,
    };

    addDuty(newDuty);
    
    // Reset form
    setSelectedUser('');
    setSelectedRubric('');
  };

  // Get duties for the selected month
  const monthDuties = duties.filter(duty => {
    const dutyDate = new Date(duty.date);
    return dutyDate.getMonth() === selectedDate?.getMonth() && 
           dutyDate.getFullYear() === selectedDate?.getFullYear();
  });
  
  // Handle downloading calendar invitation
  const handleDownloadInvite = (duty: DutyWithUser) => {
    try {
      downloadCalendarInvite(duty);
      toast.success(`Calendar invitation generated for ${duty.user.name}`);
    } catch (error) {
      console.error('Error generating calendar invitation:', error);
      toast.error('Failed to generate calendar invitation');
    }
  };

  // Handle email invitation
  const handleEmailInvite = (duty: DutyWithUser) => {
    setSelectedDuty(duty);
    
    // Check if SMTP config is already set up
    if (smtpConfig.host && smtpConfig.username && smtpConfig.password) {
      sendEmailInvitation(duty);
    } else {
      // Open SMTP settings dialog
      setSmtpDialogOpen(true);
    }
  };

  // Send the email invitation
  const sendEmailInvitation = async (duty: DutyWithUser) => {
    if (!smtpConfig.host || !smtpConfig.username || !smtpConfig.password) {
      toast.error('SMTP configuration is incomplete');
      return;
    }

    toast.loading('Sending email invitation...');
    
    try {
      const result = await sendCalendarInviteEmail(duty, smtpConfig);
      
      if (result) {
        toast.dismiss();
        toast.success(`Calendar invitation sent to ${duty.user.email}`);
      } else {
        toast.dismiss();
        toast.error('Failed to send email invitation');
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to send email invitation');
    }
  };

  // Save SMTP configuration
  const onSubmitSmtpConfig = (data: SmtpConfigType) => {
    setSmtpConfig(data);
    localStorage.setItem('smtpConfig', JSON.stringify(data));
    toast.success('SMTP configuration saved');
    setSmtpDialogOpen(false);
    
    // If there's a selected duty, send the email
    if (selectedDuty) {
      sendEmailInvitation(selectedDuty);
      setSelectedDuty(null);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Duty Management</CardTitle>
          <CardDescription>Assign duties to users</CardDescription>
        </div>
        <Dialog open={smtpDialogOpen} onOpenChange={setSmtpDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              SMTP Settings
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>SMTP Configuration</DialogTitle>
              <DialogDescription>
                Configure your SMTP server to send calendar invitations via email.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...smtpForm}>
              <form onSubmit={smtpForm.handleSubmit(onSubmitSmtpConfig)} className="space-y-4">
                <FormField
                  control={smtpForm.control}
                  name="host"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Host</FormLabel>
                      <FormControl>
                        <Input placeholder="smtp.example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={smtpForm.control}
                  name="port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Port</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="587" 
                          {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value, 10))} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={smtpForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="your-username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={smtpForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={smtpForm.control}
                  name="from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Email</FormLabel>
                      <FormControl>
                        <Input placeholder="duty-calendar@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Duty Assignment Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>User</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Duty Type</Label>
              <Select value={selectedRubric} onValueChange={setSelectedRubric}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duty type" />
                </SelectTrigger>
                <SelectContent>
                  {rubrics.map((rubric) => (
                    <SelectItem key={rubric} value={rubric}>
                      <div className="flex items-center">
                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${rubricColors[rubric]}`}></span>
                        {rubric}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleAddDuty} disabled={!selectedDate || !selectedUser || !selectedRubric}>
              Assign Duty
            </Button>
          </div>
        </div>
        
        {/* Duty List */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Assigned Duties</h3>
          
          <div className="border rounded-md divide-y">
            {monthDuties.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No duties assigned for this month yet.
              </div>
            ) : (
              monthDuties.map(duty => (
                <div key={duty.id} className="p-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{format(new Date(duty.date), 'MMM d, yyyy')}</div>
                    <div className="text-sm flex items-center">
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${rubricColors[duty.type]}`}></span>
                      <span className="font-medium">{duty.type}:</span> {duty.user.name}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="icon" 
                      variant="outline" 
                      onClick={() => handleDownloadInvite(duty)}
                      className="h-8 w-8"
                      title="Download Calendar Invitation"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="outline" 
                      onClick={() => handleEmailInvite(duty)}
                      className="h-8 w-8"
                      title="Send Email Invitation"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => removeDuty(duty.id)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DutyManagement;
