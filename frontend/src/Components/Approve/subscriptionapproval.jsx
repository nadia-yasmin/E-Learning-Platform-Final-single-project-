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

const Viewallsubscriptionrequests= () => {
  const {learnerId}=useParams()
  console.log("learnerId from view pending sub",learnerId)
  const [cartData, setCartData] = useState([]);
  const [message, setMessageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userdata"));
  console.log("learnerId from viewcart");
  const ApproveSubscriptionRequest = async (courseId) => {
    try {
      console.log(
        "From remove cart learnerId courseId",
        userData._id,
        courseId
      );
      const response = await axiosInstance.put(`/approverejectcourse?courseId=${courseId}&learnerId=${learnerId}`, {
        approve:true
      });
      console.log("Approve subscription response",response);
      toast.success(response.data.message);
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };
  const cancelSubscriptionRequest = async (courseId) => {
    try {
      console.log(
        "From remove cart learnerId courseId",
        userData._id,
        courseId
      );
      const response = await axiosInstance.put(`/approverejectcourse?courseId=${courseId}&learnerId=${learnerId}`, {
        approve:false
      });
      console.log("Cancel subscription response",response);
      toast.success(response.data.message);
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`showpendingcourse?learnerId=${learnerId}`);
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
        Subscription Request
      </Typography>

      {message === "No pending course to show" ? (
          <ShowErrorMessage errorMessage={"No pending course to show"} />
        ) : (
        <>
          {!cartData || cartData.length === 0 ? (
            <LinearColor />
          ) : (
            <div className="shopping-cart">
              {cartData.map((item) => (
                <Card key={item.courseId._id} className="product">
                  <CardMedia className="product-image">
                    <img
                      src={item.courseId.image}
                      alt={item.courseId.title}
                      style={{ width: "100px" }}
                    />
                  </CardMedia>
                  <CardContent className="product-details">
                    <Typography variant="h6" className="product-title">
                      {item.courseId.title}
                    </Typography>
                  </CardContent>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        style={{ backgroundColor: "green", color: "white" }}
                        onClick={() => ApproveSubscriptionRequest(item.courseId._id)}
                      >
                        Approve Request
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        style={{ backgroundColor: "maroon", color: "white" }}
                        onClick={() => cancelSubscriptionRequest(item.courseId._id)}
                      >
                        Cancel Request
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

export default Viewallsubscriptionrequests;
