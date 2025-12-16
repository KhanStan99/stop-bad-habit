import { memo, useState, useCallback } from 'react';
import './App.css';
import dayjs from 'dayjs';
import moment from 'moment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Button from '@mui/material/Button';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
  FormControlLabel,
  RadioGroup,
  Radio,
  Paper,
  Stack,
} from '@mui/material';
import FunctionsIcon from '@mui/icons-material/Functions';
import ScheduleIcon from '@mui/icons-material/Schedule';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import DownloadIcon from '@mui/icons-material/Download';
import EventIcon from '@mui/icons-material/Event';
import RouteIcon from '@mui/icons-material/Route';

const App = memo(() => {
  const [duration, setDuration] = useState('days');
  const [data, setData] = useState(() => {
    const localData = localStorage.getItem('my_data');
    return localData ? JSON.parse(localData) : [];
  });

  const addData = useCallback(
    (value) => {
      const newData = [...data, value];
      localStorage.setItem('my_data', JSON.stringify(newData));
      setData(JSON.parse(localStorage.getItem('my_data')));
    },
    [data]
  );

  const removeData = useCallback(
    (index) => {
      const newData = data.filter((_, i) => i !== index);
      setData(newData);
      localStorage.setItem('my_data', JSON.stringify(newData));
    },
    [data]
  );

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <InputSection
            duration={duration}
            setDuration={setDuration}
            addData={addData}
          />
          {data.length > 0 && (
            <Stats data={data} duration={duration} removeData={removeData} />
          )}
        </Box>
      </Container>
    </>
  );
});

const Header = memo(() => (
  <AppBar
    position="sticky"
    color="default"
    elevation={0}
    sx={{ borderBottom: 1, borderColor: 'divider' }}
  >
    <Toolbar disableGutters>
      <Container maxWidth="sm">
        <Box textAlign="center" sx={{ py: 1 }}>
          <Typography variant="h6">Count Your Bad Habits</Typography>
          <Typography variant="body2" color="text.secondary">
            Track your behavior and improve over time
          </Typography>
        </Box>
      </Container>
    </Toolbar>
  </AppBar>
));

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
          color="primary"
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

const Stats = memo(({ data, duration, removeData }) => {
  const capitalizeFirst = (text) =>
    typeof text === 'string' && text.length > 0
      ? text.charAt(0).toUpperCase() + text.slice(1)
      : text;

  const sortedDataAsc = [...data].sort(
    (a, b) => moment(a).valueOf() - moment(b).valueOf()
  );
  const sortedDataDesc = [...sortedDataAsc].reverse();
  const timeDifferences = [];

  for (let i = 1; i < sortedDataAsc.length; i++) {
    const prevDate = moment(sortedDataAsc[i - 1]);
    const currentDate = moment(sortedDataAsc[i]);
    const diff = moment.duration(currentDate.diff(prevDate));
    timeDifferences.push(diff.as(duration));
  }

  const averageTimeBetweenHabits =
    timeDifferences.reduce((sum, diff) => sum + diff, 0) /
    (timeDifferences.length || 1);
  const firstLogged = moment().diff(moment(sortedDataAsc[0]), duration, true);

  const lastLogged = sortedDataAsc[sortedDataAsc.length - 1];
  const timeSinceLastLogged = moment().diff(moment(lastLogged), duration, true);

  const currentStreakDays = Math.max(
    0,
    Math.floor(moment().diff(moment(lastLogged), 'days', true))
  );
  const bestStreakDays = Math.max(
    currentStreakDays,
    ...sortedDataAsc
      .slice(1)
      .map((t, i) =>
        Math.max(0, Math.floor(moment(t).diff(moment(sortedDataAsc[i]), 'days', true)))
      )
  );

  const totalLogs = sortedDataAsc.length;
  const uniqueDates = new Set(
    sortedDataAsc.map((date) => moment(date).format('YYYY-MM-DD'))
  );
  const daysWithEntries = uniqueDates.size;

  const longestGap = timeDifferences.length ? Math.max(...timeDifferences) : 0;

  const result = [
    {
      title: 'average',
      value: averageTimeBetweenHabits.toFixed(2),
      icon: <FunctionsIcon fontSize="small" />,
    },
    { title: 'total entries', value: totalLogs, icon: <RouteIcon fontSize="small" /> },
    {
      title: 'since last entry',
      value: timeSinceLastLogged.toFixed(2),
      icon: <ScheduleIcon fontSize="small" />,
    },
    {
      title: 'current streak',
      value: `${String(currentStreakDays)} Days`,
      icon: <UpgradeIcon fontSize="small" />,
    },
    {
      title: 'best streak',
      value: `${String(bestStreakDays)} Days`,
      icon: <DownloadIcon fontSize="small" />,
    },
    {
      title: 'since first entry',
      value: firstLogged.toFixed(2),
      icon: <UpgradeIcon fontSize="small" />,
    },
    {
      title: 'longest gap',
      value: longestGap.toFixed(2),
      icon: <DownloadIcon fontSize="small" />,
    },

    { title: 'unique days', value: daysWithEntries, icon: <EventIcon fontSize="small" /> },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Stats are shown in{' '}
          <Box component="span" sx={{ fontWeight: 700 }}>
            {duration}
          </Box>
          .
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
            gap: 1.5,
            mt: 1,
          }}
        >
          {result.map(({ title, value, icon }) => (
            <Card
              variant="outlined"
              key={title}
              sx={{ textAlign: 'center', width: '100%' }}
            >
              <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
                <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.15 }}>
                  {value}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.75,
                    color: 'text.secondary',
                    mt: 0.75,
                  }}
                >
                  {icon} {capitalizeFirst(title)}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="h4" textAlign="center" sx={{ mb: 2 }}>
          History
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {sortedDataDesc.map((time, index) => {
            const originalIndex = data.findIndex((d) => d === time);
            let afterTime = '';

            if (index < sortedDataDesc.length - 1) {
              const diff = moment(time).diff(
                moment(sortedDataDesc[index + 1]),
                'milliseconds'
              );
              afterTime = moment.duration(Math.abs(diff)).as(duration).toFixed(2);
            }

            return (
              <Paper
                key={`${time}-${index}`}
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box>
                  {index < sortedDataDesc.length - 1 && (
                    <Typography variant="body2" color="text.secondary">
                      Gap {`${afterTime} ${duration}`}
                    </Typography>
                  )}

                  <Typography variant="body2">
                    {moment(time).format('DD-MM-YYYY | hh:mm:ss a')}
                  </Typography>
                </Box>

                <IconButton
                  aria-label="delete entry"
                  color="error"
                  onClick={() => {
                    if (originalIndex >= 0) removeData(originalIndex);
                  }}
                >
                  <DeleteForeverIcon />
                </IconButton>
              </Paper>
            );
          })}
        </Box>
      </Paper>
    </Box>
  );
});

export default App;
