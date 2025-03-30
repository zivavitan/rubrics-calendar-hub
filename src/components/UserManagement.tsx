
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useStore } from '../store';
import { User } from '@/types';

const UserManagement = () => {
  const { users, addUser, removeUser, updateUser } = useStore();
  
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    name: '',
    email: '',
    phone: '',
    role: 'user'
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.phone) return;
    
    addUser({
      ...newUser,
      id: Date.now().toString() // Simple id generation
    });
    
    // Clear form
    setNewUser({
      name: '',
      email: '',
      phone: '',
      role: 'user'
    });
  };
  
  const handleEditUser = (user: User) => {
    setEditingId(user.id);
    setNewUser({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    });
  };
  
  const handleUpdateUser = () => {
    if (!editingId) return;
    
    updateUser(editingId, newUser);
    setEditingId(null);
    setNewUser({
      name: '',
      email: '',
      phone: '',
      role: 'user'
    });
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
    setNewUser({
      name: '',
      email: '',
      phone: '',
      role: 'user'
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Add, edit, or remove users</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* User Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                placeholder="John Doe"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                placeholder="john@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newUser.phone}
                onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                placeholder="+1234567890"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                className="w-full p-2 border rounded"
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value as "admin" | "user"})}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            {editingId ? (
              <>
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateUser}>
                  Update User
                </Button>
              </>
            ) : (
              <Button onClick={handleAddUser}>
                Add User
              </Button>
            )}
          </div>
        </div>
        
        {/* User List */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Users</h3>
          
          <div className="border rounded-md divide-y">
            {users.map(user => (
              <div key={user.id} className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email} • {user.phone}</div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => removeUser(user.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
