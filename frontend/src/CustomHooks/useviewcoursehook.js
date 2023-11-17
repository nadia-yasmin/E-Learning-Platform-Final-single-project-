import { useState, useEffect } from "react";
import axiosInstance from "../Utils/axiosInstance";
const useviewcoursehook = (courseId) => {
  const [courseData, setCourseData] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log("courseId from hook", courseId);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/getcoursebyid?courseId=${courseId}`
      );
      setCourseData(response.data.course);
      return response;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); 

  useEffect(() => {
    console.log("From hook in useeffect ", courseData);
  }, [courseData]);

  return { courseData, loading, fetchData };
};

export default useviewcoursehook;
