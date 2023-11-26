import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate ,Link} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../../Utils/axiosInstance"
import { Button } from "@mui/material";
import PendingActionsTwoToneIcon from "@mui/icons-material/PendingActionsTwoTone";
import ShowErrorMessage from "../../common/Error/filenotfound"
import LinearColor from "../../common/loader/loader"
import "../../../App.css"
const defaultTheme = createTheme();

const Viewalllearners = () => {
  const [cartData, setCartData] = useState([]);
  const [cartId, setCartId] = useState([]);
  const [refresh, setRefresh] = useState(false);
const navigate=useNavigate()
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userdata"));
  console.log("learnerId from viewcart");
//   const ApproveSubscriptionRequest = async (learnerId) => {
//     try {
//       console.log(
//         "learnerId",
//learnerId
//       );
//       const response = await axiosInstance.get("/cancelsubscriptionrequest");
//       console.log("Show all learners", response);
//     //   toast.success(response.data.message);
//     //   setRefresh(!refresh);
//     } catch (error) {
//       console.error("Error removing from cart:", error);
//     }
//   };
const ApproveSubscriptionRequest = (learnerId) => {
    navigate(`/approveorcancelsubscription/${learnerId}`)
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/showalllearners`)
        console.log(
          "View all learners",
          response
        );
        setCartData(response.data.learners);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refresh]);
console.log("cartData",cartData)
  return (
    // <div>Hi </div>
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
                    //(`/addlesson/${courseId}`)
                    <Link to={`/approvecancelsubscription/${item._id}`}>
                  <Card key={item.productId} className="product">
                    <CardMedia className="product-image">
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: "100px" }}
                      />
                    </CardMedia>
                    <CardContent className="product-details">
                      <Typography variant="h6" className="product-name">
                        {item.name}
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
                        View Profile
                      </Button>
                      
                    </div>
                  </Card>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Viewalllearners;
