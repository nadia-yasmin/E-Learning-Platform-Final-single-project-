import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate ,useParams} from "react-router-dom";
import LinearColor from "../common/loader/loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../Utils/axiosInstance";
import { Button } from "@mui/material";
import PendingActionsTwoToneIcon from "@mui/icons-material/PendingActionsTwoTone";
import ShowErrorMessage from "../common/Error/filenotfound";
import "../../App.css";
const defaultTheme = createTheme();

const Viewunapprovedcourse= () => {
  
  const [cartData, setCartData] = useState([]);
  const [message, setMessageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const [showErrorMessage, setShowErrorMessage] = useState(false);


  const ApproveSubscriptionRequest = async (courseId) => {
    try {
      console.log(
        "From remove cart learnerId courseId",
        courseId
      );
      const response = await axiosInstance.put(`/approvecoursecreation?courseId=${courseId}`, {
        approve:true
      });
      console.log("Approve course addition",response);
      toast.success(response.data.message);
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };
  const cancelSubscriptionRequest = async (courseId) => {
    try {
      console.log(
        "Cancel approval courseId",
       
        courseId
      );
      const response = await axiosInstance.put(`/approvecoursecreation?courseId=${courseId}`, {
        approve:false
      });
      console.log("Cancel subscription response",response);
      toast.error(response.data.message);
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`viewunapprovedcourse`);
        console.log(response)
        setCartData(response.data.data);
        setMessageData(response.data.message)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
        setShowErrorMessage(true);
      }
    };
    fetchData();
  }, [refresh]);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setShowErrorMessage(true);
      }
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [loading]);
  

  return (
    // <div>Hi</div>
    <ThemeProvider theme={defaultTheme}>
    <CssBaseline />
    <Container
      maxWidth="md"
      style={{
        paddingTop: "20px",
        paddingBottom: "20px",
        minHeight: "100vh",
      }}
    >
      <ToastContainer />
      <Typography
        variant="h4"
        style={{
          color: "#00695f",
          textAlign: "center",
          fontSize: "1.5rem",
          marginBottom: "50px",
        }}
      >
        Course Publishment
      </Typography>

      {message === "Course not found" ? (
          <ShowErrorMessage errorMessage={"Course not found"} />
        ) : (
        <>
          {!cartData || cartData.length === 0 ? (
            <LinearColor />
          ) : (
            <div className="shopping-cart">
              {cartData.map((item) => (
                <Card key={item._id} className="product">
                  <CardMedia className="product-image">
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: "100px" }}
                    />
                  </CardMedia>
                  <CardContent className="product-details">
                    <Typography variant="h6" className="product-title">
                      {item.title}
                    </Typography>
                  </CardContent>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        style={{ backgroundColor: "green", color: "white" }}
                        onClick={() => ApproveSubscriptionRequest(item._id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        style={{ backgroundColor: "maroon", color: "white" }}
                        onClick={() => cancelSubscriptionRequest(item._id)}
                      >
                        Cancel
                      </Button>
                    </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </Container>
  </ThemeProvider>
);
};

export default Viewunapprovedcourse;
