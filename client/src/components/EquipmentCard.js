import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Grid,
  Box,
  Avatar,
  IconButton
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Build as BuildIcon,
  ImageNotSupported as NoImageIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

const EquipmentCard = ({ equipment, onDelete, onAddMaintenance }) => {
  const {
    _id,
    name,
    type,
    category,
    make,
    model,
    serialNumber,
    purchaseDate,
    currentValue,
    status,
    images,
    lastMaintenanceDate,
    nextMaintenanceDate
  } = equipment;

  // Calculate days until next maintenance
  const getDaysUntilMaintenance = () => {
    if (!nextMaintenanceDate) return null;
    
    const now = new Date();
    const next = new Date(nextMaintenanceDate);
    const diffTime = next - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Get appropriate chip color based on maintenance status
  const getMaintenanceStatusColor = () => {
    if (!nextMaintenanceDate) return 'default';
    
    const daysUntil = getDaysUntilMaintenance();
    
    if (daysUntil < 0) return 'error';
    if (daysUntil < 15) return 'warning';
    return 'success';
  };

  // Get appropriate chip color based on equipment status
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'success';
      case 'in repair':
        return 'warning';
      case 'sold':
        return 'info';
      case 'lost':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ position: 'relative', paddingTop: '56.25%', overflow: 'hidden' }}>
        {images && images.length > 0 ? (
          <img
            src={images[0].url}
            alt={name}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.200'
            }}
          >
            <NoImageIcon sx={{ fontSize: 60, color: 'grey.400' }} />
          </Box>
        )}
        <Chip
          label={status}
          color={getStatusColor()}
          size="small"
          sx={{ position: 'absolute', top: 8, right: 8 }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {make} {model}
        </Typography>
        
        <Grid container spacing={1} sx={{ mb: 1 }}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Type:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              {type}
            </Typography>
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Category:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              {category}
            </Typography>
          </Grid>
          
          {serialNumber && (
            <>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Serial:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  {serialNumber}
                </Typography>
              </Grid>
            </>
          )}
          
          {purchaseDate && (
            <>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Purchased:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  {new Date(purchaseDate).toLocaleDateString()}
                </Typography>
              </Grid>
            </>
          )}
          
          {currentValue && (
            <>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Value:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  ${currentValue.toFixed(2)}
                </Typography>
              </Grid>
            </>
          )}
        </Grid>

        {lastMaintenanceDate && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Last maintenance: {formatDistanceToNow(new Date(lastMaintenanceDate))} ago
          </Typography>
        )}
        
        {nextMaintenanceDate && (
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              Next maintenance:
            </Typography>
            <Chip
              label={
                getDaysUntilMaintenance() < 0
                  ? 'Overdue'
                  : `${getDaysUntilMaintenance()} days`
              }
              color={getMaintenanceStatusColor()}
              size="small"
            />
          </Box>
        )}
      </CardContent>
      
      <CardActions>
        <Button size="small" component={Link} to={`/equipment/${_id}`}>
          View Details
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton 
          size="small" 
          color="primary" 
          onClick={() => onAddMaintenance(_id)}
          title="Add Maintenance"
        >
          <BuildIcon />
        </IconButton>
        <IconButton 
          size="small" 
          component={Link} 
          to={`/equipment/edit/${_id}`}
          title="Edit Equipment"
        >
          <EditIcon />
        </IconButton>
        <IconButton 
          size="small" 
          color="error" 
          onClick={() => onDelete(_id)}
          title="Delete Equipment"
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

EquipmentCard.propTypes = {
  equipment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    make: PropTypes.string,
    model: PropTypes.string,
    serialNumber: PropTypes.string,
    purchaseDate: PropTypes.string,
    currentValue: PropTypes.number,
    status: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
        caption: PropTypes.string
      })
    ),
    lastMaintenanceDate: PropTypes.string,
    nextMaintenanceDate: PropTypes.string
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddMaintenance: PropTypes.func.isRequired
};

export default EquipmentCard;