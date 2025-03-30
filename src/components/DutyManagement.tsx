
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
import { CalendarIcon, X } from 'lucide-react';

const DutyManagement = () => {
  const { users, rubrics, duties, addDuty, removeDuty, currentDate } = useStore();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(currentDate);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedRubric, setSelectedRubric] = useState<RubricType | ''>('');

  const handleAddDuty = () => {
    if (!selectedDate || !selectedUser || !selectedRubric) return;

    const user = users.find(u => u.id === selectedUser);
    if (!user) return;

    const newDuty: DutyWithUser = {
      id: Date.now().toString(),
      userId: selectedUser,
      type: selectedRubric as RubricType,
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Duty Management</CardTitle>
        <CardDescription>Assign duties to users</CardDescription>
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
              <Select value={selectedRubric} onValueChange={setSelectedRubric as (value: string) => void}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duty type" />
                </SelectTrigger>
                <SelectContent>
                  {rubrics.map(rubric => (
                    <SelectItem key={rubric} value={rubric}>
                      {rubric}
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
                    <div className="text-sm">
                      <span className="font-medium">{duty.type}:</span> {duty.user.name}
                    </div>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => removeDuty(duty.id)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
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
