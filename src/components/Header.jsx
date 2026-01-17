import { memo, useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

const Header = memo(({ exportData, importData }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const fileInputRef = useRef(null);

  const open = Boolean(anchorEl);
  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleImportClick = () => {
    handleCloseMenu();
    fileInputRef.current?.click();
  };

  return (
    <>
      <AppBar
        position="sticky"
        color="primary"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar disableGutters>
          <Container maxWidth="sm">
            <Box sx={{ position: 'relative', py: 1 }}>
              <Box textAlign="center">
                <Typography variant="h6">Count Your Bad Habits</Typography>
                <Typography variant="body2">
                  Track your behavior and improve over time
                </Typography>
              </Box>

              <IconButton
                aria-label="menu"
                color="secondary"
                onClick={handleOpenMenu}
                sx={{
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Container>
        </Toolbar>
      </AppBar>

      <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            exportData();
          }}
        >
          <ListItemIcon>
            <FileDownloadOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export JSON</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleImportClick}>
          <ListItemIcon>
            <FileUploadOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Import JSON (replace)</ListItemText>
        </MenuItem>
      </Menu>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (!file) return;

          file
            .text()
            .then((text) => {
              importData(text);
            })
            .catch(() => {
              window.alert('Could not read file');
            });
        }}
      />
    </>
  );
});

export default Header;
