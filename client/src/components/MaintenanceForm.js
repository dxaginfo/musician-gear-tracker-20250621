import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Box,
  Paper,
  Divider,
  IconButton,
  FormHelperText,
  Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const MaintenanceForm = ({ 
  initialData, 
  equipment, 
  onSubmit, 
  isEdit = false 
}) => {
  const [formData, setFormData] = useState({
    type: 'routine',
    date: new Date(),
    description: '',
    technician: '',
    cost: 0,
    partsReplaced: [],
    notes: '',
    nextScheduledDate: null
  });
  
  const [errors, setErrors] = useState({});
  
  // Set initial form data if provided
  useEffect(() => {
    if (initialData) {
      // Convert date strings to Date objects
      const data = {
        ...initialData,
        date: initialData.date ? new Date(initialData.date) : new Date(),
        nextScheduledDate: initialData.nextScheduledDate 
          ? new Date(initialData.nextScheduledDate) 
          : null
      };
      setFormData(data);
    }
  }, [initialData]);
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.description) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.cost < 0) {
      newErrors.cost = 'Cost cannot be negative';
    }
    
    // Validate each part replaced
    const partsErrors = [];
    formData.partsReplaced.forEach((part, index) => {
      const partError = {};
      if (!part.name) {
        partError.name = 'Part name is required';
      }
      if (part.cost < 0) {
        partError.cost = 'Cost cannot be negative';
      }
      
      if (Object.keys(partError).length > 0) {
        partsErrors[index] = partError;
      }
    });
    
    if (partsErrors.length > 0) {
      newErrors.partsReplaced = partsErrors;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Add equipment ID if not editing
      const submitData = {
        ...formData,
        equipmentId: equipment._id
      };
      
      onSubmit(submitData);
    }
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle number input changes
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };
  
  // Handle date changes
  const handleDateChange = (name, date) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date
    }));
  };
  
  // Add a new part
  const handleAddPart = () => {
    setFormData((prev) => ({
      ...prev,
      partsReplaced: [
        ...prev.partsReplaced,
        { name: '', cost: 0 }
      ]
    }));
  };
  
  // Remove a part
  const handleRemovePart = (index) => {
    setFormData((prev) => ({
      ...prev,
      partsReplaced: prev.partsReplaced.filter((_, i) => i !== index)
    }));
  };
  
  // Update part data
  const handlePartChange = (index, field, value) => {
    setFormData((prev) => {
      const newPartsReplaced = [...prev.partsReplaced];
      newPartsReplaced[index] = {
        ...newPartsReplaced[index],
        [field]: field === 'cost' ? (parseFloat(value) || 0) : value
      };
      return {
        ...prev,
        partsReplaced: newPartsReplaced
      };
    });
  };
  
  // Calculate total cost
  const totalCost = () => {
    const partsCost = formData.partsReplaced.reduce(
      (sum, part) => sum + (parseFloat(part.cost) || 0),
      0
    );
    return (parseFloat(formData.cost) || 0) + partsCost;
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {isEdit ? 'Edit Maintenance Record' : 'Add Maintenance Record'}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Equipment: {equipment?.name}
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Maintenance Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Maintenance Type"
              >
                <MenuItem value="routine">Routine Maintenance</MenuItem>
                <MenuItem value="repair">Repair</MenuItem>
                <MenuItem value="upgrade">Upgrade</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Maintenance Date"
                value={formData.date}
                onChange={(date) => handleDateChange('date', date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Technician"
              name="technician"
              value={formData.technician}
              onChange={handleChange}
              placeholder="Who performed the maintenance?"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Service Cost"
              name="cost"
              type="number"
              value={formData.cost}
              onChange={handleNumberChange}
              InputProps={{ startAdornment: '$' }}
              error={!!errors.cost}
              helperText={errors.cost}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Parts Replaced</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddPart}
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
              >
                Add Part
              </Button>
            </Box>
            
            {formData.partsReplaced.map((part, index) => (
              <Stack 
                key={index} 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                sx={{ mb: 2 }}
                alignItems="center"
              >
                <TextField
                  fullWidth
                  label="Part Name"
                  value={part.name}
                  onChange={(e) => handlePartChange(index, 'name', e.target.value)}
                  error={errors.partsReplaced && errors.partsReplaced[index]?.name}
                  helperText={errors.partsReplaced && errors.partsReplaced[index]?.name}
                />
                <TextField
                  label="Cost"
                  type="number"
                  value={part.cost}
                  onChange={(e) => handlePartChange(index, 'cost', e.target.value)}
                  InputProps={{ startAdornment: '$' }}
                  error={errors.partsReplaced && errors.partsReplaced[index]?.cost}
                  helperText={errors.partsReplaced && errors.partsReplaced[index]?.cost}
                  sx={{ width: { xs: '100%', sm: '30%' } }}
                />
                <IconButton 
                  color="error" 
                  onClick={() => handleRemovePart(index)}
                  aria-label="Remove part"
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            ))}
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Next Scheduled Maintenance"
                value={formData.nextScheduledDate}
                onChange={(date) => handleDateChange('nextScheduledDate', date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
            <FormHelperText>
              When should this equipment be serviced next?
            </FormHelperText>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <Typography variant="h6">Total Cost</Typography>
              <Typography variant="h4">${totalCost().toFixed(2)}</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                size="large"
              >
                {isEdit ? 'Update Record' : 'Add Record'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

MaintenanceForm.propTypes = {
  initialData: PropTypes.object,
  equipment: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isEdit: PropTypes.bool
};

export default MaintenanceForm;