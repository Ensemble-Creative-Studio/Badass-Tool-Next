import { useRef, useState, useEffect } from "react";

export default function VideoPlayer({ videoUrl, poster, onClose }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    videoRef.current.muted = !videoRef.current.muted;
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };
  

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleDurationChange = () => {
    setDuration(videoRef.current.duration);
  };

  useEffect(() => {
    const video = videoRef.current;
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
    };
  }, []);
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(document.fullscreenElement !== null);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);
  

  useEffect(() => {
    videoRef.current.play();
    setIsPlaying(true);
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const timeBarWidth = `${(currentTime / duration) * 100}%`;

  const handleTimeBarClick = (e) => {
    const timeBar = e.currentTarget;
    const rect = timeBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const barWidth = rect.width;
    const newTime = (clickX / barWidth) * duration;
    setCurrentTime(newTime);
    videoRef.current.currentTime = newTime;
  };

  const handleTimeBarDrag = (e) => {
    if (!isDragging) return;
    const timeBar = e.currentTarget;
    const rect = timeBar.getBoundingClientRect();
    const dragX = e.clientX - rect.left;
    const barWidth = rect.width;
    const newTime = (dragX / barWidth) * duration;
    setCurrentTime(newTime);
    videoRef.current.currentTime = newTime;
  };
  const handleVideoClick = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  

  return (
    <div className="player-container">
      <div   ref={containerRef} className="video-player  flex justify-center founder-regular ">
        <video
        className="w-full"
          ref={videoRef}
          src={videoUrl}
          onClick={handleVideoClick}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        ></video>
        <div className="controls">
          <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
          <div className="time">{formatTime(currentTime)}</div>
          <div className="time">{formatTime(duration)}</div>
          <button onClick={toggleMute}>{isMuted ? "Unmute" : "Mute"}</button>
          <button onClick={toggleFullScreen}>
            {isFullScreen ? "Minimize" : "Fullscreen"}
          </button>
        </div>
        <div
          className="timebar"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const newTime = (x / rect.width) * duration;
            setCurrentTime(newTime);
            videoRef.current.currentTime = newTime;
          }}
        >
          <div className="timebar-background"></div>
          <div
            className="timebar-current"
            style={{ width: timeBarWidth }}
          ></div>
        </div>
      </div>
      <div
        className="video-blur-overlay"
        onClick={() => {
          videoRef.current.pause();
          setIsPlaying(false);
          onClose();
        }}
      ></div>
    </div>
  );
}
