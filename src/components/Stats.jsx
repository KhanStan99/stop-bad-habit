import { memo, useMemo } from 'react';
import moment from 'moment';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  IconButton,
} from '@mui/material';
import Tile from './Tile';

const Stats = memo(({ data, duration, removeData }) => {
  const now = moment();

  const {
    sortedDataAsc,
    sortedDataDesc,
    timeDifferences,
    averageTimeBetweenHabits,
    lastLogged,
    totalLogs,
  } = useMemo(() => {
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

    const lastLogged = sortedDataAsc[sortedDataAsc.length - 1];

    const uniqueDates = new Set(
      sortedDataAsc.map((date) => moment(date).format('YYYY-MM-DD'))
    );

    return {
      sortedDataAsc,
      sortedDataDesc,
      timeDifferences,
      averageTimeBetweenHabits,
      lastLogged,
      daysWithEntries: uniqueDates.size,
      longestGap: timeDifferences.length ? Math.max(...timeDifferences) : 0,
      totalLogs: sortedDataAsc.length,
    };
  }, [data, duration]);

  const timeSinceLastLogged = moment(now).diff(
    moment(lastLogged),
    duration,
    true
  );
  const firstLogged = moment(now).diff(
    moment(sortedDataAsc[0]),
    duration,
    true
  );

  const currentStreakDays = Math.max(
    0,
    Math.floor(moment(now).diff(moment(lastLogged), 'days', true))
  );

  const bestStreakDays = Math.max(
    currentStreakDays,
    ...sortedDataAsc
      .slice(1)
      .map((t, i) =>
        Math.max(
          0,
          Math.floor(moment(t).diff(moment(sortedDataAsc[i]), 'days', true))
        )
      )
  );

  const longestGap = timeDifferences.length ? Math.max(...timeDifferences) : 0;

  const liveAverage =
    (timeDifferences.reduce((sum, diff) => sum + diff, 0) +
      timeSinceLastLogged) /
    (timeDifferences.length + 1);

  const result = [
    {
      title: 'average',
      value: averageTimeBetweenHabits.toFixed(2),
      icon: '⏇',
    },
    {
      title: 'live average',
      value: liveAverage.toFixed(2),
      icon: 'ƒ',
    },
    {
      title: `last entry ${duration} ago`,
      value: timeSinceLastLogged.toFixed(2),
      icon: '⏰',
    },
    {
      title: 'longest gap',
      value: longestGap.toFixed(2),
      icon: '⬇️',
    },
  ];

    const capitalizeFirst = (text) =>
    typeof text === 'string' && text.length > 0
      ? text.charAt(0).toUpperCase() + text.slice(1)
      : text;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', gap: 8 }}>
        <Typography variant="caption" color="text.secondary">
          Stats are shown in{' '}
          <Box component="span" sx={{ fontWeight: 700 }}>
            {duration}
          </Box>
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 1.5,
            mt: 1,
            marginBottom: 2,
          }}
        >
          {result.map(({ title, value, icon }) => (
            <Tile key={title}>
              <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.15 }}>
                {value}
              </Typography>
              <Typography variant="caption">{icon} {capitalizeFirst(title)}</Typography>
            </Tile>
          ))}
        </Box>

        <Tile>
             <Typography variant="caption">
              <strong>{totalLogs}</strong> entries in last{' '}
              <strong>{firstLogged.toFixed(2)}</strong> {duration}
              <br />
              Current Streak: <strong>{currentStreakDays}</strong> Days 🔥 Best
              Streak: <strong>{bestStreakDays}</strong> Days
            </Typography>
        </Tile>
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
              afterTime = moment
                .duration(Math.abs(diff))
                .as(duration)
                .toFixed(2);
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

export default Stats;
