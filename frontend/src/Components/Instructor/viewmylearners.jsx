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

const Viewmylearners = () => {
  const [cartData, setCartData] = useState([]);
  const [cartId, setCartId] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userdata"));
  const navigate = useNavigate();
//   const addToCart = async (courseId) => {
//     try {
//       console.log("courseId from view wishlist", courseId);
//       const response = await axiosInstance.post(
//         `/addtocart?courseId=${courseId}`,
//         {
//           learnerId: userData._id,
//         }
//       );
//       toast.success(response.data.message);
//       console.log("Add to cart response", response);
//     } catch (error) {
//       toast.error(error.response.data.message);
//       console.error("Error adding to cart:", error);
//     }
//   };
  const ApproveAssessRequest = (learnerId) => {
    console.log("Approve assess request", learnerId);
    navigate(`/viewmystudentsassignments/${learnerId}`);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log("learnerId from view subscription", userData._id);
        const response = await axiosInstance.get(
          `/showmystudents?instructorId=${userData._id}`
        );

        console.log("View my students response", response);
        setCartData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refresh]);
  console.log("cartData", cartData);
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
          My Students
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
                        alt={item.name}
                        style={{ width: "100px" }}
                      />
                    </CardMedia>
                    <CardContent className="product-details">
                      <Typography variant="h6" className="product-title">
                        {item.name}
                      </Typography>
                    </CardContent>
                    <div style={{ display: "flex", gap: "10px" }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        style={{ backgroundColor: "green", color: "white" }}
                        onClick={() => ApproveAssessRequest(item._id)}
                      >
                        Assess
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

export default Viewmylearners;
