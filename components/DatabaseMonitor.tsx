'use client';

import React, { useState, useEffect } from 'react';
import './DatabaseMonitor.css';

interface User {
  _id: string;
  email: string;
  accessCount: number;
  createdAt: string;
  lastAccessAt: string;
}

interface DatabaseMonitorProps {
  refreshTrigger: number;
}

const DatabaseMonitor: React.FC<DatabaseMonitorProps> = ({ refreshTrigger }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/db/users');
        const data = await response.json();

        if (response.ok) {
          setUsers(data.data);
          const now = new Date();
          setLastUpdate(now.toLocaleTimeString());
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [refreshTrigger]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="database-monitor">
      <div className="monitor-header">
        <span className="status-indicator">●</span>
        <span className="monitor-title">Live Database Monitor</span>
        <span className="record-count">{users.length} users</span>
      </div>

      {isLoading && (
        <div className="loading-indicator">
          Loading...
        </div>
      )}

      <div className="users-table-container">
        {users.length > 0 ? (
          <table className="users-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Access Count</th>
                <th>Created At</th>
                <th>Last Access</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="email-cell">{user.email}</td>
                  <td className="count-cell">{user.accessCount}</td>
                  <td className="date-cell">{formatDate(user.createdAt)}</td>
                  <td className="date-cell">{formatDate(user.lastAccessAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p>No users in database yet</p>
          </div>
        )}
      </div>

      {lastUpdate && (
        <div className="monitor-footer">
          Last updated: {lastUpdate}
        </div>
      )}
    </div>
  );
};

export default DatabaseMonitor;
