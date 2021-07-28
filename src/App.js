import AudioPlayer from 'components/AudioPlayer';
import songs from 'songs';
import './App.css';

function App() {
  return (
    <div className="player">
      <AudioPlayer songs={songs}/>
    </div>
  );
}

export default App;
