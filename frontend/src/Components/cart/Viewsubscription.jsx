import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import LinearColor from "../common/loader/loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../Utils/axiosInstance";
import { Button } from "@mui/material";
import PendingActionsTwoToneIcon from "@mui/icons-material/PendingActionsTwoTone";
import ShowErrorMessage from "../common/Error/filenotfound";
import "../../App.css";
const defaultTheme = createTheme();

const Viewallsubscription = () => {
  const [cartData, setCartData] = useState([]);
  const [cartId, setCartId] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userdata"));
  const navigate = useNavigate();
  console.log("learnerId from viewcart");
  const cancelSubscriptionRequest = async (courseId) => {
    try {
      console.log(
        "From remove cart learnerId courseId",
        userData._id,
        courseId
      );
      const response = await axiosInstance.put("/cancelsubscriptionrequest", {
        learnerId: userData._id,
        courseId: courseId,
      });
      console.log("Cancel subscription response", response.data.message);
      toast.success(response.data.message);
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("learnerId from view subscription", userData._id);
        const response = await axiosInstance.post(`/viewallsubscription`, {
          learnerId: userData._id,
        });
        console.log(
          "View subscription response",
          response.data.transaction.courseId
        );
        setCartData(response.data.transaction.courseId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refresh]);

  return (
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
          Subscription requests
        </Typography>

        {showErrorMessage ? (
          <ShowErrorMessage
            errorMessage={"You did not request for subscription"}
          />
        ) : (
          <>
            {cartData.length === 0 ? (
              <LinearColor />
            ) : (
              <div className="shopping-cart">
                {cartData.map((item) => (
                  <Card key={item.productId} className="product">
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
                      <PendingActionsTwoToneIcon />
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        style={{ backgroundColor: "maroon", color: "white" }}
                        onClick={() => cancelSubscriptionRequest(item._id)}
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

export default Viewallsubscription;
