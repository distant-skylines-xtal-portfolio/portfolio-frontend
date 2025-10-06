import type {JSX} from 'react'
import MainCard from './components/MainCard';
import Layout from './components/Layout';
import NotFound from './pages/NotFound';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';

function App():JSX.Element {

  console.log(`You are running this application in ${process.env.NODE_ENV}`)


  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<MainCard />} />
            

            <Route path="*" element={<NotFound />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
