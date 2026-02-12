import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ReadingScreen from './pages/CallScreen'
import Fortune from './pages/Store'
import Ranking from './pages/Ranking'
import BottomNav from './components/BottomNav'

export default function App() {
    return (
        <div className="app-container">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/reading/:id" element={<ReadingScreen />} />
                <Route path="/fortune" element={<Fortune />} />
                <Route path="/ranking" element={<Ranking />} />
            </Routes>
            <BottomNav />
        </div>
    )
}
