import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Box
} from '@mui/material';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users');
    }
  };

  const handleDelete = async (id) => {
    if (!id || isNaN(parseInt(id))) {
      setError('Invalid user ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.delete(id);
        setUsers(users.filter(user => user.id !== parseInt(id)));
      } catch (err) {
        setError(err.message || 'Failed to delete user');
      }
    }
  };

  const handleEdit = (user) => {
    if (!user || !user.id || isNaN(parseInt(user.id))) {
      setError('Invalid user data');
      return;
    }
    setEditingUser(user);
    setOpenDialog(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingUser || !editingUser.id || isNaN(parseInt(editingUser.id))) {
      setError('Invalid user data');
      return;
    }

    try {
      const updatedUser = await userService.update(editingUser.id, {
        username: editingUser.username,
        email: editingUser.email,
      });
      setUsers(users.map(user => user.id === parseInt(updatedUser.id) ? updatedUser : user));
      setEditingUser(null);
      setOpenDialog(false);
    } catch (err) {
      setError(err.message || 'Failed to update user');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Button
            component={Link}
            to="/users"
            color="inherit"
            sx={{ mr: 2 }}
          >
            Gestión de Usuarios
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleUpdate} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Username"
                value={editingUser?.username || ''}
                onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={editingUser?.email || ''}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                margin="normal"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdate} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
} 