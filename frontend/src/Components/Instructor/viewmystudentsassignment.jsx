import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import LinearColor from "../common/loader/loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../Utils/axiosInstance";
import { Button, TextField } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShowErrorMessage from "../common/Error/filenotfound";
import "../../App.css";


const defaultTheme = createTheme();

const Viewmystudentsassignments = () => {
    const [cartData, setCartData] = useState([]);
    const [cartId, setCartId] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const { learnerId } = useParams()
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const userData = JSON.parse(localStorage.getItem("userdata"));
    const navigate = useNavigate();
    const [score, setScore] = useState("");
  const handleMarksChange = (event) => {
    setScore(event.target.value);
    console.log("Score ", score);
  };
  const handleSubmit = async () => {
    try {
      await postData();
    } catch (error) {
      console.log("Error submitting form:", error);
    }
  };

 
  const postData= async () => {
    try {
        console.log("learnerId score", learnerId, score)
      const response = await axiosInstance.post(
        `/evaluateassignment`,
        {
          learnerId: learnerId,
          score: score,
        }
      );
      console.log("Marks added", response);

      toast.success(response.data.message);
      setRefresh(!refresh);
      return response;
    } catch (error) {
      toast(error.response.data.error);
      console.error("Error adding review", error);
      throw error;
    }
  };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.post(
                    `/viewmystudentsassignments?learnerId=${learnerId}`, {
                    instructorId: userData._id,
                }
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
                maxWidth="xl"
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
                    Assignment Evaluation
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
                                                src={item.assignment.learnerId.image}
                                                alt={item.assignment.learnerId.name}
                                                style={{ width: "100px" }}
                                            />
                                        </CardMedia>
                                        <CardContent className="product-details">
                                            <Typography variant="h6" className="product-title">
                                                {item.assignment.learnerId.name}
                                            </Typography>
                                            <Typography variant="h6" className="product-title">
                                                {item.courseTitle}
                                            </Typography>
                                            <Typography variant="h6" className="product-title">
                                                {item.lessonTitle}
                                            </Typography>
                                        </CardContent>
                                        <div style={{ display: "flex", gap: "10px" }}>
                                        <Button
                                                variant="outlined"
                                                color="primary"
                                                size="small"
                                                onClick={() => window.open(item.assignment.submission, "_blank")}
                                            >
                                                View Assignment
                                            </Button>

                                            <TextField
                                                id="outlined-basic"
                                                variant="outlined"
                                                type="number"
                                                name="score"
                                                placeholder="Please enter score"
                                                style={{ marginLeft: '20px', fontSize: '8px' }}
                                                value={score}
                                                onChange={handleMarksChange}
                                            />
                                            <Button
                                             type="submit"
                                                variant="contained"
                                                color="secondary"
                                                size="small"
                                                style={{ backgroundColor: "green", color: "white" }}
                                                onClick={handleSubmit}
                                            >
                                                Submit
                                            </Button>


                                            {/* <TextField
                    type="text"
                    className="tag form-control"
                    name="comment"
                    id="inlineFormInputName"
                    placeholder="Please enter your review"
                    value={reviewText}
                    onChange={handleReviewTextChange}
                  />
                  <input
                    type="hidden"
                    name="product_id"
                    value="your-product-id"
                  />
                </div>
                <div className="button-box">
                  <Button
                    type="submit"
                    // className="done btn btn-warning"
                    onClick={handleSubmit}
                  >
                    Add review
                  </Button> */}
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

export default Viewmystudentsassignments;
