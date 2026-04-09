import React, { useState, useEffect } from 'react'
import './Alert.css'

const Alert = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      if (onClose) onClose()
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  const icons = {
    success: 'ri-checkbox-circle-line',
    error: 'ri-error-warning-line',
    warning: 'ri-alert-line',
    info: 'ri-information-line'
  }

  return (
    <div className={`alert alert-${type}`}>
      <i className={icons[type] || icons.info}></i>
      <span className="alert-message">{message}</span>
      <button className="alert-close" onClick={() => setVisible(false)}>×</button>
    </div>
  )
}

export default Alert