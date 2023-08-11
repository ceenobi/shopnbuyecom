import { useState, useEffect } from 'react'

const useDataFetching = (url, option, token) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!url) return
    const fetchdata = async () => {
      try {
        const res = await url(option, token)
        setData(res.data)
      } catch (error) {
        console.error(error)
        setError(error)
      } finally {
        setLoading(false)
      }
    }
    fetchdata()
  }, [url, option, token])

  return { data, loading, error, setData }
}

export default useDataFetching
