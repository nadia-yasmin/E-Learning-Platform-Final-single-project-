import { useState, useEffect } from "react";
import axiosInstance from "../Utils/axiosInstance";
const useCourseHook = () => {
  const [courseData, setCourseData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/getcourses");
      const data = response.data;
      console.log("Data from hook ", data);
      setCourseData(data.data);
      return data;
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
    console.log("From hook in useeffect ", courseData);
  }, [courseData]);

  return { courseData, loading };
};

export default useCourseHook;
