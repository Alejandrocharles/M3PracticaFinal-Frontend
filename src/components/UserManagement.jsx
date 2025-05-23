import { useState, useEffect } from 'react';
import { userService } from '../services/api';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
      setError('');
    } catch (err) {
      setError('Error al cargar usuarios');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await userService.create(newUser);
      setSuccess('Usuario creado exitosamente');
      setNewUser({ username: '', email: '', password: '' });
      loadUsers();
    } catch (err) {
      setError(err.message || 'Error al crear usuario');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setOpenDialog(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await userService.update(editingUser.id, {
        username: editingUser.username,
        email: editingUser.email
      });
      setSuccess('Usuario actualizado exitosamente');
      setEditingUser(null);
      setOpenDialog(false);
      loadUsers();
    } catch (err) {
      setError(err.message || 'Error al actualizar usuario');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await userService.delete(id);
        setSuccess('Usuario eliminado exitosamente');
        loadUsers();
      } catch (err) {
        setError(err.message || 'Error al eliminar usuario');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Gestión de Usuarios
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Formulario para crear nuevo usuario */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Crear Nuevo Usuario
            </Typography>
            <Box component="form" onSubmit={handleCreate}>
              <TextField
                fullWidth
                label="Nombre de Usuario"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                margin="normal"
                required
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                Crear Usuario
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Lista de usuarios */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Usuarios Existentes
            </Typography>
            <Grid container spacing={2}>
              {users.map((user) => (
                <Grid item xs={12} key={user.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{user.username}</Typography>
                      <Typography color="textSecondary">{user.email}</Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(user)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(user.id)}
                      >
                        Eliminar
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Diálogo de edición */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleUpdate} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nombre de Usuario"
              value={editingUser?.username || ''}
              onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={editingUser?.email || ''}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleUpdate} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 