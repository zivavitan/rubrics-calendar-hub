
import React, { useState } from 'react';
import { useStore } from '@/store';
import { RubricType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { getRubricColors } from './RubricLegend';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const RubricManagement = () => {
  const { rubrics, addRubric, removeRubric, updateRubric, duties } = useStore();
  const [newRubric, setNewRubric] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editingRubric, setEditingRubric] = useState<{ original: string, updated: string } | null>(null);
  
  const rubricColors = getRubricColors(rubrics);

  const handleAddRubric = () => {
    if (!newRubric.trim()) {
      toast.error('Rubric name cannot be empty');
      return;
    }
    
    if (rubrics.includes(newRubric)) {
      toast.error('Rubric already exists');
      return;
    }
    
    addRubric(newRubric);
    setNewRubric('');
    toast.success(`Rubric "${newRubric}" added`);
  };

  const handleRemoveRubric = (rubric: RubricType) => {
    // Check if the rubric is in use
    const isInUse = duties.some(duty => duty.type === rubric);
    
    if (isInUse) {
      toast.error(`Cannot remove "${rubric}" as it's currently in use`);
      return;
    }
    
    removeRubric(rubric);
    toast.success(`Rubric "${rubric}" removed`);
  };

  const startEdit = (rubric: RubricType) => {
    setEditingRubric({ original: rubric, updated: rubric });
    setEditMode(true);
  };

  const cancelEdit = () => {
    setEditingRubric(null);
    setEditMode(false);
  };

  const handleUpdateRubric = () => {
    if (!editingRubric) return;
    
    const { original, updated } = editingRubric;
    
    if (!updated.trim()) {
      toast.error('Rubric name cannot be empty');
      return;
    }
    
    if (rubrics.includes(updated) && updated !== original) {
      toast.error('Rubric already exists');
      return;
    }
    
    updateRubric(original, updated);
    setEditingRubric(null);
    setEditMode(false);
    toast.success(`Rubric updated from "${original}" to "${updated}"`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Manage Duty Types</CardTitle>
        <CardDescription>Add, edit, or remove duty types (rubrics)</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6">
          <div className="flex gap-3">
            <Input
              placeholder="New duty type name"
              value={newRubric}
              onChange={(e) => setNewRubric(e.target.value)}
              className="max-w-xs"
              disabled={editMode}
            />
            <Button onClick={handleAddRubric} disabled={editMode}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Color</TableHead>
              <TableHead>Duty Type</TableHead>
              <TableHead className="w-[160px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rubrics.map((rubric, index) => (
              <TableRow key={rubric}>
                <TableCell>
                  <span 
                    className={`inline-block w-4 h-4 rounded-full ${rubricColors[rubric]}`}
                  ></span>
                </TableCell>
                <TableCell>
                  {editingRubric?.original === rubric ? (
                    <Input 
                      value={editingRubric.updated}
                      onChange={(e) => setEditingRubric({ 
                        ...editingRubric, 
                        updated: e.target.value 
                      })}
                      className="max-w-xs"
                    />
                  ) : (
                    rubric
                  )}
                </TableCell>
                <TableCell>
                  {editingRubric?.original === rubric ? (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleUpdateRubric}>
                        Save
                      </Button>
                      <Button variant="ghost" size="sm" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => startEdit(rubric)}
                        disabled={editMode}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleRemoveRubric(rubric)}
                        disabled={editMode}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {rubrics.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                  No duty types defined yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RubricManagement;
