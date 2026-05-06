import { useEffect, useState } from 'react'

import './App.css'
import { Button } from './components/ui/button';

function App() {

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isShowHealth, setIsShowHealth] = useState(false);
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setMessage(JSON.stringify(data));
      })
      .catch(err => {
        console.log(err);
        setMessage(JSON.stringify(err));
      })
      .finally(() => {
        setLoading(false);
      })
  }, [])

  const getHealthCheckStatus = () => {
    setLoading(true);
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setMessage(JSON.stringify(data));
      })
      .catch(err => {
        console.log(err);
        setMessage(JSON.stringify(err));
      })
      .finally(() => {
        setLoading(false);
      })
  }
  return (
    <>
      <Button variant="outline" onClick={() => {
        getHealthCheckStatus();
        setIsShowHealth(!isShowHealth)
      }}>{isShowHealth ? `Hide Health` : `Click to view Health`}</Button>
      {isShowHealth && <p className='text-center text-2xl font-bold mt-4'>health check status: {loading ? "Loading..." : message}</p>}
    </>
  )
}

export default App
