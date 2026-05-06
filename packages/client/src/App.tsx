import { useEffect, useState } from 'react'

import './App.css'

function App() {

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
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
  return (
    <main className='min-h-screen bg-gradient-to-b from-white via-orange-50 to-yellow-100 dark:from-gray-900 dark:via-slate-800 dark:to-slate-950 transition-colors duration-300 font-sans antialiased'>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p className='text-2xl font-bold text-center text-gray-800 dark:text-gray-200'>health check status: {message}</p>
      )}
    </main>
  )
}

export default App
