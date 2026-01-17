import { memo, useState, useCallback } from 'react';
import dayjs from 'dayjs';
import { Box, Container } from '@mui/material';
import Header from './components/Header';
import InputSection from './components/InputSection';
import Stats from './components/Stats';

const App = memo(() => {
  const [duration, setDuration] = useState('days');
  const [data, setData] = useState(() => {
    const localData = localStorage.getItem('my_data');
    return localData ? JSON.parse(localData) : [];
  });

  const exportData = useCallback(() => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      data,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bad-habits-export-${dayjs().format('YYYY-MM-DD')}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [data]);

  const importData = useCallback((fileText) => {
    const parsed = JSON.parse(fileText);
    const imported = Array.isArray(parsed) ? parsed : parsed?.data;

    if (!Array.isArray(imported)) {
      throw new Error('Invalid import format');
    }

    localStorage.setItem('my_data', JSON.stringify(imported));
    setData(imported);
  }, []);

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
      <Header exportData={exportData} importData={importData} />
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

export default App;
