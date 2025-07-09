import React, { useState } from 'react';
import {
  TextField, Button, Select, MenuItem, InputLabel,
  FormControl, Snackbar, Alert, Box
} from '@mui/material';
import { addUser } from '../services/userService';

const UserForm = () => {
  const [form, setForm] = useState({ name: '', email: '', age: '', gender: '' });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ open: false, severity: '', message: '' });

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.age) errs.age = 'Age is required';
    else if (form.age < 18 || form.age > 100) errs.age = 'Age must be between 18 and 100';
    if (!form.gender) errs.gender = 'Gender is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await addUser(form);
      setAlert({ open: true, severity: 'success', message: 'User added successfully!' });
      setForm({ name: '', email: '', age: '', gender: '' });
      setErrors({});
    } catch {
      setAlert({ open: true, severity: 'error', message: 'Failed to add user.' });
    }
  };

  return (
    <Box sx={{ maxWidth: 400, m: 'auto', mt: 4 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth label="Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={!!errors.name} helperText={errors.name} margin="normal"
        />
        <TextField
          fullWidth label="Email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={!!errors.email} helperText={errors.email} margin="normal"
        />
        <TextField
          fullWidth label="Age" type="number" value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          error={!!errors.age} helperText={errors.age} margin="normal"
        />
        <FormControl fullWidth margin="normal" error={!!errors.gender}>
          <InputLabel>Gender</InputLabel>
          <Select
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            label="Gender"
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </Select>
        </FormControl>
        {errors.gender && <div style={{ color: 'red', fontSize: 12 }}>{errors.gender}</div>}

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Submit
        </Button>
      </form>

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserForm;
