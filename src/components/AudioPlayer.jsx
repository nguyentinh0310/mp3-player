import React, { Fragment, useEffect, useRef, useState } from "react";
import AudioControls from "./AudioControls";
import BackDrop from "./BackDrop";
import TimeBar from "./TimeBar";

const AudioPlayer = ({ songs }) => {
  const [songIndex, setSongIndex] = useState(0);
  const [progress, setProgess] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const { title, singer, color, image, audioSrc } = songs[songIndex];
 
  const audioRef = useRef(new Audio(audioSrc));
  const intervalRef = useRef();
  const isReady = useRef();

  const { duration } = audioRef.current;

  const currentPercentage = duration ? `${(progress / duration) * 100}%` : "0%";
  console.log(Math.round(parseInt(currentPercentage)));
  const trackStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #fff), color-stop(${currentPercentage}, #777))
  `;

  const handlePrevSong = () => {
    if (songIndex - 1 < 0) {
      // bài hát đầu lùi về sau set là bài hát cuối
      setSongIndex(songs.length - 1);
    } else {
      // songIndex--
      setSongIndex(songIndex - 1);
    }
  };
  const handleNextSong = () => {
    if (songIndex < songs.length - 1) {
      setSongIndex(songIndex + 1);
    } else {
      setSongIndex(0);
    }
  };

  const startTimer = () => {
    // Xóa mọi thời gian đã chạy
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        handleNextSong();
      } else {
        setProgess(audioRef.current.currentTime);
      }
    }, 1000);
  };

  const onSliders = (value) => {
    // Xóa mọi thời gian đã chạy
    clearInterval(intervalRef.current);

    audioRef.current.currentTime = value;
    setProgess(audioRef.current.currentTime);
  };

  const onSlidersEnd = () => {
    // nếu chưa phát thì chạy nhạc
    if (!isPlaying) {
      setIsPlaying(true);
    }
    startTimer();
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      startTimer();
    } else {
      audioRef.current.pause();
    }
    // eslint-disable-next-line
  }, [isPlaying]);

  // Xử lý dừng bài hát cũ sau khi nhận thay đổi ca khúc khác
  useEffect(() => {
    audioRef.current.pause();

    // xét bài hát mới va set lại tiến độ
    audioRef.current = new Audio(audioSrc);
    setProgess(audioRef.current.currentTime);

    if (isReady.current) {
      audioRef.current.play();
      setIsPlaying(true);
      startTimer();
    } else {
      //set isReady là true cho lần vượt qua tiếp theo
      isReady.current = true;
    }
    // eslint-disable-next-line
  }, [songIndex]);

  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Fragment>
      <div className="audio-player">
        <div className="song-info">
          <img
            className="img-song"
            src={image}
            alt={`track img-song for ${title} by ${singer}`}
          />
          <h2 className="title">{title}</h2>
          <h3 className="singer">{singer}</h3>
          <AudioControls
            isPlaying={isPlaying}
            onPrevClick={handlePrevSong}
            onNextClick={handleNextSong}
            onPlayPauseClick={setIsPlaying}
          />
          <input
            type="range"
            value={progress}
            step="1"
            min="0"
            max={duration ? duration : `${duration}`}
            className="progress"
            onChange={(e) => onSliders(e.target.value)}
            onMouseUp={onSlidersEnd}
            onKeyUp={onSlidersEnd}
            style={{ background: trackStyling }}
          />
          <TimeBar
            currentTime={audioRef.current.currentTime}
            duration={duration}
          />
        </div>
      </div>
      <BackDrop
        songIndex={songIndex}
        activeColor={color}
        isPlaying={isPlaying}
      />
    </Fragment>
  );
};

export default AudioPlayer;
