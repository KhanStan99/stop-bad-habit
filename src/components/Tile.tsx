import { Card, CardContent } from '@mui/material';

function Tile({
children,
}: {
children: React.ReactNode;  
}) {

  return (
    <Card
      variant="outlined"
      sx={{
        textAlign: 'center',
        width: '100%',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        borderColor: 'secondary.main',
        bgcolor: 'action.hover',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
          borderColor: 'primary.main',
          bgcolor: 'action.hover',
        },
        '&:active': {
          transform: 'scale(0.98)',
          boxShadow: 2,
        },
      }}
    >
      <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
       {children}
      </CardContent>
    </Card>
  );
}
Tile.displayName = 'Tile';
export default Tile;
