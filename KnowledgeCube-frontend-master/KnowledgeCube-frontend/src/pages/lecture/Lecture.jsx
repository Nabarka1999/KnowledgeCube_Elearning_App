import React, { useEffect, useState } from "react";
import "./lecture.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Loading from "../../components/loading/Loading";
import toast from "react-hot-toast";
import { IoCheckmarkDone } from "react-icons/io5";

const Lecture = ({ user }) => {
  const [lectures, setLectures] = useState([]);
  const [lecture, setLecture] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadLec, setLoadLec] = useState(false);
  const [show, setShow] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState("");
  const [videoPrev, setVideoPrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [completeProgress, setCompletedProgress] = useState("");
  const [LecComplete, setLecComplete] = useState("");
  const [lecLength, setLecLength] = useState("");
  const [progress, setProgress] = useState([]);

  if (user && user.role !== "admin" && !user.subscription.includes(params.id)) {
    return navigate("/");
  }

  async function fetchLectures() {
    try {
      const { data } = await axios.get(`${server}/api/lectures/${params.id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setLectures(data.lectures);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function fetchOneLecture(id) {
    setLoadLec(true);
    try {
      const { data } = await axios.get(`${server}/api/lecture/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setLecture(data.lecture);
      setLoadLec(false);
    } catch (error) {
      console.log(error);
      setLoadLec(false);
    }
  }

  const changeVideoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setVideoPrev(reader.result);
      setVideo(file);
    };
  };

  const submitHandler = async (e) => {
    setBtnLoading(true);
    e.preventDefault();
    const myForm = new FormData();

    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("file", video);

    try {
      const { data } = await axios.post(
        `${server}/api/course/${params.id}`,
        myForm,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      toast.success(data.message);
      setBtnLoading(false);
      setShow(false);
      fetchLectures();
      setTitle("");
      setDescription("");
      setVideo("");
      setVideoPrev("");
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (confirm("Are you sure that you want to delete this lecture?")) {
      try {
        const { data } = await axios.delete(`${server}/api/lecture/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        toast.success(data.message);
        fetchLectures();
        fetchProgress();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  async function fetchProgress() {
    try {
      const { data } = await axios.get(
        `${server}/api/user/progress?course=${params.id}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      setCompletedProgress(data.progressPercent);
      setLecComplete(data.completedLectures);
      setLecLength(data.allLectures);
      setProgress(data.progress);
    } catch (error) {
      console.error(error);
    }
  }

  const addProgress = async (id) => {
    try {
      const { data } = await axios.post(
        `${server}/api/user/progress?course=${params.id}&lectureId=${id}`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      console.log(data.message);
      fetchProgress();
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   console.log("Progress:", progress);
  // }, [progress]);

  useEffect(() => {
    fetchLectures();
    fetchProgress();
  }, []);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {user && user.role === "user" && (
            <div className="progress">
              Lecture Completed - {LecComplete} / {lecLength} <br />
              <progress value={completeProgress} max={100}></progress>{" "}
              {completeProgress}%
            </div>
          )}

          <div className="lec-page">
            <div className="lec-left">
              {loadLec ? (
                <Loading />
              ) : (
                <>
                  {lecture.video ? (
                    <>
                      <video
                        src={`${server}/${lecture.video}`}
                        width={"100%"}
                        controls
                        controlsList="nodownload noremoteplayback"
                        disablePictureInPicture
                        disableRemotePlayback
                        autoPlay
                        onEnded={() => addProgress(lecture._id)}
                      ></video>
                      <h1>{lecture.title}</h1>
                      <h3>{lecture.description}</h3>
                    </>
                  ) : (
                    <h1>Please select a lecture</h1>
                  )}
                </>
              )}
            </div>
            <div className="lec-right">
              {user && user.role === "admin" && (
                <button className="common-btn" onClick={() => setShow(!show)}>
                  {show ? "Close" : "Add lecture"}
                </button>
              )}

              {show && (
                <div className="lec-form">
                  <h2>Add lecture</h2>
                  <form action="" onSubmit={submitHandler}>
                    <label htmlFor="text">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />

                    <label htmlFor="text">Description</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />

                    <input
                      type="file"
                      placeholder="choose video"
                      onChange={changeVideoHandler}
                      required
                    />

                    {videoPrev && (
                      <video
                        src={videoPrev}
                        alt=""
                        width={300}
                        controls
                      ></video>
                    )}

                    <button
                      disabled={btnLoading}
                      type="submit"
                      className="common-btn"
                    >
                      {btnLoading ? "Please wait..." : "Add Now"}
                    </button>
                  </form>
                </div>
              )}

              {lectures && lectures.length > 0 ? (
                lectures.map((e, i) => {
                  return (
                    <>
                      <div
                        onClick={() => fetchOneLecture(e._id)}
                        key={e._id}
                        className={`lec-num ${
                          lecture._id === e._id && "active"
                        }`}
                      >
                        {i + 1}. {e.title}{" "}
                        {user &&
                          user.role === "user" && progress[0] &&
                          progress.completedLectures.includes(
                            e._id.toString()
                          ) && <IoCheckmarkDone />}
                      </div>
                      {user && user.role === "admin" && (
                        <button
                          onClick={() => deleteHandler(e._id)}
                          className="common-btn"
                        >
                          Delete {e.title}
                        </button>
                      )}
                    </>
                  );
                })
              ) : (
                <p>Stay tuned! Lectures are coming.</p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Lecture;
