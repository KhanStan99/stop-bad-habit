import { memo, useState } from 'react';
import dayjs from 'dayjs';
import moment from 'moment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Button from '@mui/material/Button';
import {
  Typography,
  FormControlLabel,
  RadioGroup,
  Radio,
  Paper,
  Stack,
} from '@mui/material';

const InputSection = memo(({ duration, setDuration, addData }) => {
  const [value, setValue] = useState(dayjs());

  return (
    <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="center"
        flexWrap="wrap"
        sx={{ mb: 2 }}
      >
        <Typography variant="body2" color="text.secondary">
          Calculation in:
        </Typography>
        <RadioGroup
          row
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          aria-label="calculation in"
          name="calculation-in"
        >
          <FormControlLabel value="days" control={<Radio />} label="Days" />
          <FormControlLabel value="hours" control={<Radio />} label="Hours" />
        </RadioGroup>
      </Stack>

      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="center"
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Select date and time"
            defaultValue={dayjs(moment())}
            value={value}
            format="DD-MM-YYYY hh:mm:ss a"
            onChange={setValue}
            slotProps={{
              textField: {
                size: 'small',
                sx: { width: { xs: '100%', sm: 360 } },
              },
            }}
          />
        </LocalizationProvider>
        <Button
          variant="contained"
          color="secondary"
          sx={{ width: 'auto', minWidth: 80, whiteSpace: 'nowrap' }}
          onClick={() => {
            setValue(dayjs());
            addData(value);
          }}
        >
          Add Now 😔
        </Button>
      </Stack>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mt: 1.5 }}
      >
        The goal is to not add anything—build your streak.
      </Typography>
    </Paper>
  );
});

export default InputSection;
