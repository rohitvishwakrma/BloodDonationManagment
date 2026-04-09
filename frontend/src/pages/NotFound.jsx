import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" style={styles.link}>Go Back Home</Link>
    </div>
  )
}

const styles = {
  container: { textAlign: 'center', padding: '100px', minHeight: '100vh' },
  link: { color: '#BF222B', textDecoration: 'underline' }
}

export default NotFound