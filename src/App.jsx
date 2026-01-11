import { useState, useEffect } from 'react'
import './App.css'

// Components
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Footer from './components/Footer'

function App() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className={`app ${isLoaded ? 'loaded' : ''}`}>
      {/* Background Decorations */}
      <div className="bg-gradient-blur top-right" />
      <div className="bg-gradient-blur bottom-left" />

      <Header />

      <main>
        <Hero />
        <About />
        <Projects />
      </main>

      <Footer />
    </div>
  )
}

export default App

