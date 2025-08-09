import React, { useState } from 'react'
import ImageUpload from './components/ImageUpload'
import ImageGallery from './components/ImageGallery'

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Upload Section */}
        <ImageUpload onUploadSuccess={handleUploadSuccess} />

        {/* Gallery Section */}
        <ImageGallery refreshTrigger={refreshTrigger} />
      </main>
    </div>
  )
}

export default App