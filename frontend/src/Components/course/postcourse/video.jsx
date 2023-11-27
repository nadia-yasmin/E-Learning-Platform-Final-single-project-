import React from "react";
import { useRecordWebcam } from "react-record-webcam";
import "../../../App.css";

export default function RecordVideo() {
  const {
    activeRecordings,
    cancelRecording,
    clearPreview,
    closeCamera,
    createRecording,
    devicesByType,
    devicesById,
    download,
    muteRecording,
    openCamera,
    pauseRecording,
    resumeRecording,
    startRecording,
    stopRecording,
  } = useRecordWebcam();

  const [videoDeviceId, setVideoDeviceId] = React.useState("");
  const [audioDeviceId, setAudioDeviceId] = React.useState("");

  const handleSelect = async (event) => {
    const { deviceid: deviceId } =
      event.target.options[event.target.selectedIndex].dataset;
    if (devicesById[deviceId].type === "videoinput") {
      setVideoDeviceId(deviceId);
    }
    if (devicesById[deviceId].type === "audioinput") {
      setAudioDeviceId(deviceId);
    }
  };

  const start = async () => {
    const recording = await createRecording(videoDeviceId, audioDeviceId);
    if (recording) await openCamera(recording.id);
  };
  const saveAndSendToBackend = async (recording) => {
    const videoBlobUrl = recording.objectURL;
    const videoBlob = await fetch(videoBlobUrl).then((res) => res.blob());
    console.log(videoBlob);
    const videoDataURL = URL.createObjectURL(videoBlob);
    localStorage.setItem("recordedVideo", videoDataURL);
    let videoFilename = "dummy.mp4";
    const backendEndpoint = "http://localhost:3001/upload";
    const formData = new FormData();
    formData.append("video", videoBlob, videoFilename);

    fetch(backendEndpoint, {
      method: "POST",
      body: formData,
      headers: {
        userName: "some token?",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Video sent to backend:", data);
      })
      .catch((error) => {
        console.error("Error sending video to backend:", error);
      });
  };
  return (
    <div>
      <div className="input">
        <div>
          <h4>Select video input</h4>
          <select className="input-select" onChange={handleSelect}>
            {devicesByType?.video?.map((device) => (
              <option key={device.deviceId} data-deviceid={device.deviceId}>
                {device.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h4>Select audio input</h4>
          <select className="input-select" onChange={handleSelect}>
            {devicesByType?.audio?.map((device) => (
              <option key={device.deviceId} data-deviceid={device.deviceId}>
                {device.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="input-start">
        <button onClick={start}>Open camera</button>
      </div>
      <div className="devices">
        {activeRecordings?.map((recording) => (
          <div className="device" key={recording.id}>
            <p>Live</p>
            <div className="device-list">
              <small>Status: {recording.status}</small>
              <small>Video: {recording.videoLabel}</small>
              <small>Audio: {recording.audioLabel}</small>
            </div>
            <video ref={recording.webcamRef} loop autoPlay playsInline />
            <div className="controls">
              <button
                disabled={
                  recording.status === "RECORDING" ||
                  recording.status === "PAUSED"
                }
                onClick={() => startRecording(recording.id)}
              >
                Record
              </button>
              <button
                disabled={
                  recording.status !== "RECORDING" &&
                  recording.status !== "PAUSED"
                }
                onClick={() =>
                  recording.status === "PAUSED"
                    ? resumeRecording(recording.id)
                    : pauseRecording(recording.id)
                }
              >
                {recording.status === "PAUSED" ? "Resume" : "Pause"}
              </button>
              <button
                className={recording.isMuted ? "selected" : ""}
                onClick={() => muteRecording(recording.id)}
              >
                Mute
              </button>
              <button
                disabled={recording.status !== "RECORDING"}
                onClick={() => stopRecording(recording.id)}
              >
                Stop
              </button>
              <button onClick={() => cancelRecording(recording.id)}>
                Cancel
              </button>
            </div>
            <div className="preview">
              <p>Preview</p>
              <video ref={recording.previewRef} autoPlay loop playsInline />
              <div className="controls">
                <button onClick={() => download(recording.id)}>Download</button>
                <button onClick={() => clearPreview(recording.id)}>
                  {/* {recording.objectURL} */}
                  Clear preview
                </button>
                <button onClick={() => saveAndSendToBackend(recording)}>
                  Upload
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
