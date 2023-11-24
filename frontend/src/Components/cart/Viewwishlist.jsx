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
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShowErrorMessage from "../common/Error/filenotfound";
import "../../App.css";
const defaultTheme = createTheme();

const Viewwishlist = () => {
  const [cartData, setCartData] = useState([]);
  const [cartId, setCartId] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userdata"));
  const navigate = useNavigate();
  const addToCart = async (courseId) => {
    try {
      console.log("courseId from view wishlist", courseId);
      const response = await axiosInstance.post(
        `/addtocart?courseId=${courseId}`,
        {
          learnerId: userData._id,
        }
      );
      toast.success(response.data.message);
      console.log("Add to cart response", response);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error adding to cart:", error);
    }
  };
  const handleAddToCart = (courseId) => {
    console.log("this is working", courseId);
    addToCart(courseId);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log("learnerId from view subscription", userData._id);
        const response = await axiosInstance.get(
          `/showwishlist?learnerId=${userData._id}`
        );

        // console.log("View wishlist response", response.data.wishlist);
        setCartData(response.data.wishlist);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refresh]);
  console.log("cartData", cartData);
  return (
    // <div>Hi</div>000
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
                        // style={{ backgroundColor: "maroon", color: "white" }}
                        onClick={() => {
                          console.log("Clicked. Item ID:", item);
                          handleAddToCart(item._id);
                        }}
                      >
                        <ShoppingCartIcon />
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

export default Viewwishlist;
