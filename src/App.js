import Prompt from './components/Prompt';
import logo from './images/Logo-removebg-preview.png';
import title from './images/image-removebg-preview (1).png';

function App() {
  return (
    <div className='bg-violet-200 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8'>
      <div className="flex flex-col items-center justify-center space-y-4 md:space-y-6">
        <img src={title} alt="Title" className='w-3/4 sm:w-2/3 md:w-1/2 lg:w-1/3 py-7' />
        <img src={logo} alt="Logo" className='w-3/4 sm:w-2/3 md:w-1/2 lg:w-1/3' />
      </div>
      <Prompt />
    </div>
  );
}

export default App;
