import { useState } from 'react';
import { Container, Stack, Tabs, Tab } from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { NotificationItem } from '@/components/ui/NotificationItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { mockNotifications } from '@/mock/notifications';
import type { MockNotification } from '@/mock/notifications';

export function NotificationCenterPage() {
  const [notifications, setNotifications] = useState<MockNotification[]>(mockNotifications);
  const [tab, setTab] = useState<'all' | 'assigned' | 'commented' | 'completed'>('all');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (tab === 'assigned') return n.type === 'issue_assigned';
    if (tab === 'commented') return n.type === 'comment_added';
    if (tab === 'completed') return n.type === 'issue_completed';
    return true;
  });

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success('All notifications marked as read');
  };

  const handleMarkRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success('Notification deleted');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3.5}>
        <PageHeader
          title="Notifications"
          subtitle="Notification digest covering mentions, issue assignments, comments, and task completions."
          actionText={unreadCount > 0 ? 'Mark all as read' : undefined}
          actionIcon={<DoneAllIcon />}
          onAction={handleMarkAllRead}
        />

        {/* Tabs Filter */}
        <Tabs value={tab} onChange={(_, val) => setTab(val)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab value="all" label={`All (${notifications.length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
          <Tab value="assigned" label="Assigned" sx={{ textTransform: 'none', fontWeight: 600 }} />
          <Tab value="commented" label="Commented" sx={{ textTransform: 'none', fontWeight: 600 }} />
          <Tab value="completed" label="Completed" sx={{ textTransform: 'none', fontWeight: 600 }} />
        </Tabs>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <EmptyState
            title="No notifications in this category"
            description="You are caught up on all task notifications."
          />
        ) : (
          <Stack spacing={1.5}>
            {filteredNotifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                notification={notif}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
