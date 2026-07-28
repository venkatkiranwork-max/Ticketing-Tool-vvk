import { useState } from 'react';
import {
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
} from '@mui/material';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchBar } from '@/components/ui/SearchBar';
import { mockAuditLogs, type AuditLogEntry } from '@/mock/auditLogs';

export function AuditLogsPage() {
  const [logs] = useState<AuditLogEntry[]>(mockAuditLogs);
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter(
    (l) =>
      l.userName.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      l.module.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={3.5}>
        <PageHeader
          title="Security & Audit Logs"
          subtitle="System security telemetry feed recording administrative actions, role assignments, and permission checks."
          actionText="Super Admin Only"
          actionIcon={<ShieldOutlinedIcon />}
        />

        <SearchBar placeholder="Search audit logs by user, action, or module details..." value={search} onChange={setSearch} />

        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '14px' }}>
          <Table>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Timestamp</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Module</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>IP Address</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {log.userName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {log.userRole}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={log.action} size="small" sx={{ fontWeight: 700, fontSize: '0.675rem' }} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{log.module}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                      {log.ipAddress}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.status}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.65rem',
                        bgcolor:
                          log.status === 'SUCCESS'
                            ? 'rgba(16, 185, 129, 0.12)'
                            : log.status === 'WARNING'
                            ? 'rgba(245, 158, 11, 0.12)'
                            : 'rgba(239, 68, 68, 0.12)',
                        color:
                          log.status === 'SUCCESS'
                            ? '#10b981'
                            : log.status === 'WARNING'
                            ? '#d97706'
                            : '#ef4444',
                        border: 'none',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.825rem' }}>
                      {log.details}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Container>
  );
}
