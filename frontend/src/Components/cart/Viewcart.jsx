import React, { useState, useEffect } from "react";
// import Heading4 from "../../form/common/heading/heading4";
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
import ShowErrorMessage from "../common/Error/filenotfound";
import "../../App.css";
const defaultTheme = createTheme();

const Viewcart = () => {
  const [cartData, setCartData] = useState([]);
  const [cartId, setCartId] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [refreshtwo, setRefreshTwo] = useState(false);

  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userdata"));
  const navigate = useNavigate();
  console.log("learnerId from viewcart", userData._id);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/showcart?learnerId=${userData._id}`
        );
        setCartData(response.data.courseId);
        console.log("cartData", cartData);
        setCartId(response.data._id);
        console.log("View cart response", response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refresh]);

  const removeCart = async (courseId) => {
    try {
      console.log(
        "From remove cart learnerId courseId",
        userData._id,
        courseId
      );
      const response = await axiosInstance.put("/removefromcart", {
        learnerId: userData._id,
        courseId: courseId,
      });
      console.log("View cart response", response);
      setRefresh(!refresh);
      // toast.success(response.data.message)
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };
  const sendSubscriptionRequest = async () => {
    try {
      console.log("From remove cart learnerId cartId", userData._id, cartId);
      const response = await axiosInstance.post("/transaction", {
        learnerId: userData._id,
        cartId: cartId,
      });
      console.log("View subscription response", response.data.message);
      toast.success(response.data.message);
      navigate("/subscriptions");
      setRefreshTwo(!refreshtwo);
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (cartData.length === 0) {
        setShowErrorMessage(true);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [cartData]);
  const handleRemoveClick = (courseId) => {
    removeCart(courseId);
    console.log("Category ID is ", categoryId);
  };
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
          Shopping Cart
        </Typography>

        {showErrorMessage ? (
          <ShowErrorMessage errorMessage={"No cart data to show"} />
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
                    <div className="product-removal">
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        style={{ backgroundColor: "maroon", color: "white" }}
                        onClick={() => handleRemoveClick(item._id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </Card>
                ))}

                <Button
                  variant="contained"
                  color="primary"
                  className="checkout"
                  style={{ margin: "20px auto", display: "block" }}
                  onClick={() => sendSubscriptionRequest()}
                >
                  Send Subscription Request
                </Button>
              </div>
            )}
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Viewcart;
