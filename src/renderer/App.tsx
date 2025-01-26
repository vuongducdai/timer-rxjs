import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Timer } from '../timer/Timer';

function Hello() {
  return (
    <Timer />
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
