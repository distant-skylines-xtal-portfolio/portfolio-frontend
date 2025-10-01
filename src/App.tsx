import type {JSX} from 'react'
import MainCard from './components/MainCard';
import Layout from './components/Layout';
import NotFound from './pages/NotFound';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App():JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainCard />} />
          

          <Route path="*" element={<NotFound />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
