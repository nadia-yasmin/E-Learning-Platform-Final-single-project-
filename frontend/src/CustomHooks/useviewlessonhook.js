import { useState, useEffect } from "react";
import axiosInstance from "../Utils/axiosInstance";
const useviewlessonhook = (courseId, week) => {
  const [lessonData, setLessonData] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log("courseId,week from view lesson hook", courseId);
  const fetchData = async (week) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/showlessonbyweek?courseId=${courseId}&week=${week}`
      );
      console.log("Response  dekhay naaaaa", response);
      setLessonData(response.data.course);
      return response;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Re-throw the error to let the component handle it if needed.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array means this effect runs once when the component mounts.

  useEffect(() => {
    console.log("From hook in useeffect ", setLessonData);
  }, [setLessonData]);

  return { setLessonData, loading, fetchData };
};

export default useviewlessonhook;
