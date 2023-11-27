import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import LinearColor from "../../../Components/common/loader/loader";
import { useForm, Controller } from "react-hook-form";
import axiosInstance from "../../../Utils/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Showdiscussion = ({ lessonData }) => {
  console.log("lessonData", lessonData);
  const [cartData, setCartData] = useState([]);
  const [cartId, setCartId] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [refreshtwo, setRefreshTwo] = useState(false);

  const [showErrorMessage, setShowErrorMessage] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/showdiscussion?lessonId=${lessonData._id}`
        );
        console.log("View discussion response", response);
        setCartData(response.data.discussion);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refresh]);
  const Testimonial = ({ text, name, imageSrc, alt, role }) => (
    <Grid item xs={12} sm={6} md={3}>
      <ToastContainer />
      <Card>
        <CardContent>
          <div className="testimonial-bubble">
            <div className="testimonial-text">
              <Typography variant="body1" component="p">
                {text}
              </Typography>
            </div>
            <Typography variant="h6">{name}</Typography>
            <Typography variant="body2">{role}</Typography>
          </div>
          <div className="testimonial-author">
            <img src={imageSrc} alt={alt} />
          </div>
        </CardContent>
      </Card>
    </Grid>
  );

  //   if (loading) {
  //     return <LinearColor />;
  //   }
  console.log("cartData", cartData);
  return (
    <Grid item xs={12} md={12} className="your-center-class">
      <Grid container spacing={2}>
        {cartData && cartData.length > 0 ? (
          cartData.map((item) => (
            <React.Fragment key={item._id}>
              {item.learnerId && (
                <Testimonial
                  text={item.text}
                  name={item.learnerId.name}
                  imageSrc={item.learnerId.image}
                  role={item.learnerId.role}
                  alt={item.learnerId.name}
                />
              )}
              {item.instructorId && (
                <Testimonial
                  text={item.text}
                  name={item.instructorId.name}
                  imageSrc={item.instructorId.image}
                  role={item.instructorId.role}
                  alt={item.instructorId.name}
                />
              )}
            </React.Fragment>
          ))
        ) : (
          <LinearColor />
        )}
      </Grid>
    </Grid>
  );
};

export default Showdiscussion;
