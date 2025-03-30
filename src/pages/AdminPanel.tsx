
import React from 'react';
import Header from '@/components/Header';
import { useStore } from '@/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserManagement from '@/components/UserManagement';
import DutyManagement from '@/components/DutyManagement';
import RubricManagement from '@/components/RubricManagement';
import Login from '@/components/Login';
import { Navigate } from 'react-router-dom';

const AdminPanel = () => {
  const { isAuthenticated, currentUser } = useStore();

  if (!isAuthenticated) {
    return <Login />;
  }

  if (currentUser?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="container py-6 flex-1">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
          
          <Tabs defaultValue="duties">
            <TabsList className="mb-6">
              <TabsTrigger value="duties">Manage Duties</TabsTrigger>
              <TabsTrigger value="users">Manage Users</TabsTrigger>
              <TabsTrigger value="rubrics">Manage Duty Types</TabsTrigger>
            </TabsList>
            
            <TabsContent value="duties">
              <DutyManagement />
            </TabsContent>
            
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
            
            <TabsContent value="rubrics">
              <RubricManagement />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="bg-white border-t py-4">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Duty Calendar - All rights reserved
        </div>
      </footer>
    </div>
  );
};

export default AdminPanel;
